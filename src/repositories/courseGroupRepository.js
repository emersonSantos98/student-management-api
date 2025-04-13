const { CourseGroup } = require('../models');

const { NotFoundError } = require('../errors');

class CourseGroupRepository {
    async findAll(filters = {}, pagination = {}) {
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        try {
            const courseGroups = await CourseGroup.findAndCountAll({
                where: filters,
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });

            return {
                courseGroups: courseGroups.rows,
                total: courseGroups.count,
                totalPages: Math.ceil(courseGroups.count / limit),
                currentPage: page
            };
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            const courseGroup = await CourseGroup.findByPk(id);

            if (!courseGroup) {
                throw new NotFoundError('Turma não encontrada');
            }

            return courseGroup;
        } catch (error) {
            throw error;
        }
    }

    async findByName(name) {
        try {
            return await CourseGroup.findOne({ where: { name } });
        } catch (error) {
            throw error;
        }
    }

    async create(data) {
        try {
            return await CourseGroup.create(data);
        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {
        try {
            const courseGroup = await this.findById(id);

            await courseGroup.update(data);

            return courseGroup;
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const courseGroup = await this.findById(id);

            await courseGroup.destroy();

            return true;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new CourseGroupRepository();
