const Grade = require('../models/Grade');

function calculateGradeLetter(assignmentMarks, quizMarks, paperMarks) {
  // Use the latest mark from each array, or 0 if missing
  const assignment = Array.isArray(assignmentMarks) && assignmentMarks.length ? assignmentMarks[assignmentMarks.length - 1] : 0;
  const quiz = Array.isArray(quizMarks) && quizMarks.length ? quizMarks[quizMarks.length - 1] : 0;
  const paper = Array.isArray(paperMarks) && paperMarks.length ? paperMarks[paperMarks.length - 1] : 0;
  const performance = assignment + quiz + paper;
  if (performance >= 90) return 'A';
  if (performance >= 80) return 'B';
  if (performance >= 70) return 'C';
  if (performance >= 50) return 'D';
  return 'F';
}

exports.getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find().populate('student').populate('subject');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id).populate('student').populate('subject');
    if (!grade) return res.status(404).json({ error: 'Grade not found' });
    res.json(grade);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createGrade = async (req, res) => {
  try {
    const { student, subject, teacher, class: classId, assignmentMarks = [], quizMarks = [], paperMarks = [] } = req.body;
    if (!student || !subject || !teacher || !classId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    let grade = await Grade.findOne({ student, subject, teacher, class: classId });
    if (grade) {
      grade.assignmentMarks.push(...assignmentMarks);
      grade.quizMarks.push(...quizMarks);
      grade.paperMarks.push(...paperMarks);
      grade.gradeLetter = calculateGradeLetter(grade.assignmentMarks, grade.quizMarks, grade.paperMarks);
      await grade.save();
      return res.status(200).json(grade);
    } else {
      const gradeLetter = calculateGradeLetter(assignmentMarks, quizMarks, paperMarks);
      grade = new Grade({ student, subject, teacher, class: classId, assignmentMarks, quizMarks, paperMarks, gradeLetter });
      await grade.save();
      return res.status(201).json(grade);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateGrade = async (req, res) => {
  try {
    const { assignmentMarks, quizMarks, paperMarks } = req.body;
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ error: 'Grade not found' });
    if (assignmentMarks) grade.assignmentMarks = assignmentMarks;
    if (quizMarks) grade.quizMarks = quizMarks;
    if (paperMarks) grade.paperMarks = paperMarks;
    grade.gradeLetter = calculateGradeLetter(grade.assignmentMarks, grade.quizMarks, grade.paperMarks);
    await grade.save();
    res.json(grade);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) return res.status(404).json({ error: 'Grade not found' });
    res.json({ message: 'Grade deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGradesByStudent = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId }).populate('subject');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGradesByTeacher = async (req, res) => {
  try {
    try {
      const grades = await Grade.find({ teacher: req.params.teacherId })
        .populate('student')
        .populate('subject')
        .populate('class');
      res.json(grades);
    } catch (popErr) {
      console.error('Population error in getGradesByTeacher:', popErr);
      // Fallback: return unpopulated grades with a warning
      const grades = await Grade.find({ teacher: req.params.teacherId });
      res.json({ warning: 'Some references could not be populated. Data may be incomplete.', grades });
    }
  } catch (err) {
    console.error('Error in getGradesByTeacher:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getGradesByStudentUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find all grades where the student ref's user matches userId
    // First, find the StudentDetail for this user
    const StudentDetail = require('../models/StudentDetail');
    const studentDetail = await StudentDetail.findOne({ user: userId }).populate('class');
    if (!studentDetail) return res.status(404).json({ error: 'Student not found' });
    const grades = await Grade.find({ student: studentDetail._id })
      .populate('subject')
      .populate('teacher')
      .populate('class');
    res.json({ class: studentDetail.class, grades });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTeachersAndCoursesForStudentUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const StudentDetail = require('../models/StudentDetail');
    const TeacherAssignment = require('../models/TeacherAssignment');
    const studentDetail = await StudentDetail.findOne({ user: userId }).populate('class');
    if (!studentDetail) return res.status(404).json({ error: 'Student not found' });
    const classId = studentDetail.class?._id;
    if (!classId) return res.status(404).json({ error: 'Class not found' });
    // Find all teacher assignments for this class
    const assignments = await TeacherAssignment.find({ class: classId })
      .populate('teacher', 'name')
      .populate('course', 'name');
    // Group by teacher
    const teacherMap = new Map();
    assignments.forEach(a => {
      if (!a.teacher || !a.course) return;
      const tId = a.teacher._id.toString();
      if (!teacherMap.has(tId)) {
        teacherMap.set(tId, { teacher: { name: a.teacher.name }, courses: [] });
      }
      teacherMap.get(tId).courses.push({ name: a.course.name });
    });
    res.json({ class: studentDetail.class.name, teachers: Array.from(teacherMap.values()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGradesByClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const grades = await Grade.find({ class: classId })
      .populate('student')
      .populate('subject')
      .populate('teacher');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 