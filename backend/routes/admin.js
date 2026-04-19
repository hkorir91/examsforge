const express = require('express');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const User = require('../models/User');
const QuestionBank = require('../models/QuestionBank');
const Prompt = require('../models/Prompt');
const { adminOnly } = require('../middleware/adminAuth');

const router = express.Router();
router.use(adminOnly);

// ════════════════════════════════════════════════════
// STATS
// ════════════════════════════════════════════════════
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const [
      totalUsers, premiumUsers, freeUsers,
      newToday, newThisWeek, newThisMonth,
      totalExams, totalQuestions, activeQuestions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ tier: { $ne: 'free' }, subscriptionExpiresAt: { $gt: now } }),
      User.countDocuments({ tier: 'free' }),
      User.countDocuments({ createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } }),
      (async () => { try { const Exam = require('../models/Exam'); return await Exam.countDocuments(); } catch { return 'N/A'; } })(),
      QuestionBank.countDocuments(),
      QuestionBank.countDocuments({ isActive: true }),
    ]);

    const last7Days = await User.aggregate([
      { $match: { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ totalUsers, premiumUsers, freeUsers, newToday, newThisWeek, newThisMonth, totalExams, totalQuestions, activeQuestions, last7Days });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Could not fetch stats.' });
  }
});

// ════════════════════════════════════════════════════
// USERS
// ════════════════════════════════════════════════════
router.get('/users', async (req, res) => {
  try {
    const { search, tier, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { school: { $regex: search, $options: 'i' } },
    ];
    if (tier) query.tier = tier;
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit))
      .select('-password -passwordResetToken -passwordResetExpires');
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: 'Could not fetch users.' }); }
});

router.patch('/users/:id/premium', async (req, res) => {
  try {
    const { tier, days } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (tier === 'free') { user.tier = 'free'; user.subscriptionExpiresAt = null; }
    else {
      user.tier = tier || 'monthly';
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + (days || 30));
      user.subscriptionExpiresAt = expiry;
    }
    await user.save({ validateBeforeSave: false });
    res.json({ message: 'Subscription updated.', user: user.toPublicJSON() });
  } catch (err) { res.status(500).json({ error: 'Could not update subscription.' }); }
});

router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['teacher', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role.' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'Role updated.', user: user.toPublicJSON() });
  } catch (err) { res.status(500).json({ error: 'Could not update role.' }); }
});

router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted.' });
  } catch (err) { res.status(500).json({ error: 'Could not delete user.' }); }
});

// ════════════════════════════════════════════════════
// EXAMS
// ════════════════════════════════════════════════════
router.get('/exams', async (req, res) => {
  try {
    const Exam = require('../models/Exam');
    const { search, page = 1, limit = 20 } = req.query;
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    const total = await Exam.countDocuments(query);
    const exams = await Exam.find(query).sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit))
      .populate('user', 'name email');
    res.json({ exams, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: 'Could not fetch exams.' }); }
});

router.delete('/exams/:id', async (req, res) => {
  try {
    const Exam = require('../models/Exam');
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted.' });
  } catch (err) { res.status(500).json({ error: 'Could not delete exam.' }); }
});

// ════════════════════════════════════════════════════
// QUESTION BANK
// ════════════════════════════════════════════════════

// GET  /api/admin/questions
router.get('/questions', async (req, res) => {
  try {
    const { grade, subject, strand, difficulty, search, active, page = 1, limit = 20 } = req.query;
    const query = {};
    if (grade) query.grade = grade;
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (strand) query.strand = { $regex: strand, $options: 'i' };
    if (difficulty) query.difficulty = difficulty;
    if (active === 'true') query.isActive = true;
    if (active === 'false') query.isActive = false;
    if (search) query.questionText = { $regex: search, $options: 'i' };

    const total = await QuestionBank.countDocuments(query);
    const questions = await QuestionBank.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ questions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: 'Could not fetch questions.' }); }
});

