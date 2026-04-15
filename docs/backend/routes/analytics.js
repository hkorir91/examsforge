const express = require('express');
const Exam = require('../models/Exam');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/analytics/dashboard (Admin only) ────────
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalUsers,
      premiumUsers,
      totalExams,
      examsToday,
      examsByGrade,
      examsBySubject,
      examsByType,
      recentExams,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ tier: { $ne: 'free' } }),
      Exam.countDocuments(),
      Exam.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Exam.aggregate([
        { $group: { _id: '$grade', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Exam.aggregate([
        { $group: { _id: '$subject', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Exam.aggregate([
        { $group: { _id: '$examType', count: { $sum: 1 } } },
      ]),
      Exam.find()
        .populate('user', 'name email school')
        .sort({ createdAt: -1 })
        .limit(10)
        .select('title grade subject examType createdAt user'),
    ]);

    // Exams per day for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const examsByDay = await Exam.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      overview: {
        totalUsers,
        premiumUsers,
        freeUsers: totalUsers - premiumUsers,
        conversionRate: totalUsers > 0
          ? ((premiumUsers / totalUsers) * 100).toFixed(1) + '%'
          : '0%',
        totalExams,
        examsToday,
      },
      charts: {
        examsByGrade,
        examsBySubject,
        examsByType,
        examsByDay,
      },
      recentExams,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Could not load analytics.' });
  }
});

// ── GET /api/analytics/my-stats ──────────────────────
router.get('/my-stats', protect, async (req, res) => {
  try {
    const [total, bySubject, byType, recent] = await Promise.all([
      Exam.countDocuments({ user: req.user._id }),
      Exam.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: '$subject', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Exam.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: '$examType', count: { $sum: 1 } } },
      ]),
      Exam.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title grade subject examType createdAt'),
    ]);

    res.json({ total, bySubject, byType, recent });
  } catch (err) {
    res.status(500).json({ error: 'Could not load your stats.' });
  }
});

module.exports = router;
