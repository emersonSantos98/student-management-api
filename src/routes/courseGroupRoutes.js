const express = require('express');
const router = express.Router();
const courseGroupController = require('../controllers/courseGroupController');
const {isAdmin, authMiddleware} = require('../middlewares/auth');


router.use(authMiddleware);


router.get('/', courseGroupController.getAllCourseGroups);
router.get('/:id', courseGroupController.getCourseGroupById);
router.post('/',isAdmin, courseGroupController.createCourseGroup);
router.put('/:id', isAdmin, courseGroupController.updateCourseGroup);
router.delete('/:id', isAdmin, courseGroupController.deleteCourseGroup);

module.exports = router;
