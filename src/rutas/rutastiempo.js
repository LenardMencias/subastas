const { Router } = require('express');
const controladorTiempo = require('../controladores/controladortiempo');
const { body, query } = require('express-validator');
const rutas = Router();

/**
 * @swagger
 * /tiempo/listar:
 *  get:
 *    summary: Listar todos los tiempos disponibles
 *    tags: [Tiempo]
 *    responses:
 *      200:
 *        description: Lista de tiempos
 *      500:
 *        description: Error al listar los tiempos
 */
rutas.get('/listar', controladorTiempo.Listar);

/**
 * @swagger
 * /tiempo/buscar:
 *  get:
 *    summary: Buscar un tiempo por ID
 *    tags: [Tiempo]
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del tiempo a buscar
 *    responses:
 *      200:
 *        description: Tiempo encontrado
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Tiempo no encontrado
 *      500:
 *        description: Error al buscar el tiempo
 */
rutas.get('/buscar',
    query('id').isInt().withMessage('El ID debe ser un número entero'),
    controladorTiempo.Buscar
);

/**
 * @swagger
 * /tiempo/guardar:
 *  post:
 *    summary: Guardar un nuevo tiempo
 *    tags: [Tiempo]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              duracion:
 *                type: integer
 *                description: Duración en minutos
 *              descripcion:
 *                type: string
 *                description: Descripción del tiempo
 *    responses:
 *      201:
 *        description: Tiempo guardado exitosamente
 *      400:
 *        description: Error de validación
 *      500:
 *        description: Error al guardar el tiempo
 */
rutas.post('/guardar', [
    body('duracion').isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo'),
    body('descripcion').optional().isString().withMessage('La descripción debe ser texto')
], controladorTiempo.Guardar);

/**
 * @swagger
 * /tiempo/actualizar:
 *  put:
 *    summary: Actualizar un tiempo existente
 *    tags: [Tiempo]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *                description: ID del tiempo a actualizar
 *              duracion:
 *                type: integer
 *                description: Nueva duración en minutos
 *              descripcion:
 *                type: string
 *                description: Nueva descripción
 *              activo:
 *                type: boolean
 *                description: Estado del tiempo
 *    responses:
 *      200:
 *        description: Tiempo actualizado exitosamente
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Tiempo no encontrado
 *      500:
 *        description: Error al actualizar el tiempo
 */
rutas.put('/actualizar', [
    body('id').isInt().withMessage('El ID debe ser un número entero'),
    body('duracion').isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo'),
    body('descripcion').optional().isString().withMessage('La descripción debe ser texto'),
    body('activo').isBoolean().withMessage('El estado debe ser verdadero o falso')
], controladorTiempo.Actualizar);

/**
 * @swagger
 * /tiempo/eliminar:
 *  delete:
 *    summary: Eliminar un tiempo
 *    tags: [Tiempo]
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del tiempo a eliminar
 *    responses:
 *      200:
 *        description: Tiempo eliminado exitosamente
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Tiempo no encontrado
 *      500:
 *        description: Error al eliminar el tiempo
 */
rutas.delete('/eliminar',
    query('id').isInt().withMessage('El ID debe ser un número entero'),
    controladorTiempo.Eliminar
);

module.exports = rutas;
