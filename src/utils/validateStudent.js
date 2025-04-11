const validateStudent = (data, isUpdate = false) => {
    const errors = [];

    if (!isUpdate) {
        if (!data.name) errors.push({ field: 'name', message: 'Nome é obrigatório' });
        if (!data.email) errors.push({ field: 'email', message: 'Email é obrigatório' });
        if (!data.ra) errors.push({ field: 'ra', message: 'RA é obrigatório' });
        if (!data.cpf) errors.push({ field: 'cpf', message: 'CPF é obrigatório' });
    }


    if (data.email && !isValidEmail(data.email)) {
        errors.push({ field: 'email', message: 'Email inválido' });
    }

    if (data.cpf && !isValidCPF(data.cpf)) {
        errors.push({ field: 'cpf', message: 'CPF inválido' });
    }

    return errors;
};

const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const isValidCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    return true;
};

module.exports = {
    validateStudent,
};
