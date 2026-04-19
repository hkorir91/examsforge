const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // e.g. 'exam_generation_system', 'section_a_instruction', 'section_b_instruction'
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['system', 'section', 'formatting', 'other'],
      default: 'other',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prompt', promptSchema);
