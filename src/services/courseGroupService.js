const courseGroupRepository = require('../repositories/courseGroupRepository');
const { ValidationError, NotFoundError } = require('../errors');
const { validateCourseGroup } = require('../utils/validateCourseGroup');
class CourseGroupService {
    async getAllCourseGroups(filters, pagination) {
        try {
            return await courseGroupRepository.findAll(filters, pagination);
        } catch (error) {
            throw error;
        }
    }

    async getCourseGroupById(id) {
        try {
            return await courseGroupRepository.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async createCourseGroup(data) {
        try {
            const validationErrors = validateCourseGroup(data);
            if (validationErrors.length > 0) {
                throw new ValidationError(validationErrors);
            }

            const existingCourseGroup = await courseGroupRepository.findByName(data.name);
            if (existingCourseGroup) {
                throw new ValidationError([
                    { field: 'name', message: 'Uma turma com este nome já existe' }
                ]);
            }

            if (new Date(data.start_date) >= new Date(data.end_date)) {
                throw new ValidationError([
                    { field: 'date_range', message: 'A data de início deve ser anterior à data de término' }
                ]);
            }

            return await courseGroupRepository.create(data);
        } catch (error) {
            throw error;
        }
    }

    async updateCourseGroup(id, data) {
        try {
            const validationErrors = validateCourseGroup(data, true);
            if (validationErrors.length > 0) {
                throw new ValidationError(validationErrors);
            }

            const currentCourseGroup = await courseGroupRepository.findById(id);

            if (data.name && data.name !== currentCourseGroup.name) {
                const existingCourseGroup = await courseGroupRepository.findByName(data.name);
                if (existingCourseGroup) {
                    throw new ValidationError([
                        { field: 'name', message: 'Uma turma com este nome já existe' }
                    ]);
                }
            }

            if (data.start_date && data.end_date) {
                if (new Date(data.start_date) >= new Date(data.end_date)) {
                    throw new ValidationError([
                        { field: 'date_range', message: 'A data de início deve ser anterior à data de término' }
                    ]);
                }
            } else if (data.start_date && !data.end_date) {
                if (new Date(data.start_date) >= new Date(currentCourseGroup.end_date)) {
                    throw new ValidationError([
                        { field: 'date_range', message: 'A data de início deve ser anterior à data de término' }
                    ]);
                }
            } else if (!data.start_date && data.end_date) {
                if (new Date(currentCourseGroup.start_date) >= new Date(data.end_date)) {
                    throw new ValidationError([
                        { field: 'date_range', message: 'A data de início deve ser anterior à data de término' }
                    ]);
                }
            }

            return await courseGroupRepository.update(id, data);
        } catch (error) {
            throw error;
        }
    }

    async deleteCourseGroup(id) {
        try {
            return await courseGroupRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new CourseGroupService();
