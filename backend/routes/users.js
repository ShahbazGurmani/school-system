const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const studentController = require('../controllers/studentController');

router.post('/login', userController.login);
router.get('/role/:role', userController.getUsersByRole);
router.post('/', userController.createUser);
router.get('/students', studentController.getAllStudentsWithDetails);
router.post('/students', studentController.createStudentWithDetails);
router.put('/students/:id', studentController.updateStudentWithDetails);
router.delete('/students/:id', studentController.deleteStudentWithDetails);

module.exports = router; 