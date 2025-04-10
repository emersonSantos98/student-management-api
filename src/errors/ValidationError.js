const AppError = require('./AppError');

class ValidationError extends AppError {
    constructor(errors) {
        super('Erro de validação', 400);
        this.errors = errors;
    }
}
module.exports = ValidationError;
