const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const {isAdmin, authMiddleware} = require('../middlewares/auth');

router.use(authMiddleware);
/**
 * @swagger
 * /enrollments/enroll:
 *   post:
 *     tags: [Enrollments]
 *     summary: Matricula um estudante em uma turma
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *                 format: uuid
 *                 example: 9a196ca1-043d-4730-ab2b-39b74647c2d6
 *               course_group_id:
 *                 type: string
 *                 format: uuid
 *                 example: 9b68ff62-ea6e-442a-bc5c-4f070e8a64b1
 *             required:
 *               - student_id
 *               - course_group_id
 *     responses:
 *       201:
 *         description: Estudante matriculado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: enrollment
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Estudante matriculado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: e9cdd14d-3d43-4c97-ac78-d8d70bf05a2d
 *                     enrollment_date:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-15T20:22:05.090Z
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-15T20:22:05.090Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-15T20:22:05.090Z
 *                     student_id:
 *                       type: string
 *                       format: uuid
 *                       example: ba0975ed-75f7-4b7d-806b-a2e6f0c1d1bb
 *                     course_group_id:
 *                       type: string
 *                       format: uuid
 *                       example: 8cb2e34a-fcb3-4244-a302-98d11d95b861
 *                     status:
 *                       type: string
 *                       example: active
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
 */
router.post('/enroll', isAdmin, enrollmentController.enrollStudent);
/**
 * @swagger
 * /enrollments/cancel:
 *   put:
 *     tags: [Enrollments]
 *     summary: Cancela a matrícula de um estudante em uma turma
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *                 format: uuid
 *                 example: 9a196ca1-043d-4730-ab2b-39b74647c2d6
 *               course_group_id:
 *                 type: string
 *                 format: uuid
 *                 example: 9b68ff62-ea6e-442a-bc5c-4f070e8a64b1
 *             required:
 *               - student_id
 *               - course_group_id
 *     responses:
 *       200:
 *         description: Matrícula cancelada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: enrollment
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Matrícula cancelada com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 9ac552c6-71f5-4b0e-a268-744ea62c72e4
 *                     student_id:
 *                       type: string
 *                       format: uuid
 *                       example: 9a196ca1-043d-4730-ab2b-39b74647c2d6
 *                     course_group_id:
 *                       type: string
 *                       format: uuid
 *                       example: 9b68ff62-ea6e-442a-bc5c-4f070e8a64b1
 *                     enrollment_date:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-15T03:47:16.000Z
 *                     status:
 *                       type: string
 *                       example: cancelled
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-15T03:47:16.000Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-15T04:20:46.456Z
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
 *       404:
 *         description: Matrícula não encontrada
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
 *                   example: Matrícula não encontrada
 */
router.put('/cancel', isAdmin, enrollmentController.cancelEnrollment);
/**
 * @swagger
 * /enrollments/{id}:
 *   delete:
 *     tags: [Enrollments]
 *     summary: Remove uma matrícula existente
 *     description: Remove uma matrícula usando o ID da matrícula (enrollment_id)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da matrícula (enrollment_id)
 *         example: e9cdd14d-3d43-4c97-ac78-d8d70bf05a2d
 *     responses:
 *       204:
 *         description: Matrícula removida com sucesso
 *       404:
 *         description: Matrícula não encontrada
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
 *                   example: Matrícula não encontrada
 *       400:
 *         description: Erro ao remover matrícula
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
 *                   example: Erro ao remover matrícula
 */
router.delete('/:id', isAdmin, enrollmentController.deleteEnrollment);

module.exports = router;
