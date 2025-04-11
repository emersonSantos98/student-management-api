const userService = require('../../../services/userService');
const userRepository = require('../../../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ValidationError, AuthenticationError } = require('../../../errors');

jest.mock('../../../repositories/userRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');


jest.mock('../../../utils/validateUser', () => ({
    validateUser: jest.fn().mockReturnValue([]),
    validatePassword: jest.fn().mockReturnValue([])
}));


describe('User Service', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'test-secret-key';
    });

    afterEach(() => {
        jest.clearAllMocks();
        require('../../../utils/validateUser').validatePassword.mockReturnValue([]);
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = [
                {
                    id: 'uuid-1',
                    name: 'Administrador',
                    email: 'admin@example.com',
                    role: 'admin',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    id: 'uuid-2',
                    name: 'Estudante',
                    email: 'student@example.com',
                    role: 'student',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ];
            userRepository.findAll.mockResolvedValue(users);

            const result = await userService.getAllUsers();

            expect(result).toEqual(users);
            expect(userRepository.findAll).toHaveBeenCalledWith({}, {});
        });

        it('should pass filters and pagination to repository', async () => {
            const filters = { role: 'admin' };
            const pagination = { page: 1, limit: 10 };
            userRepository.findAll.mockResolvedValue([]);

            await userService.getAllUsers(filters, pagination);

            expect(userRepository.findAll).toHaveBeenCalledWith(filters, pagination);
        });
    });

    describe('getUserById', () => {
        it('should return user by id', async () => {
            const user = {
                id: 'uuid-1',
                name: 'Administrador',
                email: 'admin@example.com',
                role: 'admin',
                created_at: new Date(),
                updated_at: new Date()
            };
            userRepository.findById.mockResolvedValue(user);

            const result = await userService.getUserById('uuid-1');

            expect(result).toEqual(user);
            expect(userRepository.findById).toHaveBeenCalledWith('uuid-1');
        });
    });

    describe('createUser', () => {
        it('should create a user successfully', async () => {
            const userData = {
                name: 'Novo Usuário',
                email: 'novo@example.com',
                password: '@123456',
                role: 'student'
            };

            const expectedUser = {
                id: 'new-uuid',
                name: 'Novo Usuário',
                email: 'novo@example.com',
                role: 'student',
                created_at: expect.any(Date),
                updated_at: expect.any(Date)
            };

            require('../../../utils/validateUser').validateUser.mockReturnValue([]);

            userRepository.findByEmail.mockResolvedValue(null);
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('hashed_password');
            userRepository.create.mockResolvedValue(expectedUser);

            const result = await userService.createUser(userData);

            expect(result).toEqual(expectedUser);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 'salt');
            expect(userRepository.create).toHaveBeenCalledWith({
                name: 'Novo Usuário',
                email: 'novo@example.com',
                role: 'student',
                password_hash: 'hashed_password'
            });
        });

        it('should throw ValidationError for invalid data', async () => {
            const invalidUserData = {
                name: 'Jo',
                email: 'invalid-email',
                password: '123',
                role: 'invalid-role'
            };

            require('../../../utils/validateUser').validateUser.mockReturnValue([
                { field: 'name', message: 'Nome deve ter pelo menos 3 caracteres' },
                { field: 'email', message: 'Email inválido' }
            ]);

            await expect(userService.createUser(invalidUserData))
                .rejects
                .toThrow(ValidationError);
        });

        it('should throw ValidationError if email already exists', async () => {
            const userData = {
                name: 'Novo Usuário',
                email: 'admin@example.com',
                password: '@123456',
                role: 'student'
            };

            require('../../../utils/validateUser').validateUser.mockReturnValue([]);

            userRepository.findByEmail.mockResolvedValue({
                id: 'uuid-1',
                email: 'admin@example.com'
            });

            await expect(userService.createUser(userData))
                .rejects
                .toThrow(ValidationError);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
        });
    });

    describe('updateUser', () => {
        it('should update a user successfully', async () => {
            const userId = 'uuid-1';
            const userData = {
                name: 'Administrador Atualizado',
                email: 'admin-updated@example.com'
            };

            const expectedUser = {
                id: userId,
                name: 'Administrador Atualizado',
                email: 'admin-updated@example.com',
                role: 'admin',
                created_at: expect.any(Date),
                updated_at: expect.any(Date)
            };

            userRepository.findByEmail.mockResolvedValue(null);
            userRepository.update.mockResolvedValue(expectedUser);

            const result = await userService.updateUser(userId, userData);

            expect(result).toEqual(expectedUser);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(userRepository.update).toHaveBeenCalledWith(userId, userData);
        });

        it('should throw ValidationError if trying to update password directly', async () => {
            const userId = 'uuid-1';
            const userData = {
                name: 'Administrador',
                password: 'NovaPassword123'
            };

            await expect(userService.updateUser(userId, userData))
                .rejects
                .toThrow(ValidationError);
        });

        it('should throw ValidationError if email already exists for another user', async () => {
            const userId = 'uuid-1';
            const userData = {
                email: 'student@example.com'
            };

            userRepository.findByEmail.mockResolvedValue({
                id: 'uuid-2',
                email: 'student@example.com'
            });

            await expect(userService.updateUser(userId, userData))
                .rejects
                .toThrow(ValidationError);
        });
    });

    describe('deleteUser', () => {
        it('should delete a user successfully', async () => {
            const userId = 'uuid-1';
            userRepository.delete.mockResolvedValue(true);

            const result = await userService.deleteUser(userId);

            expect(result).toBe(true);
            expect(userRepository.delete).toHaveBeenCalledWith(userId);
        });
    });

    describe('authenticateUser', () => {
        it('should authenticate user and return token', async () => {
            const credentials = {
                email: 'admin@example.com',
                password: '@123456'
            };

            const user = {
                id: 'uuid-1',
                name: 'Administrador',
                email: 'admin@example.com',
                password_hash: 'hashed_password',
                role: 'admin',
                toJSON: jest.fn().mockReturnValue({
                    id: 'uuid-1',
                    name: 'Administrador',
                    email: 'admin@example.com',
                    password_hash: 'hashed_password',
                    role: 'admin'
                })
            };

            const token = 'jwt_token';

            userRepository.findByEmail.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(token);

            const result = await userService.authenticateUser(credentials.email, credentials.password);

            expect(result).toEqual({
                user: {
                    id: 'uuid-1',
                    name: 'Administrador',
                    email: 'admin@example.com',
                    role: 'admin'
                },
                token
            });
            expect(userRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(credentials.password, 'hashed_password');
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 'uuid-1', role: 'admin' },
                'test-secret-key',
                { expiresIn: '1d' }
            );
        });

        it('should throw ValidationError if email or password is missing', async () => {
            await expect(userService.authenticateUser('', '@123456'))
                .rejects
                .toThrow(ValidationError);

            await expect(userService.authenticateUser('admin@example.com', ''))
                .rejects
                .toThrow(ValidationError);
        });

        it('should throw AuthenticationError if user not found', async () => {
            userRepository.findByEmail.mockResolvedValue(null);

            await expect(userService.authenticateUser('nonexistent@example.com', '@123456'))
                .rejects
                .toThrow(AuthenticationError);
        });

        it('should throw AuthenticationError if password does not match', async () => {
            const user = {
                id: 'uuid-1',
                email: 'admin@example.com',
                password_hash: 'hashed_password'
            };

            userRepository.findByEmail.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);

            await expect(userService.authenticateUser('admin@example.com', 'wrong_password'))
                .rejects
                .toThrow(AuthenticationError);
        });
    });

    describe('changePassword', () => {
        it('should change password successfully', async () => {
            const userId = 'uuid-1';
            const currentPassword = '@123456';
            const newPassword = 'NovaPassword123';

            const user = {
                id: userId,
                password_hash: 'old_hashed_password'
            };

            userRepository.findById.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.genSalt.mockResolvedValue('salt');
            bcrypt.hash.mockResolvedValue('new_hashed_password');
            userRepository.update.mockResolvedValue(true);

            const result = await userService.changePassword(userId, currentPassword, newPassword);

            expect(result).toBe(true);
            expect(userRepository.findById).toHaveBeenCalledWith(userId);
            expect(bcrypt.compare).toHaveBeenCalledWith(currentPassword, 'old_hashed_password');
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 'salt');
            expect(userRepository.update).toHaveBeenCalledWith(userId, { password_hash: 'new_hashed_password' });
        });

        it('should throw ValidationError if current or new password is missing', async () => {
            await expect(userService.changePassword('uuid-1', '', 'NovaPassword123'))
                .rejects
                .toThrow(ValidationError);

            await expect(userService.changePassword('uuid-1', '@123456', ''))
                .rejects
                .toThrow(ValidationError);
        });

        it('should throw ValidationError if new password is invalid', async () => {
            const userId = 'uuid-1';
            const currentPassword = '@123456';
            const invalidPassword = '123';

            require('../../../utils/validateUser').validatePassword.mockReturnValue([
                { field: 'password', message: 'Senha deve ter no mínimo 8 caracteres' }
            ]);

            await expect(userService.changePassword(userId, currentPassword, invalidPassword))
                .rejects
                .toThrow(ValidationError);
        });

        it('should throw ValidationError if current password is incorrect', async () => {
            const userId = 'uuid-1';
            const user = {
                id: userId,
                password_hash: 'hashed_password'
            };

            userRepository.findById.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);
            
            await expect(userService.changePassword(userId, 'WrongPassword', 'NovaPassword123'))
                .rejects
                .toThrow(ValidationError);
        });
    });
});
