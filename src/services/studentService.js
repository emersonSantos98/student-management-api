const studentRepository = require('../repositories/studentRepository');
const enrollmentRepository = require('../repositories/enrollmentRepository');
const courseGroupRepository = require('../repositories/courseGroupRepository');
const { ValidationError } = require('../errors');
const { validateStudent } = require('../utils/validateStudent');

class StudentService {
    async getAllStudents(filters, pagination) {
        try {
            return await studentRepository.findAll(filters, pagination);
        } catch (error) {
            throw error;
        }
    }

    async getStudentById(id) {
        try {
            return await studentRepository.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async getStudentWithEnrollments(id) {
        try {
            return await studentRepository.findStudentWithEnrollments(id);
        } catch (error) {
            throw error;
        }
    }

    async createStudent(data) {
        try {
            const { courseGroupIds, ...studentData } = data;

            const validationErrors = validateStudent(studentData);
            if (validationErrors.length > 0) {
                throw new ValidationError(validationErrors);
            }

            const formattedData = {
                ...studentData,
                cpf: studentData.cpf.replace(/\D/g, '')
            };

            const existingFields = await studentRepository.checkExistingStudent(formattedData);
            if (existingFields.length > 0) {
                throw new ValidationError(existingFields);
            }


            const student = await studentRepository.create(formattedData);

            if (courseGroupIds && Array.isArray(courseGroupIds) && courseGroupIds.length > 0) {
                const enrollments = [];

                for (const courseGroupId of courseGroupIds) {
                    const courseGroup = await courseGroupRepository.findById(courseGroupId);
                    if (!courseGroup) {
                        throw new ValidationError([
                            { field: 'courseGroupIds', message: `Turma ${courseGroupId} não encontrada` }
                        ]);
                    }

                    const enrollment = await enrollmentRepository.create({
                        student_id: student.id,
                        course_group_id: courseGroupId,
                        status: 'active'
                    });

                    enrollments.push(enrollment);
                }

                return {
                    student,
                    enrollments
                };
            }

            return { student };
        } catch (error) {
            throw error;
        }
    }

    async updateStudent(id, data) {
        try {
            const { courseGroupIds, ra, cpf, ...editableData } = data;

            if (ra !== undefined || cpf !== undefined) {
                const errors = [];
                if (ra !== undefined) {
                    errors.push({ field: 'ra', message: 'O RA não pode ser alterado' });
                }
                if (cpf !== undefined) {
                    errors.push({ field: 'cpf', message: 'O CPF não pode ser alterado' });
                }
                throw new ValidationError(errors);
            }

            const validationErrors = validateStudent(editableData, true);
            if (validationErrors.length > 0) {
                throw new ValidationError(validationErrors);
            }

            if (editableData.email) {
                const currentStudent = await studentRepository.findById(id);
                if (editableData.email !== currentStudent.email) {
                    const existingStudent = await studentRepository.findByEmail(editableData.email);
                    if (existingStudent) {
                        throw new ValidationError([
                            { field: 'email', message: 'Este email já está cadastrado' }
                        ]);
                    }
                }
            }

            const updatedStudent = await studentRepository.update(id, editableData);

            if (courseGroupIds && Array.isArray(courseGroupIds)) {
                const enrollments = [];

                for (const courseGroupId of courseGroupIds) {
                    const courseGroup = await courseGroupRepository.findById(courseGroupId);
                    if (!courseGroup) {
                        throw new ValidationError([
                            { field: 'courseGroupIds', message: `Turma ${courseGroupId} não encontrada` }
                        ]);
                    }

                    const existingEnrollment = await enrollmentRepository.findByStudentAndCourseGroup(id, courseGroupId);
                    if (!existingEnrollment) {
                        const enrollment = await enrollmentRepository.create({
                            student_id: id,
                            course_group_id: courseGroupId,
                            status: 'active'
                        });
                        enrollments.push(enrollment);
                    }
                }

                return {
                    student: updatedStudent,
                    newEnrollments: enrollments
                };
            }

            return { student: updatedStudent };
        } catch (error) {
            throw error;
        }
    }


    async deleteStudent(id) {
        try {
            return await studentRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StudentService();
