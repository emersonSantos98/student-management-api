const express = require('express');
const studentController = require('../controllers/studentController');
const {authMiddleware, isAdmin} = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.get('/:id/enrollments', isAdmin, studentController.getStudentWithEnrollments);
router.post('/', isAdmin, studentController.createStudent);
router.put('/:id', isAdmin, studentController.updateStudent);
router.delete('/:id', isAdmin, studentController.deleteStudent);

module.exports = router;
