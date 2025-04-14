'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./src/routes/index');
const {errorLogger, errorResponder, invalidPathHandler} = require('./src/middlewares/errorHandler');
const db = require('./src/models');

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';


// Middlewares 🛡️
app.use(helmet());
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', routes);

// Middleware para rotas inválidas
app.use(invalidPathHandler);

// Middleware de tratamento de erros
app.use(errorLogger);
app.use(errorResponder);

db.sequelize.authenticate()
    .then(() => console.log('✅ Database connected!'))
    .catch(err => console.error('❌ Unable to connect to the database:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}/api`));
