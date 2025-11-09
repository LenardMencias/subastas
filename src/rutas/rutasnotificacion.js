// Rutas de Notificación
const {Router} = require('express');
const ControladorNotificacion = require('../controladores/controladornotificacion');
const { body, query } = require('express-validator');
const rutas = Router();
rutas.post('/guardar',
    body('mensaje').isString().withMessage('El mensaje debe ser una cadena de texto'),
    body('usuarioId').isInt().withMessage('El ID del usuario debe ser un número entero'),
    ControladorNotificacion.Guardar
);

rutas.get('/listar', ControladorNotificacion.Listar);

module.exports = rutas;
