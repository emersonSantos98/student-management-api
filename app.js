'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./src/routes/index');
const db = require('./src/models');

const app = express();

// Middlewares 🛡️
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', routes);

db.sequelize.authenticate()
    .then(() => console.log('✅ Database connected!'))
    .catch(err => console.error('❌ Unable to connect to the database:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}/api`));
