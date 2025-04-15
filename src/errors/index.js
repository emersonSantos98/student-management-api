const AppError = require('./AppError');
const NotFoundError = require('./NotFoundError');
const ValidationError = require('./ValidationError');
const AuthenticationError = require('./AuthenticationError');
const AuthorizationError = require('./AuthorizationError');
const DatabaseError = require('./DatabaseError');

module.exports = {
    AppError,
    NotFoundError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    DatabaseError
};
