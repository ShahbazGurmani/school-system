const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { getTeachersAndCoursesForStudentUserId } = require('../controllers/gradeController');

router.get('/', gradeController.getAllGrades);
router.get('/teacher/:teacherId', gradeController.getGradesByTeacher);
router.get('/teacher/:teacherId/a-grade-students', gradeController.getTeacherSubjectAGradeStudents);
router.get('/:id', gradeController.getGradeById);
router.post('/', gradeController.createGrade);
router.put('/:id', gradeController.updateGrade);
router.delete('/:id', gradeController.deleteGrade);
router.get('/student/:studentId', gradeController.getGradesByStudent);
router.get('/student/user/:userId', gradeController.getGradesByStudentUserId);
router.get('/student/:userId/teachers', getTeachersAndCoursesForStudentUserId);
router.get('/class/:classId', gradeController.getGradesByClass);

module.exports = router; 