// POST /api/admin/questions
router.post('/questions', async (req, res) => {
  try {
    const {
      grade, subject, strand, subStrand, questionText, questionType,
      answerGuide, marks, difficulty, tags, source, learningObjective,
    } = req.body;

    if (!grade || !subject || !strand || !questionText || !answerGuide || !marks || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const question = await QuestionBank.create({
      grade, subject, strand, subStrand: subStrand || '',
      questionText, questionType: questionType || 'structured',
      answerGuide, marks: Number(marks), difficulty,
      tags: tags || [], source: source || 'Admin Upload',
      learningObjective: learningObjective || '',
      isActive: true, verifiedByCurriculum: true,
    });

    res.status(201).json({ message: 'Question added to bank.', question });
  } catch (err) {
    console.error('Add question error:', err);
    res.status(500).json({ error: 'Could not add question.' });
  }
});

// PATCH /api/admin/questions/:id
router.patch('/questions/:id', async (req, res) => {
  try {
    const allowed = [
      'grade', 'subject', 'strand', 'subStrand', 'questionText', 'questionType',
      'answerGuide', 'marks', 'difficulty', 'tags', 'source',
      'learningObjective', 'isActive', 'verifiedByCurriculum',
    ];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const question = await QuestionBank.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!question) return res.status(404).json({ error: 'Question not found.' });
    res.json({ message: 'Question updated.', question });
  } catch (err) { res.status(500).json({ error: 'Could not update question.' }); }
});

// PATCH /api/admin/questions/:id/toggle
router.patch('/questions/:id/toggle', async (req, res) => {
  try {
    const question = await QuestionBank.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found.' });
    question.isActive = !question.isActive;
    await question.save();
    res.json({ message: `Question ${question.isActive ? 'activated' : 'deactivated'}.`, question });
  } catch (err) { res.status(500).json({ error: 'Could not toggle question.' }); }
});

// DELETE /api/admin/questions/:id
router.delete('/questions/:id', async (req, res) => {
  try {
    await QuestionBank.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted.' });
  } catch (err) { res.status(500).json({ error: 'Could not delete question.' }); }
});

// ════════════════════════════════════════════════════
// AI PROMPTS
// ════════════════════════════════════════════════════

// GET /api/admin/prompts
router.get('/prompts', async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ category: 1, name: 1 });
    res.json({ prompts });
  } catch (err) { res.status(500).json({ error: 'Could not fetch prompts.' }); }
});

// POST /api/admin/prompts
router.post('/prompts', async (req, res) => {
  try {
    const { name, description, content, category } = req.body;
    if (!name || !content) return res.status(400).json({ error: 'Name and content are required.' });
    const prompt = await Prompt.create({
      name, description: description || '', content,
      category: category || 'other', updatedBy: req.user._id,
    });
    res.status(201).json({ message: 'Prompt created.', prompt });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'A prompt with this name already exists.' });
    res.status(500).json({ error: 'Could not create prompt.' });
  }
});

// PATCH /api/admin/prompts/:id
router.patch('/prompts/:id', async (req, res) => {
  try {
    const { name, description, content, category, isActive } = req.body;
    const updates = { updatedBy: req.user._id };
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (content !== undefined) updates.content = content;
    if (category !== undefined) updates.category = category;
    if (isActive !== undefined) updates.isActive = isActive;

    const prompt = await Prompt.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!prompt) return res.status(404).json({ error: 'Prompt not found.' });
    res.json({ message: 'Prompt updated.', prompt });
  } catch (err) { res.status(500).json({ error: 'Could not update prompt.' }); }
});

// DELETE /api/admin/prompts/:id
router.delete('/prompts/:id', async (req, res) => {
  try {
    await Prompt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prompt deleted.' });
  } catch (err) { res.status(500).json({ error: 'Could not delete prompt.' }); }
});

// ════════════════════════════════════════════════════
// ANNOUNCEMENTS
// ════════════════════════════════════════════════════
router.post('/announce', async (req, res) => {
  try {
    const { subject, message, targetTier } = req.body;
    if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required.' });

    const query = targetTier && targetTier !== 'all' ? { tier: targetTier } : {};
    const users = await User.find(query).select('email name');
    if (users.length === 0) return res.status(400).json({ error: 'No users found for this audience.' });

    const batchSize = 50;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await Promise.all(batch.map(u => resend.emails.send({
        from: `PassIQ <noreply@${process.env.EMAIL_DOMAIN || 'passiq.co.ke'}>`,
        to: u.email,
        subject,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#003399;padding:24px;border-radius:12px 12px 0 0;">
              <h1 style="color:white;margin:0;font-size:24px;">PassIQ</h1>
            </div>
            <div style="padding:24px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
              <p>Hi ${u.name},</p>
              <div>${message}</div>
              <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;"/>
              <p style="color:#9ca3af;font-size:12px;">You received this because you have a PassIQ account.</p>
            </div>
          </div>`,
      })));
    }
    res.json({ message: `Announcement sent to ${users.length} users.` });
  } catch (err) {
    console.error('Announce error:', err);
    res.status(500).json({ error: 'Could not send announcement.' });
  }
});

module.exports = router;
