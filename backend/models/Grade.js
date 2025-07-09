const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  assignmentMarks: { type: [Number], default: [] },
  quizMarks: { type: [Number], default: [] },
  paperMarks: { type: [Number], default: [] },
  gradeLetter: { type: String, enum: ['A', 'B', 'C', 'D', 'F'], required: false },
});

module.exports = mongoose.model('Grade', gradeSchema); 