const { Router } = require('express');
const controladorCompraDirecta = require('../controladores/controladorcompradirecta');
const { body, query } = require('express-validator');
const rutas = Router();

/**
 * @swagger
 * /compradirecta/listar:
 *  get:
 *    summary: Listar todas las compras directas
 *    tags: [CompraDirecta]
 *    responses:
 *      200:
 *        description: Lista de compras directas con sus relaciones
 *      500:
 *        description: Error al listar las compras
 */
rutas.get('/listar', controladorCompraDirecta.Listar);

/**
 * @swagger
 * /compradirecta/listarusuario:
 *  get:
 *    summary: Listar compras directas de un usuario específico
 *    tags: [CompraDirecta]
 *    parameters:
 *      - in: query
 *        name: usuarioId
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del usuario
 *    responses:
 *      200:
 *        description: Lista de compras del usuario
 *      400:
 *        description: Error de validación
 *      500:
 *        description: Error al listar las compras
 */
rutas.get('/listarusuario',
    query('usuarioId').isInt().withMessage('El ID del usuario debe ser un número entero'),
    controladorCompraDirecta.ListarPorUsuario
);

/**
 * @swagger
 * /compradirecta/guardar:
 *  post:
 *    summary: Realizar una nueva compra directa
 *    tags: [CompraDirecta]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              usuarioId:
 *                type: integer
 *                description: ID del usuario que realiza la compra
 *              vehiculoId:
 *                type: integer
 *                description: ID del vehículo a comprar
 *    responses:
 *      201:
 *        description: Compra directa creada exitosamente
 *      400:
 *        description: Error de validación o vehículo no disponible
 *      404:
 *        description: Vehículo no encontrado
 *      500:
 *        description: Error al procesar la compra
 */
rutas.post('/guardar', [
    body('usuarioId').isInt().withMessage('El ID del usuario debe ser un número entero'),
    body('vehiculoId').isInt().withMessage('El ID del vehículo debe ser un número entero')
], controladorCompraDirecta.Guardar);

/**
 * @swagger
 * /compradirecta/actualizarestado:
 *  put:
 *    summary: Actualizar el estado de una compra directa
 *    tags: [CompraDirecta]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *                description: ID de la compra
 *              estado:
 *                type: string
 *                enum: [pendiente, completada, cancelada]
 *                description: Nuevo estado de la compra
 *              comprobantePago:
 *                type: string
 *                description: URL o identificador del comprobante de pago
 *    responses:
 *      200:
 *        description: Estado actualizado exitosamente
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Compra no encontrada
 *      500:
 *        description: Error al actualizar el estado
 */
rutas.put('/actualizarestado', [
    body('id').isInt().withMessage('El ID debe ser un número entero'),
    body('estado').isIn(['pendiente', 'completada', 'cancelada']).withMessage('Estado inválido'),
    body('comprobantePago').optional().isString().withMessage('El comprobante debe ser una cadena de texto')
], controladorCompraDirecta.ActualizarEstado);

/**
 * @swagger
 * /compradirecta/cancelar:
 *  delete:
 *    summary: Cancelar una compra directa
 *    tags: [CompraDirecta]
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID de la compra a cancelar
 *    responses:
 *      200:
 *        description: Compra cancelada exitosamente
 *      400:
 *        description: Error de validación o compra no cancelable
 *      404:
 *        description: Compra no encontrada
 *      500:
 *        description: Error al cancelar la compra
 */
rutas.delete('/cancelar',
    query('id').isInt().withMessage('El ID debe ser un número entero'),
    controladorCompraDirecta.Cancelar
);

module.exports = rutas;