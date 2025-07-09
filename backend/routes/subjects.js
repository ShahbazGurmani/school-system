const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const adminOnly = require('../middleware/adminOnly');

router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);
router.post('/', adminOnly, subjectController.createSubject);
router.put('/:id', adminOnly, subjectController.updateSubject);
router.delete('/:id', adminOnly, subjectController.deleteSubject);
router.get('/class/:classId', subjectController.getSubjectsByClassId);

module.exports = router; 