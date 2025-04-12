const studentService = require('../../../services/studentService');
const studentRepository = require('../../../repositories/studentRepository');
const { ValidationError } = require('../../../errors');

jest.mock('../../../repositories/studentRepository');
jest.mock('../../../utils/validateStudent', () => ({
    validateStudent: jest.fn().mockReturnValue([])
}));

describe('Student Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllStudents', () => {
        it('should return all students', async () => {
            const students = [
                {
                    id: 'uuid-1',
                    name: 'João Silva',
                    email: 'joao@example.com',
                    ra: '12345',
                    cpf: '12345678901',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    id: 'uuid-2',
                    name: 'Maria Souza',
                    email: 'maria@example.com',
                    ra: '67890',
                    cpf: '98765432101',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ];
            studentRepository.findAll.mockResolvedValue(students);

            const result = await studentService.getAllStudents();

            expect(result).toEqual(students);
            expect(studentRepository.findAll).toHaveBeenCalledWith(undefined, undefined);
        });

        it('should pass filters and pagination to repository', async () => {
            const filters = { name: 'João' };
            const pagination = { page: 1, limit: 10 };
            studentRepository.findAll.mockResolvedValue([]);

            await studentService.getAllStudents(filters, pagination);

            expect(studentRepository.findAll).toHaveBeenCalledWith(filters, pagination);
        });
    });

    describe('getStudentById', () => {
        it('should return student by id', async () => {
            const student = {
                id: 'uuid-1',
                name: 'João Silva',
                email: 'joao@example.com',
                ra: '12345',
                cpf: '12345678901',
                created_at: new Date(),
                updated_at: new Date()
            };
            studentRepository.findById.mockResolvedValue(student);

            const result = await studentService.getStudentById('uuid-1');

            expect(result).toEqual(student);
            expect(studentRepository.findById).toHaveBeenCalledWith('uuid-1');
        });
    });

    describe('getStudentWithEnrollments', () => {
        it('should return student with enrollments', async () => {
            const studentWithEnrollments = {
                id: 'uuid-1',
                name: 'João Silva',
                email: 'joao@example.com',
                ra: '12345',
                cpf: '12345678901',
                enrollments: [
                    {
                        id: 'enroll-1',
                        course_id: 'course-1',
                        course: { name: 'Mathematics' }
                    }
                ]
            };
            studentRepository.findStudentWithEnrollments.mockResolvedValue(studentWithEnrollments);

            const result = await studentService.getStudentWithEnrollments('uuid-1');

            expect(result).toEqual(studentWithEnrollments);
            expect(studentRepository.findStudentWithEnrollments).toHaveBeenCalledWith('uuid-1');
        });
    });

    describe('createStudent', () => {
        it('should create a student successfully', async () => {
            const studentData = {
                name: 'Novo Estudante',
                email: 'novo@example.com',
                ra: '54321',
                cpf: '123.456.789-01',
                birth_date: '2000-01-01',
                phone: '(11) 98765-4321'
            };

            const expectedStudent = {
                id: 'new-uuid',
                name: 'Novo Estudante',
                email: 'novo@example.com',
                ra: '54321',
                cpf: '12345678901',
                birth_date: '2000-01-01',
                phone: '(11) 98765-4321',
                created_at: expect.any(Date),
                updated_at: expect.any(Date)
            };

            require('../../../utils/validateStudent').validateStudent.mockReturnValue([]);
            studentRepository.checkExistingStudent.mockResolvedValue([]);
            studentRepository.create.mockResolvedValue(expectedStudent);

            const result = await studentService.createStudent(studentData);

            expect(result).toEqual(expectedStudent);
            expect(studentRepository.checkExistingStudent).toHaveBeenCalledWith({
                ...studentData,
                cpf: '12345678901'
            });
            expect(studentRepository.create).toHaveBeenCalledWith({
                ...studentData,
                cpf: '12345678901'
            });
        });

        it('should throw ValidationError for invalid data', async () => {
            const invalidStudentData = {
                name: 'Jo',
                email: 'invalid-email',
                ra: '123',
                cpf: '123'
            };

            require('../../../utils/validateStudent').validateStudent.mockReturnValue([
                { field: 'name', message: 'Nome deve ter pelo menos 3 caracteres' },
                { field: 'email', message: 'Email inválido' }
            ]);

            await expect(studentService.createStudent(invalidStudentData))
                .rejects
                .toThrow(ValidationError);
        });

        it('should throw ValidationError if student already exists', async () => {
            const studentData = {
                name: 'Novo Estudante',
                email: 'novo@example.com',
                ra: '54321',
                cpf: '123.456.789-01'
            };

            require('../../../utils/validateStudent').validateStudent.mockReturnValue([]);
            studentRepository.checkExistingStudent.mockResolvedValue([
                { field: 'email', message: 'Este email já está cadastrado' }
            ]);

            await expect(studentService.createStudent(studentData))
                .rejects
                .toThrow(ValidationError);
        });
    });

    describe('updateStudent', () => {
        it('should update a student successfully', async () => {
            const studentId = 'uuid-1';
            const studentData = {
                name: 'João Silva Atualizado',
                email: 'joao-updated@example.com',
                birth_date: '1995-05-15',
                phone: '(11) 91234-5678'
            };

            const expectedStudent = {
                id: studentId,
                name: 'João Silva Atualizado',
                email: 'joao-updated@example.com',
                ra: '12345',
                cpf: '12345678901',
                birth_date: '1995-05-15',
                phone: '(11) 91234-5678',
                created_at: expect.any(Date),
                updated_at: expect.any(Date)
            };

            studentRepository.findById.mockResolvedValue({
                id: studentId,
                email: 'joao@example.com'
            });
            studentRepository.findByEmail.mockResolvedValue(null);
            studentRepository.update.mockResolvedValue(expectedStudent);

            const result = await studentService.updateStudent(studentId, studentData);

            expect(result).toEqual(expectedStudent);
            expect(studentRepository.update).toHaveBeenCalledWith(studentId, studentData);
        });

        it('should throw ValidationError if trying to update RA', async () => {
            const studentId = 'uuid-1';
            const studentData = {
                name: 'João Silva',
                ra: '99999'
            };

            await expect(studentService.updateStudent(studentId, studentData))
                .rejects
                .toThrow(ValidationError);
            expect(studentRepository.update).not.toHaveBeenCalled();
        });

        it('should throw ValidationError if trying to update CPF', async () => {
            const studentId = 'uuid-1';
            const studentData = {
                name: 'João Silva',
                cpf: '987.654.321-01'
            };

            await expect(studentService.updateStudent(studentId, studentData))
                .rejects
                .toThrow(ValidationError);
            expect(studentRepository.update).not.toHaveBeenCalled();
        });

        it('should throw ValidationError if email already exists for another student', async () => {
            const studentId = 'uuid-1';
            const studentData = {
                email: 'maria@example.com'
            };

            studentRepository.findById.mockResolvedValue({
                id: studentId,
                email: 'joao@example.com'
            });
            studentRepository.findByEmail.mockResolvedValue({
                id: 'uuid-2',
                email: 'maria@example.com'
            });

            await expect(studentService.updateStudent(studentId, studentData))
                .rejects
                .toThrow(ValidationError);
        });

        it('should not check email if it remains the same', async () => {
            const studentId = 'uuid-1';
            const studentData = {
                name: 'João Silva Atualizado',
                email: 'joao@example.com'
            };

            studentRepository.findById.mockResolvedValue({
                id: studentId,
                email: 'joao@example.com'
            });
            studentRepository.update.mockResolvedValue({
                ...studentData,
                id: studentId
            });

            await studentService.updateStudent(studentId, studentData);

            expect(studentRepository.findByEmail).not.toHaveBeenCalled();
            expect(studentRepository.update).toHaveBeenCalledWith(studentId, studentData);
        });
    });

    describe('deleteStudent', () => {
        it('should delete a student successfully', async () => {
            const studentId = 'uuid-1';
            studentRepository.delete.mockResolvedValue(true);

            const result = await studentService.deleteStudent(studentId);

            expect(result).toBe(true);
            expect(studentRepository.delete).toHaveBeenCalledWith(studentId);
        });
    });
});
