const { Router } = require('express');
const controladorImagenVehiculo = require('../controladores/controladorimagenvehiculo');
const { body, query } = require('express-validator');
const rutas = Router();

/**
 * @swagger
 * /imagenvehiculo/listar:
 *  get:
 *    summary: Listar todas las imágenes de vehículos
 *    tags: [ImagenVehiculo]
 *    responses:
 *      200:
 *        description: Lista de imágenes de vehículos
 *      500:
 *        description: Error al listar las imágenes
 */
rutas.get('/listar', controladorImagenVehiculo.Listar);

/**
 * @swagger
 * /imagenvehiculo/listarvehiculo:
 *  get:
 *    summary: Listar imágenes de un vehículo específico
 *    tags: [ImagenVehiculo]
 *    parameters:
 *      - in: query
 *        name: vehiculoId
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del vehículo
 *    responses:
 *      200:
 *        description: Lista de imágenes del vehículo
 *      400:
 *        description: Error de validación
 *      500:
 *        description: Error al listar las imágenes
 */
rutas.get('/listarvehiculo', 
    query('vehiculoId').isInt().withMessage('El ID del vehículo debe ser un número entero'),
    controladorImagenVehiculo.ListarPorVehiculo
);

/**
 * @swagger
 * /imagenvehiculo/guardar:
 *  post:
 *    summary: Guardar una nueva imagen de vehículo
 *    tags: [ImagenVehiculo]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              url:
 *                type: string
 *                description: URL de la imagen
 *              descripcion:
 *                type: string
 *                description: Descripción de la imagen
 *              vehiculoId:
 *                type: integer
 *                description: ID del vehículo al que pertenece la imagen
 *    responses:
 *      201:
 *        description: Imagen guardada exitosamente
 *      400:
 *        description: Error de validación
 *      500:
 *        description: Error al guardar la imagen
 */
rutas.post('/guardar', [
    body('url').notEmpty().withMessage('La URL es requerida')
        .isURL().withMessage('Debe ser una URL válida'),
    body('descripcion').optional(),
    body('vehiculoId').isInt().withMessage('El ID del vehículo debe ser un número entero')
], controladorImagenVehiculo.Guardar);

/**
 * @swagger
 * /imagenvehiculo/actualizar:
 *  put:
 *    summary: Actualizar una imagen de vehículo existente
 *    tags: [ImagenVehiculo]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *                description: ID de la imagen a actualizar
 *              url:
 *                type: string
 *                description: Nueva URL de la imagen
 *              descripcion:
 *                type: string
 *                description: Nueva descripción de la imagen
 *    responses:
 *      200:
 *        description: Imagen actualizada exitosamente
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Imagen no encontrada
 *      500:
 *        description: Error al actualizar la imagen
 */
rutas.put('/actualizar', [
    body('id').isInt().withMessage('El ID debe ser un número entero'),
    body('url').notEmpty().withMessage('La URL es requerida')
        .isURL().withMessage('Debe ser una URL válida'),
    body('descripcion').optional()
], controladorImagenVehiculo.Actualizar);

/**
 * @swagger
 * /imagenvehiculo/eliminar:
 *  delete:
 *    summary: Eliminar una imagen de vehículo
 *    tags: [ImagenVehiculo]
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID de la imagen a eliminar
 *    responses:
 *      200:
 *        description: Imagen eliminada exitosamente
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Imagen no encontrada
 *      500:
 *        description: Error al eliminar la imagen
 */
rutas.delete('/eliminar',
    query('id').isInt().withMessage('El ID debe ser un número entero'),
    controladorImagenVehiculo.Eliminar
);

module.exports = rutas;
