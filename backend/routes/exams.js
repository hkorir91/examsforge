const express = require('express');
const rateLimit = require('express-rate-limit');
const Anthropic = require('@anthropic-ai/sdk');
const Exam = require('../models/Exam');
const User = require('../models/User');
const QuestionBank = require('../models/QuestionBank');
const ExamJob = require('../models/ExamJob');          // ← NEW
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

// FIX 2: Added End Year and Series to the 3-section list
function getDefaultSectionCount(examType) {
  if (['End Term', 'End Year', 'Mock', 'Pre-Mock', 'Series'].includes(examType)) return 3;
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
// Returns 202 + jobId immediately. AI runs in background.
// Frontend polls GET /api/exams/job/:jobId every 3 seconds.
router.post('/generate', protect, generateLimiter, async (req, res) => {
  try {
    const {
      grade, subject, strands, substrands, examType, term, year,
      totalMarks, totalQuestions, school,
      sectionCount: requestedSectionCount,
      showStrand, includePractical,
    } = req.body;

    // 1. Basic field checks
    if (!grade)         return res.status(400).json({ error: 'Please select a Grade.',                  code: 'MISSING_FIELD' });
    if (!subject)       return res.status(400).json({ error: 'Please select a Subject.',               code: 'MISSING_FIELD' });
    if (!strands?.length) return res.status(400).json({ error: 'Please select at least one Strand.',  code: 'MISSING_FIELD' });
    if (!school?.trim()) return res.status(400).json({ error: 'Please enter your School Name.',        code: 'MISSING_FIELD' });

    const validationError = validateExamParams(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError, code: 'VALIDATION_ERROR' });
    }

    // 2. Check quota — do this BEFORE creating a job
    const user = await User.findById(req.user._id);
    if (!user) return res.status(401).json({ error: 'Session expired. Please log in again.', code: 'AUTH_ERROR' });

    if (!user.canGenerate()) {
      return res.status(403).json({
        error: 'You have used all your free exams. Upgrade to Premium to continue generating.',
        code: 'QUOTA_EXCEEDED',
        upgradeRequired: true,
      });
    }

    const sectionCount = requestedSectionCount || getDefaultSectionCount(examType);

    // 3. Save pending job to MongoDB
    const job = await ExamJob.create({
      status: 'pending',
      params: { ...req.body, sectionCount },
      userId: user._id,
    });

    // 4. Respond immediately — Render's timeout never fires
    res.status(202).json({ jobId: job._id });

    // 5. Run AI generation in background (after response is sent)
    processExamJob(job._id, { ...req.body, sectionCount }, user).catch(err => {
      console.error('Background job unhandled error:', err);
    });

  } catch (err) {
    console.error('Generate route error:', err);
    res.status(500).json({ error: 'Failed to start generation. Please try again.', code: 'SERVER_ERROR' });
  }
});

// ── GET /api/exams/job/:jobId ────────────────────────────
// Frontend polls this every 3s until status is 'done' or 'failed'.
// NOTE: must be defined BEFORE /:id to avoid route shadowing
router.get('/job/:jobId', protect, async (req, res) => {
  // CRITICAL: prevent Cloudflare/browser from caching poll responses.
  // Without this, status transitions (processing→done, processing→failed)
  // are invisible to the frontend — it keeps seeing the cached "processing" 304.
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
  });

  try {
    const job = await ExamJob.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found.' });

    if (job.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    if (job.status === 'done') {
      return res.json({
        status: 'done',
        exam: job.exam,
        examId: job.examDocId,
        message: job.message || 'Exam generated successfully!',
      });
    }

    if (job.status === 'failed') {
      return res.json({
        status: 'failed',
        code: job.errorCode || 'GENERATION_ERROR',
        error: job.error || 'Generation failed. Please try again.',
      });
    }

    return res.json({ status: job.status }); // pending or processing

  } catch (err) {
    console.error('Job poll error:', err);
    res.status(500).json({ error: 'Failed to check job status.' });
  }
});

