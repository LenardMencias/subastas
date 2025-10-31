const { Router } = require('express');
const controladorApuesta = require('../controladores/controladorapuesta');
const { body, query } = require('express-validator');
const rutas = Router();

/**
 * @swagger
 * /apuesta/listar:
 *  get:
 *    summary: Listar todas las apuestas
 *    tags: [Apuesta]
 *    responses:
 *      200:
 *        description: Lista de apuestas con sus relaciones
 *      500:
 *        description: Error al listar las apuestas
 */
rutas.get('/listar', controladorApuesta.Listar);

/**
 * @swagger
 * /apuesta/listarvehiculo:
 *  get:
 *    summary: Listar apuestas de un vehículo específico
 *    tags: [Apuesta]
 *    parameters:
 *      - in: query
 *        name: vehiculoId
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del vehículo
 *    responses:
 *      200:
 *        description: Lista de apuestas del vehículo
 *      400:
 *        description: Error de validación
 *      500:
 *        description: Error al listar las apuestas
 */
rutas.get('/listarvehiculo',
    query('vehiculoId').isInt().withMessage('El ID del vehículo debe ser un número entero'),
    controladorApuesta.ListarPorVehiculo
);

/**
 * @swagger
 * /apuesta/listarusuario:
 *  get:
 *    summary: Listar apuestas de un usuario específico
 *    tags: [Apuesta]
 *    parameters:
 *      - in: query
 *        name: usuarioId
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del usuario
 *    responses:
 *      200:
 *        description: Lista de apuestas del usuario
 *      400:
 *        description: Error de validación
 *      500:
 *        description: Error al listar las apuestas
 */
rutas.get('/listarusuario',
    query('usuarioId').isInt().withMessage('El ID del usuario debe ser un número entero'),
    controladorApuesta.ListarPorUsuario
);

/**
 * @swagger
 * /apuesta/guardar:
 *  post:
 *    summary: Crear una nueva apuesta
 *    tags: [Apuesta]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              monto:
 *                type: number
 *                description: Monto de la apuesta
 *              usuarioId:
 *                type: integer
 *                description: ID del usuario que realiza la apuesta
 *              vehiculoId:
 *                type: integer
 *                description: ID del vehículo por el que se apuesta
 *              tiempoId:
 *                type: integer
 *                description: ID del tiempo de duración (opcional, por defecto 5 horas)
 *    responses:
 *      201:
 *        description: Apuesta creada exitosamente
 *      400:
 *        description: Error de validación
 *      500:
 *        description: Error al crear la apuesta
 */
rutas.post('/guardar', [
    body('monto').isFloat({ min: 0 }).withMessage('El monto debe ser un número positivo'),
    body('usuarioId').isInt().withMessage('El ID del usuario debe ser un número entero'),
    body('vehiculoId').isInt().withMessage('El ID del vehículo debe ser un número entero'),
    body('tiempoId').optional().isInt().withMessage('El ID del tiempo debe ser un número entero')
], controladorApuesta.Guardar);

/**
 * @swagger
 * /apuesta/actualizar:
 *  put:
 *    summary: Actualizar el estado de una apuesta
 *    tags: [Apuesta]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *                description: ID de la apuesta
 *              estado:
 *                type: string
 *                enum: [activa, finalizada, cancelada]
 *                description: Nuevo estado de la apuesta
 *              ganador:
 *                type: boolean
 *                description: Indica si la apuesta es ganadora
 *    responses:
 *      200:
 *        description: Apuesta actualizada exitosamente
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Apuesta no encontrada
 *      500:
 *        description: Error al actualizar la apuesta
 */
rutas.put('/actualizar', [
    body('id').isInt().withMessage('El ID debe ser un número entero'),
    body('estado').isIn(['activa', 'finalizada', 'cancelada']).withMessage('Estado inválido'),
    body('ganador').isBoolean().withMessage('El ganador debe ser verdadero o falso')
], controladorApuesta.Actualizar);

/**
 * @swagger
 * /apuesta/finalizar:
 *  put:
 *    summary: Finalizar una apuesta activa
 *    tags: [Apuesta]
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID de la apuesta a finalizar
 *    responses:
 *      200:
 *        description: Apuesta finalizada exitosamente
 *      400:
 *        description: Error de validación o apuesta no activa
 *      404:
 *        description: Apuesta no encontrada
 *      500:
 *        description: Error al finalizar la apuesta
 */
rutas.put('/finalizar',
    query('id').isInt().withMessage('El ID debe ser un número entero'),
    controladorApuesta.FinalizarApuesta
);

module.exports = rutas;
