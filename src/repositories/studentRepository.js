const { Student, Enrollment, CourseGroup } = require('../models');
const { NotFoundError } = require('../errors');

class StudentRepository {
    async findAll(filters = {}, pagination = {}) {
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        try {
            const students = await Student.findAndCountAll({
                where: filters,
                include: [
                    {
                        model: Enrollment,
                        as: 'enrollments',
                        attributes: ['id', 'status', 'created_at', 'updated_at'],
                        include: [
                            {
                                model: CourseGroup,
                                as: 'courseGroup',
                                attributes: ['id', 'name']
                            }
                        ]
                    }
                ],
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });

            const studentsWithActiveCount = students.rows.map(student => {
                const activeCourseCount = student.enrollments.filter(
                    enrollment => enrollment.status === 'active'
                ).length;

                return {
                    ...student.toJSON(),
                    activeCourseCount
                };
            });

            return {
                students: studentsWithActiveCount,
                total: students.count,
                totalPages: Math.ceil(students.count / limit),
                currentPage: page
            };
        } catch (error) {
            throw error;
        }
    }
    async findById(id) {
        try {
            const student = await Student.findByPk(id);

            if (!student) {
                throw new NotFoundError('Estudante');
            }

            return student;
        } catch (error) {
            throw error;
        }
    }
    async findByEmail(email) {
        try {
            return await Student.findOne({ where: { email } });
        } catch (error) {
            throw error;
        }
    }
    async findStudentWithEnrollments(id) {
        try {
            const student = await Student.findByPk(id, {
                include: [
                    {
                        model: Enrollment,
                        as: 'enrollments',
                        include: [
                            {
                                model: Class,
                                as: 'class'
                            }
                        ]
                    }
                ]
            });

            if (!student) {
                throw new NotFoundError('Estudante');
            }

            return student;
        } catch (error) {
            throw error;
        }
    }
    async create(data) {
        try {
            return await Student.create(data);
        } catch (error) {
            throw error;
        }
    }
    async update(id, data) {
        try {
            const student = await this.findById(id);

            await student.update(data);

            return student;
        } catch (error) {
            throw error;
        }
    }
    async delete(id) {
        try {
            const student = await this.findById(id);

            await student.destroy();

            return true;
        } catch (error) {
            throw error;
        }
    }
    async checkExistingStudent(data) {
        try {
            const { cpf, ra, email } = data;
            const existingFields = [];

            if (cpf) {
                const studentWithCpf = await Student.findOne({
                    where: { cpf: cpf.replace(/\D/g, '') }
                });
                if (studentWithCpf) {
                    existingFields.push({ field: 'cpf', message: 'Este CPF já está cadastrado' });
                }
            }

            if (ra) {
                const studentWithRa = await Student.findOne({
                    where: { ra }
                });
                if (studentWithRa) {
                    existingFields.push({ field: 'ra', message: 'Este RA já está cadastrado' });
                }
            }

            if (email) {
                const studentWithEmail = await Student.findOne({
                    where: { email }
                });
                if (studentWithEmail) {
                    existingFields.push({ field: 'email', message: 'Este email já está cadastrado' });
                }
            }

            return existingFields;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StudentRepository();
