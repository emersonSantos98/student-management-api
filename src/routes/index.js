const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const studentRoutes = require('./studentRoutes');

router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API REST - Desafio Técnico +A Educação',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Rotas de usuários
router.use('/users', userRoutes);
router.use('/students', studentRoutes);
module.exports = router;

