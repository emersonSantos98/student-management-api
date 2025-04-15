const { CourseGroup, Enrollment, Student } = require('../models');

const { NotFoundError } = require('../errors');

class CourseGroupRepository {
    async findAll(filters = {}, pagination = {}) {
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        try {
            const courseGroups = await CourseGroup.findAndCountAll({
                where: filters,
                include: [
                    {
                        model: Enrollment,
                        as: 'enrollments',
                        attributes: ['id', 'status', 'created_at', 'updated_at'],
                        include: [
                            {
                                model: Student,
                                as: 'student',
                                attributes: ['id', 'name', 'email', 'created_at', 'updated_at']
                            }
                        ]
                    }
                ],
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });

            const courseGroupsWithActiveCount = courseGroups.rows.map(group => {
                const activeStudentsCount = group.enrollments.filter(
                    enrollment => enrollment.status === 'active'
                ).length;

                return {
                    ...group.toJSON(),
                    activeStudentsCount
                };
            });

            return {
                courseGroups: courseGroupsWithActiveCount,
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
            const courseGroup = await CourseGroup.findByPk(id, {
                include: [
                    {
                        model: Enrollment,
                        as: 'enrollments',
                        attributes: ['id', 'status', 'created_at', 'updated_at'],
                        include: [
                            {
                                model: Student,
                                as: 'student',
                                attributes: ['id', 'name', 'email', 'created_at', 'updated_at']
                            }
                        ]
                    }
                ]
            });

            if (!courseGroup) {
                throw new NotFoundError('Turma não encontrada');
            }

            const courseGroupWithActiveCount = {
                ...courseGroup.toJSON(),
                activeStudentsCount: courseGroup.enrollments.filter(
                    enrollment => enrollment.status === 'active'
                ).length
            };

            return courseGroupWithActiveCount;
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
            const courseGroup = await CourseGroup.findByPk(id);

            if (!courseGroup) {
                throw new NotFoundError('Turma não encontrada');
            }

            await courseGroup.update(data);

            const updatedCourseGroup = await this.findById(id);
            return updatedCourseGroup;
        } catch (error) {
            console.log('Error updating course group:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const courseGroup = await CourseGroup.findByPk(id);

            if (!courseGroup) {
                throw new NotFoundError('Turma não encontrada');
            }

            await courseGroup.destroy();
            return true;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new CourseGroupRepository();
