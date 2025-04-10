class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} não encontrado(a)`, 404);
    }
}

module.exports = NotFoundError;
