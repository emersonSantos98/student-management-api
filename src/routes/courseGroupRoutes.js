const express = require('express');
const router = express.Router();
const courseGroupController = require('../controllers/courseGroupController');
const {isAdmin, authMiddleware} = require('../middlewares/auth');


router.use(authMiddleware);

/**
 * @swagger
 * /course-groups:
 *   get:
 *     tags: [Course Groups]
 *     summary: Lista todas as turmas
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turmas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: courseGroup
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Lista de turmas
 *                 data:
 *                   type: object
 *                   properties:
 *                     courseGroups:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 64e44b18-5207-461a-a4c4-dc192a1e6c48
 *                           name:
 *                             type: string
 *                             example: Turma de APIs REST com Node.js 2025
 *                           description:
 *                             type: string
 *                             example: Curso prático de criação de APIs REST usando Node.js, Express e PostgreSQL
 *                           start_date:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-08-05T00:00:00.000Z
 *                           end_date:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-12-18T00:00:00.000Z
 *                           max_students:
 *                             type: integer
 *                             example: 20
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-04-15T03:21:45.000Z
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-04-15T03:21:45.000Z
 *                           enrollments:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   example: 8e821e9b-ee54-4a4d-aacd-3e0a273e999e
 *                                 status:
 *                                   type: string
 *                                   example: active
 *                                 created_at:
 *                                   type: string
 *                                   format: date-time
 *                                   example: 2025-04-15T03:51:24.000Z
 *                                 updated_at:
 *                                   type: string
 *                                   format: date-time
 *                                   example: 2025-04-15T03:51:24.000Z
 *                                 student:
 *                                   type: object
 *                                   properties:
 *                                     id:
 *                                       type: string
 *                                       example: ca1656c2-2059-431a-b162-9ea9bc681edc
 *                                     name:
 *                                       type: string
 *                                       example: emerson santos
 *                                     email:
 *                                       type: string
 *                                       example: emerson.santos@gmail.com
 *                                     created_at:
 *                                       type: string
 *                                       format: date-time
 *                                       example: 2025-04-15T03:51:24.000Z
 *                                     updated_at:
 *                                       type: string
 *                                       format: date-time
 *                                       example: 2025-04-15T03:51:24.000Z
 *                           activeStudentsCount:
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
router.get('/', courseGroupController.getAllCourseGroups);
/**
 * @swagger
 * /course-groups/{id}:
 *   get:
 *     tags: [Course Groups]
 *     summary: Obtém uma turma específica pelo ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da turma
 *         example: 9b68ff62-ea6e-442a-bc5c-4f070e8a64b1
 *     responses:
 *       200:
 *         description: Turma encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: courseGroup
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Turma encontrada
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 9b68ff62-ea6e-442a-bc5c-4f070e8a64b1
 *                     name:
 *                       type: string
 *                       example: Turma de Desenvolvimento Backend 2025
 *                     description:
 *                       type: string
 *                       example: Curso completo de desenvolvimento
 *                     start_date:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-08-08T00:00:00.000Z
 *                     end_date:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-09-30T00:00:00.000Z
 *                     max_students:
 *                       type: integer
 *                       example: 41
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-13T16:54:42.000Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-13T16:54:42.000Z
 *                     enrollments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 2cda0c0e-d7d3-48de-96ac-87739c85578c
 *                           status:
 *                             type: string
 *                             example: active
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-04-15T03:51:24.000Z
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-04-15T03:51:24.000Z
 *                           student:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: ca1656c2-2059-431a-b162-9ea9bc681edc
 *                               name:
 *                                 type: string
 *                                 example: emerson santos
 *                               email:
 *                                 type: string
 *                                 example: emerson.santos@gmail.com
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 *                                 example: 2025-04-15T03:51:24.000Z
 *                               updated_at:
 *                                 type: string
 *                                 format: date-time
 *                                 example: 2025-04-15T03:51:24.000Z
 *                     activeStudentsCount:
 *                       type: integer
 *                       example: 3
 */
