const AppError = require('./AppError');

class AuthorizationError extends AppError {
    constructor(message = 'Insufficient permissions') {
        super(message, 403);
    }
}

module.exports = AuthorizationError;
