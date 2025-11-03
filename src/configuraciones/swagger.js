const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
        title: 'API Subastas de Vehículos',
        version: '1.0.0',
        description: 'API para gestión de subastas y ventas de vehículos',
        contact: {
            email: 'soporte@subastas.com',
            name: 'Soporte API'
        }
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Servidor local',
      },
    ]
  },
  apis: [path.join(__dirname, '../rutas/*.js')]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
