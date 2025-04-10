const { AppError } = require('../errors');

exports.errorLogger = (error, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ${error.name}: ${error.message}`);

    if (process.env.NODE_ENV === 'development') {
        console.error(error.stack);
    }

    next(error);
};

exports.errorResponder = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    const response = {
        status: 'error',
        message: error.message || 'Erro interno no servidor',
    };

    if (error.errors) {
        response.errors = error.errors;
    }

    if (statusCode === 500 && process.env.NODE_ENV === 'production') {
        response.message = 'Erro interno no servidor';
    }

    res.status(statusCode).json(response);
};

exports.invalidPathHandler = (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Rota não encontrada: ${req.originalUrl}`
    });
};
