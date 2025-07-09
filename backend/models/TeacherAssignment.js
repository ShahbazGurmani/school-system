const mongoose = require('mongoose');

const teacherAssignmentSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
});

module.exports = mongoose.model('TeacherAssignment', teacherAssignmentSchema); 