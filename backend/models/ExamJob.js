const mongoose = require('mongoose')

const ExamJobSchema = new mongoose.Schema({
  status:    { type: String, enum: ['pending', 'processing', 'done', 'failed'], default: 'pending' },
  params:    { type: Object },           // the form data sent by the user
  exam:      { type: Object },           // filled in when AI finishes
  examDocId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  errorCode: { type: String },
  error:     { type: String },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // auto-deletes after 1 hour
}, { timestamps: true })

module.exports = mongoose.model('ExamJob', ExamJobSchema)
