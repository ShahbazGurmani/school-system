const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAllStudents);
router.post('/details', studentController.createStudentWithDetails);
router.get('/unified', studentController.getAllStudentUnifiedDetails);
router.get('/by-class/:classId', studentController.getStudentsByClassId);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.put('/:id/assign-class', studentController.assignClassToStudent);
router.put('/:studentId/courses-teachers', studentController.updateStudentCoursesAndTeachers);

module.exports = router; 