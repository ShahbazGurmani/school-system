const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const adminOnly = require('../middleware/adminOnly');

router.get('/', classController.getAllClasses);
router.get('/:classId/courses-teachers', classController.getClassCoursesAndTeachers);
router.get('/:id', classController.getClassById);
router.post('/', adminOnly, classController.createClass);
router.put('/:id', adminOnly, classController.updateClass);
router.delete('/:id', adminOnly, classController.deleteClass);

module.exports = router; 