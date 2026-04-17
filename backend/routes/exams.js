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

// Rate limit exam generation
const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: { error: 'Generation limit reached. Please wait before generating more exams.' },
});

// ── POST /api/exams/generate ─────────────────────────────
router.post('/generate', protect, generateLimiter, async (req, res) => {
  const startTime = Date.now();

  try {
    // 1. Validate input
    const {
      grade, subject, strands, substrands, examType, term, year,
      totalMarks, totalQuestions, school,
    } = req.body;

    const validationError = validateExamParams(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // 2. Check generation quota
    const user = await User.findById(req.user._id);
    if (!user.canGenerate()) {
      return res.status(403).json({
        error: 'Free generation limit reached.',
        code: 'QUOTA_EXCEEDED',
        upgradeRequired: true,
      });
    }

    // 3. HYBRID STEP: Query question bank for matching pool
    let questionPool = [];
    let isHybrid = false;
    let questionBankHits = 0;

    try {
      questionPool = await QuestionBank.getPoolForGeneration({
        grade,
        subject,
        strands: strands || [],
        substrands: substrands || [],
        totalMarks,
        totalQuestions,
      });
      questionBankHits = questionPool.length;
      isHybrid = questionBankHits >= Math.ceil(totalQuestions * 0.5); // hybrid if ≥50% coverage
    } catch (bankErr) {
      console.warn('Question bank query failed, using fallback:', bankErr.message);
    }

    // 4. Build prompt based on availability
    let prompt;

    if (isHybrid) {
      // Select balanced question set from pool
      const { sectionA: sectionASeeds, sectionB: sectionBSeeds, sectionC: sectionCSeeds } =
        selectBalancedQuestions(questionPool, totalMarks, totalQuestions);

      prompt = buildHybridExamPrompt({
        grade, subject, strands, substrands, examType, term, year,
        totalMarks, totalQuestions, school,
        sectionASeeds,
        sectionBSeeds,
        sectionCSeeds,
      });

      // Increment usage counter on used questions
      const usedIds = [...sectionASeeds, ...sectionBSeeds, ...sectionCSeeds]
        .map(q => q._id)
        .filter(Boolean);
      if (usedIds.length > 0) {
        QuestionBank.updateMany(
          { _id: { $in: usedIds } },
          { $inc: { timesUsed: 1 } }
        ).catch(err => console.warn('Failed to update timesUsed:', err.message));
      }
    } else {
      // Fallback: pure AI generation (no MCQ enforced by prompt)
      prompt = buildFallbackExamPrompt({
        grade, subject, strands, substrands, examType, term, year,
        totalMarks, totalQuestions, school,
      });
    }

    // 5. Call Claude AI
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = message.content.map((b) => b.text || '').join('');
    const cleanText = rawText.replace(/```json|```/g, '').trim();

    let examData;
    try {
      examData = JSON.parse(cleanText);
    } catch (parseErr) {
      console.error('AI response parse error:', parseErr);
      console.error('Raw response snippet:', rawText.substring(0, 500));
      return res.status(500).json({ error: 'Failed to parse AI response. Please try again.' });
    }

    const generationTimeMs = Date.now() - startTime;
    const duration = getDuration(examType, totalMarks);

    // 6. Save exam to database
    const exam = await Exam.create({
      user: user._id,
      title: examData.title || `${grade} ${subject} ${examType}`,
      school,
      grade,
      subject,
      strands: strands || [],
      substrands: substrands || [],
      strand: strands?.[0] || '',      // legacy compat
      substrand: substrands?.[0] || '', // legacy compat
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
      isHybrid,
      questionBankHits,
      aiModel: 'claude-sonnet-4-20250514',
      generationTimeMs,
    });

    // 7. Update user usage counters
    if (!user.isPremium()) {
      user.freeGenerationsUsed += 1;
    }
    user.totalExamsGenerated += 1;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      message: 'Exam generated successfully.',
      exam,
      meta: {
        isHybrid,
        questionBankHits,
        generationTimeMs,
      },
      usage: {
        freeGenerationsUsed: user.freeGenerationsUsed,
        freeGenerationsLeft: Math.max(0, 3 - user.freeGenerationsUsed),
        isPremium: user.isPremium(),
      },
    });
  } catch (err) {
    if (err.status === 401) {
      return res.status(500).json({ error: 'AI service authentication failed. Check your API key.' });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: 'AI service rate limit hit. Please try again in a moment.' });
    }
    console.error('Generate exam error:', err);
    res.status(500).json({ error: 'Exam generation failed. Please try again.' });
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

    res.json({
      exams,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('List exams error:', err);
    res.status(500).json({ error: 'Could not retrieve exams.' });
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
// Returns question bank coverage stats (admin use)
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
