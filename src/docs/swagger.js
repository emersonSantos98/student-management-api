const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Student Management API',
            version: '1.0.0',
            description: 'API para gerenciamento de estudantes e cursos',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Servidor local',
            },
            {
                url: 'https://student-management-api-production-8612.up.railway.app/api',
                description: 'Produção',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
            },
        },
        security: [{
            BearerAuth: []
        }],
    },
    apis: ['./src/routes/*.js'], // Caminho para seus arquivos de rotas
};

const specs = swaggerJsdoc(options);

module.exports = specs;
