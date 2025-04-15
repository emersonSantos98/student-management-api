const studentService = require('../services/studentService');
const { Op } = require('sequelize');

class StudentController {
    async getAllStudents(req, res, next) {
        try {
            const { page, limit, name, email, ra } = req.query;

            const filters = {};
            if (name) filters.name = { [Op.like]: `%${name}%` };
            if (email) filters.email = { [Op.like]: `%${email}%` };
            if(ra) filters.ra = { [Op.like]: `%${ra}%` };

            const pagination = {
                page: parseInt(page, 10) || 1,
                limit: parseInt(limit, 10) || 10
            };

            const result = await studentService.getAllStudents(filters, pagination);

            return res.json({
                object: 'student',
                status: 'success',
                message: 'Lista de estudantes',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getStudentById(req, res, next) {
        try {
            const { id } = req.params;
            const student = await studentService.getStudentById(id);

            return res.json({
                object: 'student',
                status: 'success',
                message: 'Estudante encontrado',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    async getStudentWithEnrollments(req, res, next) {
        try {
            const { id } = req.params;
            const student = await studentService.getStudentWithEnrollments(id);

            return res.json({
                object: 'student',
                status: 'success',
                message: 'Estudante encontrado',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    async createStudent(req, res, next) {
        try {
            const student = await studentService.createStudent(req.body);

            return res.status(201).json({
                object: 'student',
                status: 'success',
                message: 'Estudante criado com sucesso',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    async updateStudent(req, res, next) {
        try {
            const { id } = req.params;
            const student = await studentService.updateStudent(id, req.body);

            return res.json({
                object: 'student',
                status: 'success',
                message: 'Estudante atualizado com sucesso',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteStudent(req, res, next) {
        try {
            const { id } = req.params;
            await studentService.deleteStudent(id);

            return res.status(204).end();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StudentController();
