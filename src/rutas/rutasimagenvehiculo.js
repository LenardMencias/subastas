const { Router } = require('express');
const controladorImagenVehiculo = require('../controladores/controladorimagenvehiculo');
const { body, query } = require('express-validator');
const upload = require('../configuraciones/multer');
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
 *    description: Sube una imagen de vehículo. La imagen se almacena en el servidor y se genera automáticamente la URL.
 *    tags: [ImagenVehiculo]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - imagen
 *              - vehiculoId
 *            properties:
 *              imagen:
 *                type: string
 *                format: binary
 *                description: Archivo de imagen (JPG, PNG, GIF, WebP)
 *                example: imagen_vehiculo.jpg
 *              descripcion:
 *                type: string
 *                description: Descripción opcional de la imagen
 *                example: "Vista frontal del vehículo"
 *              vehiculoId:
 *                type: integer
 *                description: ID del vehículo al que pertenece la imagen
 *                example: 3
 *    responses:
 *      201:
 *        description: Imagen guardada exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                  example: 1
 *                url:
 *                  type: string
 *                  example: "/uploads/vehiculos/imagen_1698765432123.jpg"
 *                descripcion:
 *                  type: string
 *                  example: "Vista frontal del vehículo"
 *                vehiculoId:
 *                  type: integer
 *                  example: 3
 *                createdAt:
 *                  type: string
 *                  format: date-time
 *      400:
 *        description: Error de validación o archivo no válido
 *      500:
 *        description: Error al guardar la imagen
 */
rutas.post('/guardar', 
    upload.single('imagen'),
    [
        body('descripcion').optional(),
        body('vehiculoId').isInt().withMessage('El ID del vehículo debe ser un número entero')
    ], 
    controladorImagenVehiculo.Guardar);

/**
 * @swagger
 * /imagenvehiculo/actualizar:
 *  put:
 *    summary: Actualizar una imagen de vehículo existente
 *    description: Actualiza una imagen existente. Puedes cambiar la imagen, la descripción o ambos.
 *    tags: [ImagenVehiculo]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - id
 *            properties:
 *              id:
 *                type: integer
 *                description: ID de la imagen a actualizar
 *                example: 1
 *              imagen:
 *                type: string
 *                format: binary
 *                description: Nuevo archivo de imagen (opcional - JPG, PNG, GIF, WebP)
 *                example: nueva_imagen_vehiculo.jpg
 *              descripcion:
 *                type: string
 *                description: Nueva descripción de la imagen (opcional)
 *                example: "Vista lateral actualizada del vehículo"
 *    responses:
 *      200:
 *        description: Imagen actualizada exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                  example: 1
 *                url:
 *                  type: string
 *                  example: "/uploads/vehiculos/imagen_1698765432456.jpg"
 *                descripcion:
 *                  type: string
 *                  example: "Vista lateral actualizada del vehículo"
 *                vehiculoId:
 *                  type: integer
 *                  example: 3
 *                updatedAt:
 *                  type: string
 *                  format: date-time
 *      400:
 *        description: Error de validación o archivo no válido
 *      404:
 *        description: Imagen no encontrada
 *      500:
 *        description: Error al actualizar la imagen
 */
rutas.put('/actualizar', 
    upload.single('imagen'),
    [
        body('id').isInt().withMessage('El ID debe ser un número entero'),
        body('descripcion').optional()
    ], 
    controladorImagenVehiculo.Actualizar);

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
