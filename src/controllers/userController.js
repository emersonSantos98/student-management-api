const userService = require('../services/userService');

class UserController {
    async register(req, res, next) {
        try {
            const userData = req.body;

            // Apenas admins podem criar outros usuários com papel de admin
            if (userData.role === 'admin' && req.userRole !== 'admin') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Apenas administradores podem criar outros administradores'
                });
            }

            const user = await userService.createUser(userData);

            const { password_hash, ...userResponse } = user.toJSON();

            return res.status(201).json({
                object: 'user',
                status: 'success',
                message: 'Usuário criado com sucesso',
                data: userResponse
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const result = await userService.authenticateUser(email, password);

            return res.json({
                object: 'user',
                status: 'success',
                message: 'Login bem-sucedido',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const userId = req.userId;
            const user = await userService.getUserById(userId);

            const { password_hash, ...userResponse } = user.toJSON();
            return res.json({
                object: 'user',
                status: 'success',
                message: 'Perfil do usuário',
                data: userResponse
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.userId;
            const userData = req.body;

            // Impedir que o usuário altere seu próprio papel
            delete userData.role;

            const user = await userService.updateUser(userId, userData);

            const { password_hash, ...userResponse } = user.toJSON();

            return res.json({
                object: 'user',
                status: 'success',
                message: 'Perfil atualizado com sucesso',
                data: userResponse
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const { page, limit, name, email, role } = req.query;

            // Constrói filtros
            const filters = {};
            if (name) filters.name = { [Op.like]: `%${name}%` };
            if (email) filters.email = email;
            if (role) filters.role = role;

            // Constrói paginação
            const pagination = {
                page: parseInt(page, 10) || 1,
                limit: parseInt(limit, 10) || 10
            };

            const result = await userService.getAllUsers(filters, pagination);

            const sanitizedUsers = result.users.map(user => {
                const { password_hash, ...userData } = user.toJSON();
                return userData;
            });

            return res.json({
                object: 'users',
                status: 'success',
                message: 'Lista de usuários',
                data: {
                    users: sanitizedUsers,
                    total: result.total,
                    totalPages: result.totalPages,
                    currentPage: result.currentPage
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);

            const { password_hash, ...userResponse } = user.toJSON();

            return res.json({
                object: 'user',
                status: 'success',
                message: 'Usuário encontrado',
                data: userResponse
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const userData = req.body;
            // Impedir que o usuário altere seu próprio papel
            const userToUpdate = await userService.getUserById(id);

            // Se o usuário a ser atualizado é admin e o requisitante não é admin
            if (userToUpdate.role === 'admin' && req.userRole !== 'admin') {
                return res.status(403).json({
                    object: 'user',
                    status: 'error',
                    message: 'Apenas administradores podem alterar outros administradores'
                });
            }

            const user = await userService.updateUser(id, userData);

            const { password_hash, ...userResponse } = user.toJSON();

            return res.json({
                object: 'user',
                status: 'success',
                message: 'Usuário atualizado com sucesso',
                data: userResponse
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;

            // Impedir que o usuário delete a si mesmo
            if (id === req.userId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Você não pode remover seu próprio usuário'
                });
            }

            // Verifica se está tentando excluir um admin
            const userToDelete = await userService.getUserById(id);

            // Se o usuário a ser excluído é admin e o requisitante não é admin
            if (userToDelete.role === 'admin' && req.userRole !== 'admin') {
                return res.status(403).json({
                    object: 'user',
                    status: 'error',
                    message: 'Apenas administradores podem remover outros administradores'
                });
            }

            await userService.deleteUser(id);

            return res.status(204).json({
                object: 'user',
                status: 'success',
                message: 'Usuário removido com sucesso'
            });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const userId = req.userId;
            const { currentPassword, newPassword } = req.body;

            await userService.changePassword(userId, currentPassword, newPassword);

            return res.json({
                status: 'success',
                message: 'Senha alterada com sucesso'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
