const express = require('express');
const studentController = require('../controllers/studentController');
const {authMiddleware, isAdmin} = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);
/**
 * @swagger
 * /students:
 *   get:
 *     tags: [Students]
 *     summary: Lista todos os estudantes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de registros por página
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nome
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email
 *       - in: query
 *         name: ra
 *         schema:
 *           type: string
 *         description: Filtrar por RA
 *     responses:
 *       200:
 *         description: Lista de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: student
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Lista de estudantes
 *                 data:
 *                   type: object
 *                   properties:
 *                     students:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 06515146-9dc1-4b72-8d31-e9847afcb75c
 *                           name:
 *                             type: string
 *                             example: Emerson Santos matos
 *                           email:
 *                             type: string
 *                             example: emerson@gmail.com
 *                           ra:
 *                             type: string
 *                             example: RA123456
 *                           cpf:
 *                             type: string
 *                             example: 48452669895
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-04-15T06:34:51.000Z
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-04-15T06:34:51.000Z
 *                           enrollments:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   example: b912d769-66c3-4da7-92ef-f035ed355ada
 *                                 status:
 *                                   type: string
 *                                   example: active
 *                                 created_at:
 *                                   type: string
 *                                   format: date-time
 *                                   example: 2025-04-15T06:36:19.000Z
 *                                 updated_at:
 *                                   type: string
 *                                   format: date-time
 *                                   example: 2025-04-15T06:36:19.000Z
 *                                 courseGroup:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                       example: 119ab50c-f3a8-44fd-aa37-2a055be0feee
 *                                     name:
 *                                       type: string
 *                                       example: Turma de Back-End com Node.js 2025
 *                           activeCourseCount:
 *                             type: integer
 *                             example: 1
 *                     total:
 *                       type: integer
 *                       example: 4
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 */
router.get('/', studentController.getAllStudents);
/**
 * @swagger
 * /students/{id}:
 *   get:
 *     tags: [Students]
 *     summary: Busca um estudante pelo ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do estudante
 *         example: ba0975ed-75f7-4b7d-806b-a2e6f0c1d1bb
 *     responses:
 *       200:
 *         description: Estudante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: student
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Estudante encontrado
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: ba0975ed-75f7-4b7d-806b-a2e6f0c1d1bb
 *                     name:
 *                       type: string
 *                       example: Beto da Silva
 *                     email:
 *                       type: string
 *                       example: beto.silva4@example.com
 *                     ra:
 *                       type: string
 *                       example: RA18458
 *                     cpf:
 *                       type: string
 *                       example: 12345678301
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-15T20:08:53.000Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-15T20:08:53.000Z
 *       404:
 *         description: Estudante não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Estudante não encontrado
 */
router.get('/:id', studentController.getStudentById);
router.get('/:id/enrollments', isAdmin, studentController.getStudentWithEnrollments);
/**
 * @swagger
 * /students:
 *   post:
 *     tags: [Students]
 *     summary: Cria um novo estudante
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Beto da Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: beto.silva@example.com
 *               ra:
 *                 type: string
 *                 example: RA123458
 *               cpf:
 *                 type: string
 *                 example: 12345678900
 *               courseGroupIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: 9b68ff62-ea6e-442a-bc5c-4f070e8a64b1
 *             required:
 *               - name
 *               - email
 *               - ra
 *               - cpf
 *     responses:
 *       201:
 *         description: Estudante criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: student
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Estudante criado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     student:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: ba0975ed-75f7-4b7d-806b-a2e6f0c1d1bb
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-04-15T20:08:53.976Z
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-04-15T20:08:53.976Z
 *                         name:
 *                           type: string
 *                           example: Beto da Silva
 *                         email:
 *                           type: string
 *                           example: beto.silva4@example.com
 *                         ra:
 *                           type: string
 *                           example: RA18458
 *                         cpf:
 *                           type: string
 *                           example: 12345678301
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Erro de validação
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 */
router.post('/', isAdmin, studentController.createStudent);
/**
 * @swagger
 * /students/{id}:
 *   put:
 *     tags: [Students]
 *     summary: Atualiza um estudante existente
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do estudante
 *         example: 9a196ca1-043d-4730-ab2b-39b74647c2d6
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao.silva@gmail.com
 *     responses:
 *       200:
 *         description: Estudante atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: student
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Estudante atualizado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     student:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 9a196ca1-043d-4730-ab2b-39b74647c2d6
 *                         name:
 *                           type: string
 *                           example: João da Silva
 *                         email:
 *                           type: string
 *                           example: joao.silva@gmail.com
 *                         ra:
 *                           type: string
 *                           example: RA123456
 *                         cpf:
 *                           type: string
 *                           example: 12345678901
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-04-11T23:03:29.000Z
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-04-11T23:03:29.000Z
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Erro de validação
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 */
router.put('/:id', isAdmin, studentController.updateStudent);
/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     tags: [Students]
 *     summary: Remove um estudante existente
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do estudante
 *         example: 9a196ca1-043d-4730-ab2b-39b74647c2d6
 *     responses:
 *       204:
 *         description: Estudante removido com sucesso
 *       404:
 *         description: Estudante não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Estudante não encontrado
 *       400:
 *         description: Erro ao remover estudante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Não é possível remover um estudante matriculado em turmas
 */
router.delete('/:id', isAdmin, studentController.deleteStudent);

module.exports = router;
