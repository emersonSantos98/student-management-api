const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const {isAdmin, authMiddleware} = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/enroll', isAdmin, enrollmentController.enrollStudent);
router.put('/cancel', isAdmin, enrollmentController.cancelEnrollment);
router.delete('/:id', isAdmin, enrollmentController.deleteEnrollment);

module.exports = router;
