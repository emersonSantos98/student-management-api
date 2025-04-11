const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/auth');

const router = express.Router();


router.post('/login', userController.login);


router.use(authMiddleware);

// Rotas para o próprio usuário
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/password', userController.changePassword);

// Rotas administrativas (apenas admin)
router.get('/', isAdmin, userController.getAllUsers);
router.post('/', isAdmin, userController.register);
router.get('/:id', isAdmin, userController.getUserById);
router.put('/:id', isAdmin, userController.updateUser);
router.delete('/:id', isAdmin, userController.deleteUser);

module.exports = router;
