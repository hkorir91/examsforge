const express = require('express');
const rateLimit = require('express-rate-limit');
const Anthropic = require('@anthropic-ai/sdk');
const Exam = require('../models/Exam');
const User = require('../models/User');
const QuestionBank = require('../models/QuestionBank');
const { protect } = require('../middleware/auth');
const {
  buildHybridExamPrompt,
  buildFallbackExamPrompt,
  validateExamParams,
  selectBalancedQuestions,
  getDuration,
} = require('../utils/examHelpers');

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Helpers ──────────────────────────────────────────────

/**
 * Recalculates section.marks from the actual question marks.
 * Fixes the bug where AI returns 0 for section marks.
 */
function recalculateSectionMarks(section) {
  if (!section?.questions?.length) return section;
  const calculated = section.questions.reduce((sum, q) => {
    if (Array.isArray(q.subParts) && q.subParts.length > 0) {
      return sum + q.subParts.reduce((s, sp) => s + (Number(sp.marks) || 0), 0);
    }
    return sum + (Number(q.marks) || 0);
  }, 0);
  return { ...section, marks: calculated };
}

/**
 * Returns the default section count for a given exam type.
 */
function getDefaultSectionCount(examType) {
  if (['End Term', 'Mock', 'Pre-Mock'].includes(examType)) return 3;
  if (examType === 'Midterm') return 2;
  return 1; // CAT
}

// ── Rate limit ───────────────────────────────────────────
const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: {
    error: 'Generation limit reached. Please wait before generating more exams.',
    code: 'RATE_LIMIT',
  },
});

