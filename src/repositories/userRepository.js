const { User } = require('../models');
const { NotFoundError, DatabaseError } = require('../errors');

class UserRepository {

    async findAll(filters = {}, pagination = {}) {
        try {
            const { page = 1, limit = 10 } = pagination;
            const offset = (page - 1) * limit;

            const users = await User.findAndCountAll({
                where: filters,
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });

            return {
                users: users.rows,
                total: users.count,
                totalPages: Math.ceil(users.count / limit),
                currentPage: page
            };
        } catch (error) {
            throw new DatabaseError(`Erro ao buscar usuários: ${error.message}`);
        }
    }

    async findById(userId) {
        try {
            const user = await User.findByPk(userId);

            if (!user) {
                throw new NotFoundError('Usuário');
            }

            return user;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }

            throw new DatabaseError(`Erro ao buscar usuário: ${error.message}`);
        }
    }

    async findByEmail(email) {
        try {
            return await User.findOne({ where: { email } });
        } catch (error) {
            throw new DatabaseError(`Erro ao buscar usuário por email: ${error.message}`);
        }
    }

    async create(data) {
        try {
            return await User.create(data);
        } catch (error) {
            throw new DatabaseError(`Erro ao criar usuário: ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            const user = await this.findById(id);

            await user.update(data);

            return user;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }

            throw new DatabaseError(`Erro ao atualizar usuário: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const user = await this.findById(id);

            await user.destroy();

            return true;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }

            throw new DatabaseError(`Erro ao remover usuário: ${error.message}`);
        }
    }
}

module.exports = new UserRepository();
