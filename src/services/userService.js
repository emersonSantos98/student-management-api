const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const {  ValidationError,  AuthenticationError } = require('../errors');
const { validateUser, validatePassword } = require('../utils/validateUser');

class UserService {
    async getAllUsers(filters = {}, pagination = {}) {
        try {
            return await userRepository.findAll(filters, pagination);
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await userRepository.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async createUser(data) {

        try {
            const validationErrors = validateUser(data);

            if (validationErrors.length > 0) {
                throw new ValidationError(validationErrors);
            }

            const existingUser = await userRepository.findByEmail(data.email);
            if (existingUser) {
                throw new ValidationError([
                    { field: 'email', message: 'Este email já está em uso' }
                ]);
            }

            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(data.password, salt);

            const userData = {
                ...data,
                password_hash,
            };


            delete userData.password;

            return await userRepository.create(userData);
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, data) {
        try {

            if (data.password) {
                throw new ValidationError([
                    { field: 'password', message: 'Use a rota específica para alteração de senha' }
                ]);
            }

            const validationErrors = validateUser(data, true);

            if (validationErrors.length > 0) {
                throw new ValidationError(validationErrors);
            }

            if (data.email) {
                const existingUser = await userRepository.findByEmail(data.email);
                if (existingUser && existingUser.id !== id) {
                    throw new ValidationError([
                        { field: 'email', message: 'Este email já está em uso' }
                    ]);
                }
            }

            return await userRepository.update(id, data);
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            return await userRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    async authenticateUser(email, password) {
        try {

            if (!email || !password) {
                throw new ValidationError([
                    { field: !email ? 'email' : 'password', message: 'Campo obrigatório' }
                ]);
            }

            const user = await userRepository.findByEmail(email);

            if (!user) {
                throw new AuthenticationError('Credenciais inválidas');
            }

            const passwordMatch = await bcrypt.compare(password, user.password_hash);

            if (!passwordMatch) {
                throw new AuthenticationError('Credenciais inválidas');
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            const { password_hash, ...userData } = user.toJSON();

            return {
                user: userData,
                token
            };
        } catch (error) {
            throw error;
        }
    }

    async changePassword(userId, currentPassword, newPassword) {
        try {

            if (!currentPassword || !newPassword) {
                throw new ValidationError([
                    { field: !currentPassword ? 'currentPassword' : 'newPassword', message: 'Campo obrigatório' }
                ]);
            }

            const passwordValidation = validatePassword(newPassword);
            if (passwordValidation.length > 0) {
                throw new ValidationError(passwordValidation);
            }


            const user = await userRepository.findById(userId);

            const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);

            if (!passwordMatch) {
                throw new ValidationError([
                    { field: 'currentPassword', message: 'Senha atual incorreta' }
                ]);
            }

            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(newPassword, salt);

            await userRepository.update(userId, { password_hash });

            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();
