const studentRepository = require('../repositories/studentRepository');
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
            const validationErrors = validateStudent(data);

            if (validationErrors.length > 0) {
                throw new ValidationError(validationErrors);
            }

            const formattedData = {
                ...data,
                cpf: data.cpf.replace(/\D/g, '')
            };

            const existingFields = await studentRepository.checkExistingStudent(formattedData);
            if (existingFields.length > 0) {
                throw new ValidationError(existingFields);
            }

            return await studentRepository.create(formattedData);
        } catch (error) {
            throw error;
        }
    }

    async updateStudent(id, data) {
        try {
            const { ra, cpf, ...editableData } = data;

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

            return await studentRepository.update(id, editableData);
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
