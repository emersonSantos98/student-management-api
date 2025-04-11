const validateUser = (data, isUpdate = false) => {
    const errors = [];

    if (!isUpdate) {
        if (!data.name) errors.push({ field: 'name', message: 'Nome é obrigatório' });
        if (!data.email) errors.push({ field: 'email', message: 'Email é obrigatório' });
        if (!data.password) errors.push({ field: 'password', message: 'Senha é obrigatória' });

        if (data.password) {
            const passwordErrors = validatePassword(data.password);
            errors.push(...passwordErrors);
        }

        if (data.password && data.confirmPassword) {
            if (data.password !== data.confirmPassword) {
                errors.push({ field: 'confirmPassword', message: 'As senhas não coincidem' });
            }
        } else if (!data.confirmPassword) {
            errors.push({ field: 'confirmPassword', message: 'Confirmação de senha é obrigatória' });
        }
    } else if (isUpdate && data.password) {
        // Se for atualização e tiver senha, validar a senha e a confirmação
        const passwordErrors = validatePassword(data.password);
        errors.push(...passwordErrors);

        if (data.confirmPassword) {
            if (data.password !== data.confirmPassword) {
                errors.push({ field: 'confirmPassword', message: 'As senhas não coincidem' });
            }
        } else {
            errors.push({ field: 'confirmPassword', message: 'Confirmação de senha é obrigatória' });
        }
    }

    if (data.email && !isValidEmail(data.email)) {
        errors.push({ field: 'email', message: 'Email inválido' });
    }

    if (data.name && (data.name.length < 3 || data.name.length > 255)) {
        errors.push({ field: 'name', message: 'Nome deve ter entre 3 e 255 caracteres' });
    }

    if (data.role && !['admin', 'student'].includes(data.role)) {
        errors.push({ field: 'role', message: 'Papel inválido. Deve ser "admin" ou "student"' });
    }

    return errors;
};

const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push({ field: 'password', message: 'Senha deve ter no mínimo 8 caracteres' });
    }

    if (!/\d/.test(password)) {
        errors.push({ field: 'password', message: 'Senha deve conter pelo menos um número' });
    }

    if (!/[A-Z]/.test(password)) {
        errors.push({ field: 'password', message: 'Senha deve conter pelo menos uma letra maiúscula' });
    }

    if (!/[a-z]/.test(password)) {
        errors.push({ field: 'password', message: 'Senha deve conter pelo menos uma letra minúscula' });
    }

    return errors;
};

const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

module.exports = {
    validateUser,
    validatePassword,
    isValidEmail,
};
