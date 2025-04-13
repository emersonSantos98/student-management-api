const courseGroupService = require('../services/courseGroupService');
const { Op } = require('sequelize');

class CourseGroupController {
    async getAllCourseGroups(req, res, next) {
        try {
            const { page, limit, name, startDate, endDate } = req.query;

            const filters = {};
            if (name) filters.name = { [Op.like]: `%${name}%` };
            if (startDate) filters.start_date = { [Op.gte]: new Date(startDate) };
            if (endDate) filters.end_date = { [Op.lte]: new Date(endDate) };

            const pagination = {
                page: parseInt(page, 10) || 1,
                limit: parseInt(limit, 10) || 10
            };

            const result = await courseGroupService.getAllCourseGroups(filters, pagination);

            return res.json({
                object: 'courseGroup',
                status: 'success',
                message: 'Lista de turmas',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getCourseGroupById(req, res, next) {
        try {
            const { id } = req.params;
            const courseGroup = await courseGroupService.getCourseGroupById(id);

            return res.json({
                object: 'courseGroup',
                status: 'success',
                message: 'Turma encontrada',
                data: courseGroup
            });
        } catch (error) {
            next(error);
        }
    }

    async createCourseGroup(req, res, next) {
        try {
            const courseGroupData = req.body;
            const courseGroup = await courseGroupService.createCourseGroup(courseGroupData);

            return res.status(201).json({
                object: 'courseGroup',
                status: 'success',
                message: 'Turma criada com sucesso',
                data: courseGroup
            });
        } catch (error) {
            next(error);
        }
    }

    async updateCourseGroup(req, res, next) {
        try {
            const { id } = req.params;
            const courseGroupData = req.body;

            const courseGroup = await courseGroupService.updateCourseGroup(id, courseGroupData);

            return res.json({
                object: 'courseGroup',
                status: 'success',
                message: 'Turma atualizada com sucesso',
                data: courseGroup
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteCourseGroup(req, res, next) {
        try {
            const { id } = req.params;

            const courseGroup = await courseGroupService.getCourseGroupById(id);

            if (courseGroup.enrollments && courseGroup.enrollments.length > 0) {
                return res.status(400).json({
                    object: 'courseGroup',
                    status: 'error',
                    message: 'Não é possível excluir uma turma com matrículas ativas'
                });
            }

            await courseGroupService.deleteCourseGroup(id);

            return res.status(204).end();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CourseGroupController();
