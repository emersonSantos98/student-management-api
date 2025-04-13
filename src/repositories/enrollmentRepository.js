const { Enrollment, Student, CourseGroup } = require('../models');
const { NotFoundError } = require('../errors');

class EnrollmentRepository {
    async findAll(filters = {}, pagination = {}) {
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        try {
            const enrollments = await Enrollment.findAndCountAll({
                where: filters,
                include: [
                    {
                        model: Student,
                        as: 'student',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: CourseGroup,
                        as: 'courseGroup',
                        attributes: ['id', 'name', 'start_date', 'end_date']
                    }
                ],
                limit,
                offset,
                order: [['enrollment_date', 'DESC']]
            });

            return {
                enrollments: enrollments.rows,
                total: enrollments.count,
                totalPages: Math.ceil(enrollments.count / limit),
                currentPage: page
            };
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            const enrollment = await Enrollment.findByPk(id, {
                include: [
                    {
                        model: Student,
                        as: 'student',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: CourseGroup,
                        as: 'courseGroup',
                        attributes: ['id', 'name', 'start_date', 'end_date']
                    }
                ]
            });

            if (!enrollment) {
                throw new NotFoundError('Matrícula');
            }

            return enrollment;
        } catch (error) {
            throw error;
        }
    }

    async create(data) {
        try {
            return await Enrollment.create(data);
        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {
        try {
            const enrollment = await this.findById(id);
            await enrollment.update(data);
            return enrollment;
        } catch (error) {
            throw error;
        }
    }

    async findByStudentAndCourseGroup(studentId, courseGroupId) {
        try {
            return await Enrollment.findOne({
                where: {
                    student_id: studentId,
                    course_group_id: courseGroupId
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async findByStudent(studentId) {
        try {
            return await Enrollment.findAll({
                where: { student_id: studentId },
                include: [
                    {
                        model: CourseGroup,
                        as: 'courseGroup',
                        attributes: ['id', 'name', 'start_date', 'end_date']
                    }
                ]
            });
        } catch (error) {
            throw error;
        }
    }

    async findByCourseGroup(courseGroupId) {
        try {
            return await Enrollment.findAll({
                where: { course_group_id: courseGroupId },
                include: [
                    {
                        model: Student,
                        as: 'student',
                        attributes: ['id', 'name', 'email']
                    }
                ]
            });
        } catch (error) {
            throw error;
        }
    }

    async cancelEnrollment(studentId, courseGroupId) {
        try {
            const enrollment = await this.findByStudentAndCourseGroup(studentId, courseGroupId);
            return await enrollment.update({
                status: 'cancelled',
                updated_at: new Date()
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new EnrollmentRepository();
