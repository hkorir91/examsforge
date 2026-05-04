const mongoose = require('mongoose');

/**
 * ExamJob — tracks async exam generation jobs.
 *
 * Flow:
 *   POST /exams/generate  → creates job (status: pending)  → returns jobId
 *   processExamJob()      → sets status: processing        → runs AI
 *   on success            → sets status: done + exam data
 *   on failure            → sets status: failed + error
 *   GET /exams/job/:id    → frontend polls this
 *
 * Jobs auto-delete after 1 hour (TTL index on createdAt).
 */
const ExamJobSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'processing', 'done', 'failed'],
      default: 'pending',
    },
    params: {
      type: Object, // the full generation params from req.body
    },
    exam: {
      type: Object, // populated with exam.toObject() when done
      default: null,
    },
    examDocId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      default: null,
    },
    message: {
      type: String, // success message shown to user
      default: null,
    },
    errorCode: {
      type: String,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // TTL index — MongoDB auto-deletes documents 1 hour after createdAt
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExamJob', ExamJobSchema);
