const express = require('express');
const router = express.Router();
const controller = require('../controllers/teacherAssignmentController');
const adminOnly = require('../middleware/adminOnly');
const TeacherAssignment = require('../models/TeacherAssignment');
const Class = require('../models/Class');
const Student = require('../models/StudentDetail');
const Subject = require('../models/Subject');

router.get('/', controller.getAllAssignments);
router.get('/teacher/:teacherId', controller.getAssignmentsByTeacher);
router.post('/', adminOnly, controller.createAssignment);
router.delete('/:id', adminOnly, controller.deleteAssignment);
router.get('/teacher/:teacherId/a-grade-students', controller.getTeacherSubjectAGradeStudents);

// GET /classes?teacherId=xxx
router.get('/classes', async (req, res) => {
  const teacherId = req.query.teacherId;
  if (!teacherId) return res.status(400).json({ error: 'teacherId is required' });

  try {
    // Find all classes taught by this teacher
    const assignments = await TeacherAssignment.find({ teacher: teacherId }).populate('class');
    const classIds = assignments.map(a => a.class._id);

    // For each class, get students and subjects
    const classes = await Class.find({ _id: { $in: classIds } });
    const result = await Promise.all(classes.map(async (cls) => {
      const students = await Student.find({ class: cls._id });
      const subjects = await Subject.find({ class: cls._id });
      return {
        _id: cls._id,
        name: cls.name,
        students,
        subjects
      };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 