router.get('/:id', courseGroupController.getCourseGroupById);
/**
 * @swagger
 * /course-groups:
 *   post:
 *     tags: [Course Groups]
 *     summary: Cria uma nova turma
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
 *                 example: Turma de APIs REST com Node.js 2025
 *               description:
 *                 type: string
 *                 example: Curso prático de criação de APIs REST usando Node.js, Express e PostgreSQL
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: 2025-08-05
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-18
 *               max_students:
 *                 type: integer
 *                 example: 20
 *             required:
 *               - name
 *               - start_date
 *               - end_date
 *               - max_students
 *     responses:
 *       201:
 *         description: Turma criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: courseGroup
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Turma criada com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 8cb2e34a-fcb3-4244-a302-98d11d95b861
 *                     name:
 *                       type: string
 *                       example: Turma de APIs REST com Node.js 2025
 *                     description:
 *                       type: string
 *                       example: Curso prático de criação de APIs REST usando Node.js, Express e PostgreSQL
 *                     start_date:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-08-05T00:00:00.000Z
 *                     end_date:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-12-18T00:00:00.000Z
 *                     max_students:
 *                       type: integer
 *                       example: 20
 *                     created_at:
 *                       type: object
 *                       properties:
 *                         val:
 *                           type: string
 *                           example: CURRENT_TIMESTAMP
 *                     updated_at:
 *                       type: object
 *                       properties:
 *                         val:
 *                           type: string
 *                           example: CURRENT_TIMESTAMP
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
 *                         example: name
 *                       message:
 *                         type: string
 *                         example: Uma turma com este nome já existe
 */
router.post('/', isAdmin, courseGroupController.createCourseGroup);
/**
 * @swagger
 * /course-groups/{id}:
 *   put:
 *     tags: [Course Groups]
 *     summary: Atualiza uma turma existente
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da turma
 *         example: 9b68ff62-ea6e-442a-bc5c-4f070e8a64b1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Turma de Desenvolvimento Backend 2025
 *               description:
 *                 type: string
 *                 example: Curso completo de desenvolvimento
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: 2025-08-01
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-15
 *               max_students:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: Turma atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: courseGroup
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Turma atualizada com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 9b68ff62-ea6e-442a-bc5c-4f070e8a64b1
 *                     name:
 *                       type: string
 *                       example: Turma de Desenvolvimento Backend 2025
 *                     description:
 *                       type: string
 *                       example: Curso completo de desenvolvimento
 *                     start_date:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-08-01T00:00:00.000Z
 *                     end_date:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-09-15T00:00:00.000Z
 *                     max_students:
 *                       type: integer
 *                       example: 30
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-13T16:54:42.000Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-13T16:54:42.000Z
 *                     enrollments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           status:
 *                             type: string
 *                             example: active
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                           student:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                               created_at:
 *                                 type: string
 *                                 format: date-time
 *                               updated_at:
 *                                 type: string
 *                                 format: date-time
 *                     activeStudentsCount:
 *                       type: integer
 *                       example: 3
 */
router.put('/:id', isAdmin, courseGroupController.updateCourseGroup);
/**
 * @swagger
 * /course-groups/{id}:
 *   delete:
 *     tags: [Course Groups]
 *     summary: Remove uma turma existente
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da turma
 *         example: 9b68ff62-ea6e-442a-bc5c-4f070e8a64b1
 *     responses:
 *       200:
 *         description: Turma removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: courseGroup
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Turma removida com sucesso
 *       404:
 *         description: Turma não encontrada
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
 *                   example: Turma não encontrada
 *       400:
 *         description: Erro ao remover turma
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
 *                   example: Não é possível remover uma turma com alunos matriculados
 */
router.delete('/:id', isAdmin, courseGroupController.deleteCourseGroup);

module.exports = router;
