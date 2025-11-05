// Rutas de Revisión de Compra
const {Router} = require('express');
const { body, param } = require('express-validator');
const ControladorRevisionCompra = require('../controladores/controladorrevisioncompra');
const rutas = Router();

rutas.post('/guardar',
    body('comentarios').isString().notEmpty(),
    body('aprobado').isBoolean(),
    body('vehiculoId').isInt().notEmpty(),
    body('usuarioId').isInt().notEmpty(),
    ControladorRevisionCompra.Guardar
);

rutas.get('/listar', ControladorRevisionCompra.Listar);

rutas.put('/actualizar/:id',
    param('id').isInt().notEmpty(),
    body('comentarios').isString().notEmpty(),
    body('aprobado').isBoolean(),
    ControladorRevisionCompra.Actualizar
);

rutas.delete('/eliminar/:id',
    param('id').isInt().notEmpty(),
    ControladorRevisionCompra.Eliminar
);

module.exports = rutas;