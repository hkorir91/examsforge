const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  num: Number,
  text: String,
  subParts: [
    {
      label: String,       // e.g. 'a', 'b', 'c'
      text: String,
      marks: Number,
      answer: String,
    }
  ],
  marks: Number,
  answer: String,          // full model answer for single-part questions
  questionType: {
    type: String,
    enum: ['short_answer', 'structured', 'long_answer', 'calculation', 'practical'],
    default: 'structured',
  },
  sourceQuestionId: {      // reference to QuestionBank item used as seed
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionBank',
    default: null,
  },
  diagram: {               // SVG diagram spec — rendered in ExamPreview and PDF
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
});

const sectionSchema = new mongoose.Schema({
  marks: Number,
  instruction: String,
  questions: [questionSchema],
});

const examSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // ── Metadata ─────────────────────────────────────
    title: { type: String, required: true },
    school: { type: String, required: true },
    grade: {
      type: String,
      required: true,
      enum: ['Grade 10', 'Grade 11', 'Grade 12'],
    },
    subject: { type: String, required: true },

    // Multi-strand support
    strands: { type: [String], default: [] },
    substrands: { type: [String], default: [] },

    // Legacy single-strand field (kept for backward compatibility)
    strand: { type: String, default: '' },
    substrand: { type: String, default: '' },

    examType: {
      type: String,
      enum: ['CAT', 'Midterm', 'End Term', 'Pre-Mock', 'Mock'],
      required: true,
    },
    term: { type: String, required: true },
    year: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    duration: { type: String, required: true },

    // ── Exam Content ──────────────────────────────────
    instructions: [String],
    sectionA: sectionSchema,   // Short Answer
    sectionB: sectionSchema,   // Structured / Long Answer
    sectionC: sectionSchema,   // Extended / Calculation / Practical

    // ── Generation Metadata ──────────────────────────
    isHybrid: { type: Boolean, default: true },
    questionBankHits: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false },
    downloadCount: { type: Number, default: 0 },
    aiModel: { type: String, default: 'claude-sonnet-4-20250514' },
    generationTimeMs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────
examSchema.index({ user: 1, createdAt: -1 });
examSchema.index({ grade: 1, subject: 1 });

module.exports = mongoose.model('Exam', examSchema);
