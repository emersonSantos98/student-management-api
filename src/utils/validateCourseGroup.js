const validateCourseGroup = (data, isUpdate = false) =>  {
    const errors = [];

    if (!isUpdate) {

        if (!data.name) {
            errors.push({ field: 'name', message: 'O nome da turma é obrigatório' });
        }
        if (!data.start_date) {
            errors.push({ field: 'start_date', message: 'A data de início é obrigatória' });
        }
        if (!data.end_date) {
            errors.push({ field: 'end_date', message: 'A data de término é obrigatória' });
        }
    }

    if (data.name && (data.name.length < 3 || data.name.length > 100)) {
        errors.push({ field: 'name', message: 'O nome da turma deve ter entre 3 e 100 caracteres' });
    }

    if (data.max_students !== undefined && data.max_students !== null) {
        if (isNaN(data.max_students) || data.max_students < 0) {
            errors.push({ field: 'max_students', message: 'O número máximo de estudantes deve ser um número não negativo' });
        }
    }

    if (data.start_date && !isValidDate(data.start_date)) {
        errors.push({ field: 'start_date', message: 'A data de início é inválida' });
    }

    if (data.end_date && !isValidDate(data.end_date)) {
        errors.push({ field: 'end_date', message: 'A data de término é inválida' });
    }

    return errors;
}

const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}



module.exports = {
    validateCourseGroup,
};
