const enrollmentRepository = require('../repositories/enrollmentRepository');
const studentRepository = require('../repositories/studentRepository');
const courseGroupRepository = require('../repositories/courseGroupRepository');
const { ValidationError, NotFoundError } = require('../errors');

class EnrollmentService {
    async enrollStudent(data) {
        try {
            const { student_id, course_group_id } = data;

            const student = await studentRepository.findById(student_id);
            if (!student) {
                throw new NotFoundError('Estudante');
            }

            const courseGroup = await courseGroupRepository.findById(course_group_id);
            if (!courseGroup) {
                throw new NotFoundError('Turma');
            }

            const existingEnrollment = await enrollmentRepository.findByStudentAndCourseGroup(
                student_id,
                course_group_id
            );

            if (existingEnrollment) {
                throw new ValidationError([
                    { field: 'enrollment', message: 'Estudante já está matriculado nesta turma' }
                ]);
            }

            return await enrollmentRepository.create({
                student_id,
                course_group_id,
                status: 'active'
            });
        } catch (error) {
            throw error;
        }
    }

    async cancelEnrollment(data) {
        try {
            const { student_id, course_group_id } = data;

            const enrollment = await enrollmentRepository.findByStudentAndCourseGroup(student_id, course_group_id);
            console.log('enrollment', enrollment)

            if (!enrollment) {
                throw new NotFoundError('Matrícula');
            }

            if (enrollment.status === 'cancelled') {
                throw new ValidationError([
                    { field: 'status', message: 'Esta matrícula já está cancelada' }
                ]);
            }

            return await enrollmentRepository.cancelEnrollment( student_id, course_group_id);
        } catch (error) {
            throw error;
        }
    }

    async deleteEnrollment(id) {
        try {
            const enrollment = await enrollmentRepository.findById(id);
            if (!enrollment) {
                throw new NotFoundError('Matrícula');
            }

            return await enrollmentRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new EnrollmentService();
