const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Login de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: "@123456"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: user
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Login bem-sucedido
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 4971def4-12bf-4c40-b450-6dcdd93ea965
 *                         name:
 *                           type: string
 *                           example: Administrador
 *                         email:
 *                           type: string
 *                           example: admin@example.com
 *                         role:
 *                           type: string
 *                           example: admin
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
router.post('/login', userController.login);


router.use(authMiddleware);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Obtém o perfil do usuário logado
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: user
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Perfil do usuário
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 4971def4-12bf-4c40-b450-6dcdd93ea965
 *                     name:
 *                       type: string
 *                       example: Administrador
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     role:
 *                       type: string
 *                       example: admin
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-15T06:00:45.000Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-15T06:00:45.000Z
 */
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