// ── POST /api/exams/generate ─────────────────────────────
router.post('/generate', protect, generateLimiter, async (req, res) => {
  const startTime = Date.now();

  try {
    // 1. Validate input
    const {
      grade, subject, strands, substrands, examType, term, year,
      totalMarks, totalQuestions, school,
      sectionCount: requestedSectionCount,
      showStrand,
    } = req.body;

    // Basic field check before full validation
    if (!grade) return res.status(400).json({ error: 'Please select a Grade.', code: 'MISSING_FIELD' });
    if (!subject) return res.status(400).json({ error: 'Please select a Subject.', code: 'MISSING_FIELD' });
    if (!strands?.length) return res.status(400).json({ error: 'Please select at least one Strand.', code: 'MISSING_FIELD' });
    if (!school?.trim()) return res.status(400).json({ error: 'Please enter your School Name.', code: 'MISSING_FIELD' });

    const validationError = validateExamParams(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError, code: 'VALIDATION_ERROR' });
    }

    // 2. Check generation quota
    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ error: 'Session expired. Please log in again.', code: 'AUTH_ERROR' });

    if (!user.canGenerate()) {
      return res.status(403).json({
        error: 'You have used all your free exams. Upgrade to Premium to continue generating.',
        code: 'QUOTA_EXCEEDED',
        upgradeRequired: true,
      });
    }

    // Resolve sectionCount — use request value or smart default
    const sectionCount = requestedSectionCount || getDefaultSectionCount(examType);

    // 3. Query question bank
    let questionPool = [];
    let isHybrid = false;
    let questionBankHits = 0;

    try {
      questionPool = await QuestionBank.getPoolForGeneration({
        grade, subject,
        strands: strands || [],
        substrands: substrands || [],
        totalMarks,
        totalQuestions,
      });
      questionBankHits = questionPool.length;
      isHybrid = questionBankHits >= Math.ceil(totalQuestions * 0.5);
    } catch (bankErr) {
      console.warn('Question bank query failed, using Machine fallback:', bankErr.message);
    }

    // 4. Build prompt
    let prompt;
    if (isHybrid) {
      const { sectionA: sectionASeeds, sectionB: sectionBSeeds, sectionC: sectionCSeeds } =
        selectBalancedQuestions(questionPool, totalMarks, totalQuestions);

      prompt = buildHybridExamPrompt({
        grade, subject, strands, substrands, examType, term, year,
        totalMarks, totalQuestions, school, sectionCount,
        sectionASeeds, sectionBSeeds, sectionCSeeds,
      });

      const usedIds = [...sectionASeeds, ...sectionBSeeds, ...sectionCSeeds]
        .map(q => q._id).filter(Boolean);
      if (usedIds.length > 0) {
        QuestionBank.updateMany({ _id: { $in: usedIds } }, { $inc: { timesUsed: 1 } })
          .catch(err => console.warn('Failed to update timesUsed:', err.message));
      }
    } else {
      prompt = buildFallbackExamPrompt({
        grade, subject, strands, substrands, examType, term, year,
        totalMarks, totalQuestions, school, sectionCount,
      });
    }

    // 5. Call Machine with 45-second timeout
    const TIMEOUT_MS = 45000;

    // Auto-retry once on timeout or network blip
    let message;
    let attempts = 0;
    const maxAttempts = 2;
    let lastClaudeErr = null;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const freshTimeout = new Promise((_, reject) =>
          setTimeout(() => reject({ isTimeout: true }), TIMEOUT_MS)
        );
        message = await Promise.race([
          anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 6000,
            messages: [{ role: 'user', content: prompt }],
          }),
          freshTimeout,
        ]);
        lastClaudeErr = null;
        break; // success — exit retry loop
      } catch (err) {
        lastClaudeErr = err;
        if (err.isTimeout || err.status === 529 || err.status === 503) {
          if (attempts < maxAttempts) {
            console.warn(`Attempt ${attempts} failed (${err.isTimeout ? 'timeout' : err.status}), retrying...`);
            await new Promise(r => setTimeout(r, 2000)); // wait 2s before retry
            continue;
          }
        }
        break; // non-retryable error — exit loop
      }
    }

    if (lastClaudeErr) {
      const claudeErr = lastClaudeErr;
      if (claudeErr.isTimeout) {
        return res.status(504).json({
          error: 'The Machine took too long to respond. Please try again.',
          code: 'TIMEOUT',
        });
      }
      if (claudeErr.status === 401 || claudeErr.status === 403) {
        return res.status(500).json({
          error: 'Machine service authentication failed. Please contact support.',
          code: 'AUTH_ERROR',
        });
      }
      if (claudeErr.status === 429) {
        return res.status(429).json({
          error: 'Machine is overloaded right now. Please try again in 2 minutes.',
          code: 'RATE_LIMIT',
        });
      }
      if (claudeErr.status === 529 || claudeErr.status === 503) {
        return res.status(503).json({
          error: 'Machine service is temporarily unavailable. Please try again shortly.',
          code: 'SERVICE_DOWN',
        });
      }
      throw claudeErr;
    }

    // 6. Parse response
    const rawText = message.content.map((b) => b.text || '').join('');
    const cleanText = rawText.replace(/```json|```/g, '').trim();

    let examData;
    try {
      examData = JSON.parse(cleanText);
    } catch (parseErr) {
      console.error('Machine response parse error. Snippet:', rawText.substring(0, 300));
      return res.status(500).json({
        error: 'The Machine returned an unexpected response. Please try again.',
        code: 'PARSE_ERROR',
      });
    }

    // 7. Fix section marks (recalculate from actual question marks — fixes 0-mark bug)
    examData.sectionA = recalculateSectionMarks(examData.sectionA);
    examData.sectionB = recalculateSectionMarks(examData.sectionB);
    examData.sectionC = recalculateSectionMarks(examData.sectionC);

    // 8. Clear sections beyond sectionCount
    const empty = { questions: [], marks: 0, instruction: '' };
    if (sectionCount < 3) examData.sectionC = empty;
    if (sectionCount < 2) examData.sectionB = empty;

    const generationTimeMs = Date.now() - startTime;
    const duration = getDuration(examType, totalMarks);

    // 9. Save exam to database
    let exam;
    try {
      exam = await Exam.create({
        user: user._id,
        title: examData.title || `${grade} ${subject} ${examType}`,
        school,
        grade,
        subject,
        strands: strands || [],
        substrands: substrands || [],
        strand: strands?.[0] || '',
        substrand: substrands?.[0] || '',
        examType,
        term,
        year: String(year),
        totalMarks,
        totalQuestions,
        duration: examData.time || duration,
        instructions: examData.instructions || [],
        sectionA: examData.sectionA || {},
        sectionB: examData.sectionB || {},
        sectionC: examData.sectionC || {},
        showStrand: showStrand !== undefined ? showStrand : true,
        sectionCount,
        isHybrid,
        questionBankHits,
        aiModel: 'claude-sonnet-4-5',
        generationTimeMs,
      });
    } catch (saveErr) {
      console.error('Exam save error:', saveErr);
      return res.status(500).json({
        error: 'Your exam was generated but could not be saved. Please try again.',
        code: 'SAVE_ERROR',
      });
    }

    // 10. Update user usage counters
    if (!user.isPremium()) {
      user.freeGenerationsUsed += 1;
    }
    user.totalExamsGenerated += 1;
    await user.save({ validateBeforeSave: false });

    const isHybridResult = isHybrid;
    const bankHits = questionBankHits > 0
      ? `${questionBankHits} questions sourced from question bank`
      : 'Generated entirely by Machine';

    res.status(201).json({
      message: `Exam generated in ${(generationTimeMs / 1000).toFixed(1)}s. ${bankHits}.`,
      exam,
      meta: { isHybrid: isHybridResult, questionBankHits, generationTimeMs },
      usage: {
        freeGenerationsUsed: user.freeGenerationsUsed,
        freeGenerationsLeft: Math.max(0, 3 - user.freeGenerationsUsed),
        isPremium: user.isPremium(),
      },
    });

  } catch (err) {
    console.error('Generate exam error:', err);
    res.status(500).json({
      error: 'Exam generation failed. Please try again.',
      code: 'UNKNOWN',
    });
  }
});

