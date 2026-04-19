const express = require('express');
const User = require('../models/User');
const QuestionBank = require('../models/QuestionBank');
const { protect, adminOnly } = require('../middleware/auth'); // ← FIXED

const router = express.Router();
router.use(protect);   // must be logged in
router.use(adminOnly); // must be admin

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

router.patch('/questions/:id/toggle', async (req, res) => {
  try {
    const question = await QuestionBank.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found.' });
    question.isActive = !question.isActive;
    await question.save();
    res.json({ message: `Question ${question.isActive ? 'activated' : 'deactivated'}.`, question });
  } catch (err) { res.status(500).json({ error: 'Could not toggle question.' }); }
});

router.delete('/questions/:id', async (req, res) => {
  try {
    await QuestionBank.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted.' });
  } catch (err) { res.status(500).json({ error: 'Could not delete question.' }); }
});

// ════════════════════════════════════════════════════
// ANNOUNCEMENTS (basic — no Resend dependency)
// ════════════════════════════════════════════════════
router.post('/announce', async (req, res) => {
  try {
    const { subject, message, targetTier } = req.body;
    if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required.' });
    const query = targetTier && targetTier !== 'all' ? { tier: targetTier } : {};
    const count = await User.countDocuments(query);
    // Email sending requires Resend API key — log for now
    console.log(`Announcement queued for ${count} users: ${subject}`);
    res.json({ message: `Announcement queued for ${count} users.` });
  } catch (err) {
    res.status(500).json({ error: 'Could not send announcement.' });
  }
});

module.exports = router;
