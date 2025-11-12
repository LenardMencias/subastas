// Rutas de Revisión de Compra
const {Router} = require('express');
const { body, param } = require('express-validator');
const ControladorRevisionCompra = require('../controladores/controladorrevisioncompra');
const rutas = Router();

/**
 * @swagger
 * /revisioncompra/guardar:
 *  post:
 *    summary: Guardar una nueva revisión de compra
 *    tags: [RevisionCompra]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - comentarios
 *              - aprobado
 *              - vehiculoId
 *              - usuarioId
 *            properties:
 *              comentarios:
 *                type: string
 *                description: Comentarios sobre la revisión
 *                example: "Vehículo en excelente estado, listo para venta"
 *              aprobado:
 *                type: boolean
 *                description: Indica si la revisión fue aprobada
 *                example: true
 *              vehiculoId:
 *                type: integer
 *                description: ID del vehículo revisado
 *                example: 1
 *              usuarioId:
 *                type: integer
 *                description: ID del usuario que realiza la revisión
 *                example: 1
 *    responses:
 *      201:
 *        description: Revisión de compra creada exitosamente
 *      400:
 *        description: Error de validación
 *      500:
 *        description: Error al crear la revisión
 */
rutas.post('/guardar',
    body('comentarios').isString().notEmpty(),
    body('aprobado').isBoolean(),
    body('vehiculoId').isInt().notEmpty(),
    body('usuarioId').isInt().notEmpty(),
    ControladorRevisionCompra.Guardar
);

/**
 * @swagger
 * /revisioncompra/listar:
 *  get:
 *    summary: Listar todas las revisiones de compra
 *    tags: [RevisionCompra]
 *    responses:
 *      200:
 *        description: Lista de revisiones de compra
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                  comentarios:
 *                    type: string
 *                  aprobado:
 *                    type: boolean
 *                  vehiculoId:
 *                    type: integer
 *                  usuarioId:
 *                    type: integer
 *      500:
 *        description: Error al listar las revisiones
 */
rutas.get('/listar', ControladorRevisionCompra.Listar);

/**
 * @swagger
 * /revisioncompra/actualizar/{id}:
 *  put:
 *    summary: Actualizar una revisión de compra existente
 *    tags: [RevisionCompra]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID de la revisión a actualizar
 *        example: 1
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - comentarios
 *              - aprobado
 *            properties:
 *              comentarios:
 *                type: string
 *                description: Nuevos comentarios
 *                example: "Revisión actualizada: vehículo requiere ajustes menores"
 *              aprobado:
 *                type: boolean
 *                description: Nuevo estado de aprobación
 *                example: false
 *    responses:
 *      200:
 *        description: Revisión actualizada exitosamente
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Revisión no encontrada
 *      500:
 *        description: Error al actualizar la revisión
 */
rutas.put('/actualizar/:id',
    param('id').isInt().notEmpty(),
    body('comentarios').isString().notEmpty(),
    body('aprobado').isBoolean(),
    ControladorRevisionCompra.Actualizar
);

/**
 * @swagger
 * /revisioncompra/eliminar/{id}:
 *  delete:
 *    summary: Eliminar una revisión de compra
 *    tags: [RevisionCompra]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID de la revisión a eliminar
 *        example: 1
 *    responses:
 *      200:
 *        description: Revisión eliminada exitosamente
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Revisión no encontrada
 *      500:
 *        description: Error al eliminar la revisión
 */
rutas.delete('/eliminar/:id',
    param('id').isInt().notEmpty(),
    ControladorRevisionCompra.Eliminar
);

module.exports = rutas;