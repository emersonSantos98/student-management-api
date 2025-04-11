const express = require('express');
const studentController = require('../controllers/studentController');
const {authMiddleware, isAdmin} = require('../middlewares/auth');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', isAdmin, studentController.getAllStudents);
router.get('/:id', isAdmin, studentController.getStudentById);
router.get('/:id/enrollments', isAdmin, studentController.getStudentWithEnrollments);
router.post('/', isAdmin, studentController.createStudent);
router.put('/:id', isAdmin, studentController.updateStudent);
router.delete('/:id', isAdmin, studentController.deleteStudent);

module.exports = router;