// ── GET /api/exams ───────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };
    if (req.query.grade) filter.grade = req.query.grade;
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.examType) filter.examType = req.query.examType;

    const [exams, total] = await Promise.all([
      Exam.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-sectionA.questions.answer -sectionB.questions.answer -sectionC.questions.answer'),
      Exam.countDocuments(filter),
    ]);

    res.json({ exams, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('List exams error:', err);
    res.status(500).json({ error: 'Could not retrieve exams. Please try again.' });
  }
});

// ── GET /api/exams/:id ───────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const exam = await Exam.findOne({ _id: req.params.id, user: req.user._id });
    if (!exam) return res.status(404).json({ error: 'Exam not found.' });
    res.json({ exam });
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve exam.' });
  }
});

// ── PATCH /api/exams/:id ─────────────────────────────────
router.patch('/:id', protect, async (req, res) => {
  try {
    const allowed = ['title', 'instructions', 'sectionA', 'sectionB', 'sectionC'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const exam = await Exam.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true }
    );
    if (!exam) return res.status(404).json({ error: 'Exam not found.' });
    res.json({ message: 'Exam updated.', exam });
  } catch (err) {
    res.status(500).json({ error: 'Could not update exam.' });
  }
});

// ── DELETE /api/exams/:id ────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const exam = await Exam.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!exam) return res.status(404).json({ error: 'Exam not found.' });
    res.json({ message: 'Exam deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete exam.' });
  }
});

// ── POST /api/exams/:id/download ─────────────────────────
router.post('/:id/download', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.isPremium()) {
      return res.status(403).json({
        error: 'PDF download requires a Premium subscription.',
        code: 'UPGRADE_REQUIRED',
      });
    }
    await Exam.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });
    res.json({ message: 'Download recorded.' });
  } catch (err) {
    res.status(500).json({ error: 'Could not process download.' });
  }
});

// ── GET /api/exams/bank/stats ─────────────────────────────
router.get('/bank/stats', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    const stats = await QuestionBank.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: { grade: '$grade', subject: '$subject' },
          count: { $sum: 1 },
          avgMarks: { $avg: '$marks' },
        }
      },
      { $sort: { '_id.grade': 1, '_id.subject': 1 } },
    ]);
    const total = await QuestionBank.countDocuments({ isActive: true });
    res.json({ total, breakdown: stats });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch bank stats.' });
  }
});

module.exports = router;
