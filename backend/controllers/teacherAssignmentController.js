const TeacherAssignment = require('../models/TeacherAssignment');

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await TeacherAssignment.find().populate('teacher course class');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssignmentsByTeacher = async (req, res) => {
  try {
    const assignments = await TeacherAssignment.find({ teacher: req.params.teacherId }).populate('teacher course class');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const assignment = new TeacherAssignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await TeacherAssignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all A grade students for a teacher's courses/classes
exports.getTeacherSubjectAGradeStudents = async (req, res) => {
  try {
    const Grade = require('../models/Grade');
    const StudentDetail = require('../models/StudentDetail');
    const User = require('../models/User');
    const teacherId = req.params.teacherId;
    // Find all grades for this teacher with gradeLetter 'A'
    const grades = await Grade.find({ teacher: teacherId, gradeLetter: 'A' })
      .populate({
        path: 'student',
        model: 'StudentDetail',
        populate: {
          path: 'user',
          model: 'User',
          match: { role: 'student' }
        }
      })
      .populate('subject')
      .populate('class');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 