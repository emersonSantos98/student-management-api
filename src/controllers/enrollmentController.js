const EnrollmentService = require('../services/enrollmentService');

class EnrollmentController {
    async enrollStudent(req, res, next) {
        try {
            const enrollment = await EnrollmentService.enrollStudent(req.body);

            return res.status(201).json({
                object: 'enrollment',
                status: 'success',
                message: 'Estudante matriculado com sucesso',
                data: enrollment
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelEnrollment(req, res, next) {
        try {
            const enrollment = await EnrollmentService.cancelEnrollment(req.body);

            return res.json({
                object: 'enrollment',
                status: 'success',
                message: 'Matrícula cancelada com sucesso',
                data: enrollment
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteEnrollment(req, res, next) {
        try {
            const { id } = req.params;
            const enrollment = await EnrollmentService.deleteEnrollment(id);
            return res.json({
                object: 'enrollment',
                status: 'success',
                message: 'Matrícula excluída com sucesso',
                data: enrollment
            });
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new EnrollmentController();