// ── Background processor ──────────────────────────────────
// This is the existing AI generation logic, extracted from the route handler.
// Runs AFTER the 202 response is already sent — no HTTP timeout possible.
async function processExamJob(jobId, params, user) {
  const startTime = Date.now();
  const {
    grade, subject, strands, substrands, examType, term, year,
    totalMarks, totalQuestions, school, sectionCount, showStrand, includePractical,
  } = params;

  await ExamJob.findByIdAndUpdate(jobId, { status: 'processing' });

  try {
    // 1. Query question bank
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
      console.warn('Question bank query failed, using AI fallback:', bankErr.message);
    }

    // 2. Build prompt
    let prompt;
    if (isHybrid) {
      const { sectionA: sectionASeeds, sectionB: sectionBSeeds, sectionC: sectionCSeeds } =
        selectBalancedQuestions(questionPool, totalMarks, totalQuestions, sectionCount);

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

    // 3. Call AI
    // max_tokens is adaptive: large exams (80+ marks, many questions) need more tokens
    // to fit the full JSON with all questions + sub-parts + marking scheme.
    // 6000 is enough for a CAT; End Term/Mock at 80+ marks needs 8000.
    const maxTokens = totalMarks >= 70
      ? 8000
      : totalMarks >= 50
      ? 7000
      : 6000

    const TIMEOUT_MS = 120000;
    let message;
    let attempts = 0;
    const maxAttempts = 3;
    let lastErr = null;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject({ isTimeout: true }), TIMEOUT_MS)
        );
        message = await Promise.race([
          anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: maxTokens,
            messages: [{ role: 'user', content: prompt }],
          }),
          timeoutPromise,
        ]);
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
        const retryable = err.isTimeout || err.status === 529 || err.status === 503 || err.status === 429;
        if (retryable && attempts < maxAttempts) {
          const wait = attempts * 3000; // 3s, 6s between retries
          console.warn(`AI attempt ${attempts} failed, retrying in ${wait / 1000}s...`);
          await new Promise(r => setTimeout(r, wait));
          continue;
        }
        break;
      }
    }

    if (lastErr) {
      if (lastErr.isTimeout)                                         throw { code: 'TIMEOUT',       msg: 'The AI took too long to respond. Please try again.' };
      if (lastErr.status === 401 || lastErr.status === 403)         throw { code: 'AUTH_ERROR',     msg: 'AI service authentication failed. Please contact support.' };
      if (lastErr.status === 429)                                    throw { code: 'RATE_LIMIT',     msg: 'AI is overloaded. Please try again in a few minutes.' };
      if (lastErr.status === 529 || lastErr.status === 503)         throw { code: 'SERVICE_DOWN',   msg: 'AI service is temporarily unavailable. Please try again shortly.' };
      throw lastErr;
    }

    // 4. Parse response
    const rawText = message.content.map(b => b.text || '').join('');
    const cleanText = rawText.replace(/```json|```/g, '').trim();

    // Log stop_reason — if it's 'max_tokens' the response was truncated
    const stopReason = message.stop_reason;
    if (stopReason === 'max_tokens') {
      console.error(`[PARSE] AI hit max_tokens limit (${maxTokens}) for ${grade} ${subject} ${examType} ${totalMarks}mks. Response truncated — increase maxTokens.`);
      console.error(`[PARSE] Truncated at: ...${rawText.slice(-200)}`);
      throw { code: 'PARSE_ERROR', msg: 'Exam too large to generate in one pass. Please reduce marks or questions and try again.' };
    }

    let examData;
    try {
      examData = JSON.parse(cleanText);
    } catch (parseErr) {
      console.error(`[PARSE] JSON.parse failed for ${grade} ${subject} ${examType}.`);
      console.error(`[PARSE] stop_reason: ${stopReason} | tokens used: ${message.usage?.output_tokens}`);
      console.error(`[PARSE] First 400 chars: ${rawText.substring(0, 400)}`);
      console.error(`[PARSE] Last 200 chars: ${rawText.slice(-200)}`);
      throw { code: 'PARSE_ERROR', msg: 'The AI returned an unexpected response. Please try again.' };
    }

    // 5. Fix section marks
    examData.sectionA = recalculateSectionMarks(examData.sectionA);
    examData.sectionB = recalculateSectionMarks(examData.sectionB);
    examData.sectionC = recalculateSectionMarks(examData.sectionC);

    // 6. Clear sections beyond sectionCount
    const empty = { questions: [], marks: 0, instruction: '' };
    if (sectionCount < 3) examData.sectionC = empty;
    if (sectionCount < 2) examData.sectionB = empty;

    const duration = getDuration(examType, totalMarks);
    const generationTimeMs = Date.now() - startTime;

    // 7. Save exam to DB
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
      throw { code: 'SAVE_ERROR', msg: 'Exam generated but could not be saved. Please try again.' };
    }

    // 8. Increment usage — re-fetch user to avoid stale data
    const freshUser = await User.findById(user._id);
    if (freshUser) {
      if (!freshUser.isPremium()) freshUser.freeGenerationsUsed += 1;
      freshUser.totalExamsGenerated += 1;
      await freshUser.save({ validateBeforeSave: false });
    }

    const bankHits = questionBankHits > 0
      ? `${questionBankHits} questions sourced from question bank`
      : 'Generated entirely by AI';

    // 9. Mark job done
    await ExamJob.findByIdAndUpdate(jobId, {
      status: 'done',
      exam: exam.toObject(),
      examDocId: exam._id,
      message: `Exam generated in ${(generationTimeMs / 1000).toFixed(1)}s. ${bankHits}.`,
    });

  } catch (err) {
    console.error('processExamJob failed:', err);
    await ExamJob.findByIdAndUpdate(jobId, {
      status: 'failed',
      errorCode: err.code || 'GENERATION_ERROR',
      error: err.msg || 'Generation failed. Please try again.',
    });
  }
}

// ── GET /api/exams ───────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip  = (page - 1) * limit;

    const filter = { user: req.user._id };
    if (req.query.grade)    filter.grade    = req.query.grade;
    if (req.query.subject)  filter.subject  = req.query.subject;
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
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

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
