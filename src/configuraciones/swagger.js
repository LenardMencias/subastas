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
        url: 'http://localhost:3000/api',
        description: 'Servidor local',
      },
    ],
    tags: [
      {
        name: 'Autenticación',
        description: 'Operaciones de autenticación y autorización'
      },
      {
        name: 'Usuario',
        description: 'Gestión de usuarios'
      },
      {
        name: 'Vehiculo',
        description: 'Gestión de vehículos'
      },
      {
        name: 'ImagenVehiculo',
        description: 'Gestión de imágenes de vehículos'
      },
      {
        name: 'TituloVehiculo',
        description: 'Gestión de títulos de vehículos'
      },
      {
        name: 'Rol',
        description: 'Gestión de roles'
      },
      {
        name: 'Permiso',
        description: 'Gestión de permisos'
      },
      {
        name: 'Empleado',
        description: 'Gestión de empleados'
      },
      {
        name: 'CompradorVendedor',
        description: 'Gestión de compradores y vendedores'
      },
      {
        name: 'Apuesta',
        description: 'Gestión de apuestas'
      },
      {
        name: 'CompraDirecta',
        description: 'Gestión de compras directas'
      },
      {
        name: 'Venta',
        description: 'Gestión de ventas'
      },
      {
        name: 'Tiempo',
        description: 'Gestión de tiempos de subasta'
      },
      {
        name: 'Notificacion',
        description: 'Gestión de notificaciones'
      },
      {
        name: 'ReporteVenta',
        description: 'Gestión de reportes de ventas'
      },
      {
        name: 'RevisionCompra',
        description: 'Gestión de revisiones de compras'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            errores: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del usuario'
            },
            nombre: {
              type: 'string',
              description: 'Nombre del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            estado: {
              type: 'boolean',
              description: 'Estado activo/inactivo del usuario'
            }
          }
        },
        Vehiculo: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del vehículo'
            },
            marca: {
              type: 'string',
              description: 'Marca del vehículo'
            },
            modelo: {
              type: 'string',
              description: 'Modelo del vehículo'
            },
            anio: {
              type: 'integer',
              description: 'Año del vehículo'
            },
            vin: {
              type: 'string',
              description: 'Número VIN del vehículo'
            },
            precioCompraDirecta: {
              type: 'number',
              format: 'decimal',
              description: 'Precio de compra directa'
            },
            disponibleCompraDirecta: {
              type: 'boolean',
              description: 'Si está disponible para compra directa'
            }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, '../rutas/*.js')]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
