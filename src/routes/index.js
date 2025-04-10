'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API REST - Desafio Técnico +A Educação',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

module.exports = router;
