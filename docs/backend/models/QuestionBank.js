const mongoose = require('mongoose');

/**
 * QuestionBank — structured question bank for ExamsForge hybrid generation.
 *
 * Questions are retrieved from this bank based on grade/subject/strand/difficulty,
 * then passed through the AI transformation pipeline which rephrases, changes
 * values/names/contexts, and shuffles structure — ensuring every exam is unique
 * while remaining curriculum-accurate.
 */
const questionBankSchema = new mongoose.Schema(
  {
    // ── Curriculum Classification ─────────────────────
    grade: {
      type: String,
      required: true,
      enum: ['Grade 10', 'Grade 11', 'Grade 12'],
      index: true,
    },
    subject: {
      type: String,
      required: true,
      index: true,
    },
    strand: {
      type: String,
      required: true,
      index: true,
    },
    subStrand: {
      type: String,
      default: '',
      index: true,
    },

    // ── Question Content ──────────────────────────────
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    questionType: {
      type: String,
      enum: ['short_answer', 'structured', 'long_answer', 'calculation', 'practical'],
      required: true,
      default: 'structured',
    },
    answerGuide: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Marking ───────────────────────────────────────
    marks: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },

    // ── Difficulty ────────────────────────────────────
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
      default: 'medium',
      index: true,
    },

    // ── Metadata ──────────────────────────────────────
    tags: {
      type: [String],
      default: [],
    },
    source: {
      type: String,
      trim: true,
      default: 'ExamsForge Bank',
      comment: 'e.g. KICD specimen paper, teacher contribution, AI-verified',
    },
    learningObjective: {
      type: String,
      trim: true,
      default: '',
    },

    // ── Status ────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    verifiedByCurriculum: {
      type: Boolean,
      default: false,
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ── Compound indexes for fast retrieval ──────────────
questionBankSchema.index({ grade: 1, subject: 1, strand: 1, difficulty: 1, isActive: 1 });
questionBankSchema.index({ grade: 1, subject: 1, strand: 1, subStrand: 1, isActive: 1 });
questionBankSchema.index({ grade: 1, subject: 1, marks: 1, isActive: 1 });

// ── Static: retrieve a balanced pool for hybrid generation ──
questionBankSchema.statics.getPoolForGeneration = async function ({
  grade,
  subject,
  strands = [],
  substrands = [],
  totalMarks,
  totalQuestions,
}) {
  const query = {
    grade,
    subject,
    isActive: true,
  };

  if (strands.length > 0) {
    query.strand = { $in: strands };
  }

  if (substrands.length > 0) {
    query.subStrand = { $in: substrands };
  }

  // Request a generous pool — 3× what we need — for variety
  const poolSize = Math.max(totalQuestions * 3, 30);

  const questions = await this.find(query)
    .limit(poolSize)
    .lean();

  return questions;
};

module.exports = mongoose.model('QuestionBank', questionBankSchema);
