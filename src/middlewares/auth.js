const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AuthenticationError, AuthorizationError } = require('../errors');

const authMiddleware = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new AuthenticationError('Token não fornecido');
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            throw new AuthenticationError('Erro no formato do token');
        }

        const [scheme, token] = parts;
        if (!/^Bearer$/i.test(scheme)) {
            throw new AuthenticationError('Formato de token inválido');
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                throw new AuthenticationError('Token inválido');
            }

            const user = await User.findByPk(decoded.id);
            if (!user) {
                throw new AuthenticationError('Usuário não encontrado');
            }

            req.userId = decoded.id;
            req.userRole = user.role;

            return next();
        });
    } catch (error) {
        next(error);
    }
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return next(new AuthorizationError('Acesso permitido apenas para administradores'));
    }

    return next();
};

module.exports = {
    authMiddleware,
    isAdmin
};
