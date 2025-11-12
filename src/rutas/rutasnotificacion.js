// Rutas de Notificación
const {Router} = require('express');
const ControladorNotificacion = require('../controladores/controladornotificacion');
const { body, query } = require('express-validator');
const rutas = Router();

/**
 * @swagger
 * /notificaciones/guardar:
 *   post:
 *     summary: Crear una nueva notificación
 *     tags: [Notificacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mensaje
 *               - usuarioId
 *             properties:
 *               mensaje:
 *                 type: string
 *                 description: Contenido del mensaje de la notificación
 *                 example: "Su oferta ha sido superada"
 *               usuarioId:
 *                 type: integer
 *                 description: ID del usuario que recibirá la notificación
 *                 example: 1
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
rutas.post('/guardar',
    body('mensaje').isString().withMessage('El mensaje debe ser una cadena de texto'),
    body('usuarioId').isInt().withMessage('El ID del usuario debe ser un número entero'),
    ControladorNotificacion.Guardar
);

/**
 * @swagger
 * /notificaciones/listar:
 *   get:
 *     summary: Listar todas las notificaciones
 *     tags: [Notificacion]
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   mensaje:
 *                     type: string
 *                   usuarioId:
 *                     type: integer
 *                   fechaCreacion:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Error interno del servidor
 */
rutas.get('/listar', ControladorNotificacion.Listar);

module.exports = rutas;
