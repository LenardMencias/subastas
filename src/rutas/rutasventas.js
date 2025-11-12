const {Router} = require('express');
const controladorventas = require('../controladores/controladorventas');
const {body,query}=require('express-validator');
const modeloventas = require('../modelos/ventas');
const rutas = Router();

/**
 * @swagger
 * /venta/listar:
 *  get:
 *    summary: Listar ventas
 *    tags: [Venta]
 *    responses:
 *      200:
 *        description: Lista de ventas
 *      500:
 *        description: Error al listar ventas
 */
rutas.get('/listar',controladorventas.Listar);

/**
 * @swagger
 * /venta/buscar:
 *  get:
 *    summary: Buscar venta por ID
 *    tags: [Venta]
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        description: ID de la venta a buscar
 *    responses:
 *      200:
 *        description: Venta encontrada
 *      404:
 *        description: Venta no encontrada
 *      500:
 *        description: Error al buscar la venta
 */
rutas.get('/buscar',controladorventas.Buscar);

/**
 * @swagger
 * /venta/estadisticas:
 *  get:
 *    summary: Obtener estadísticas de ventas
 *    tags: [Venta]
 *    responses:
 *      200:
 *        description: Estadísticas de ventas
 *      500:
 *        description: Error al obtener estadísticas
 */
rutas.get('/estadisticas',controladorventas.Estadisticas);

/**
 * @swagger
 * /venta/guardar:
 *  post:
 *    summary: Guardar una nueva venta
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              tipo:
 *                type: string
 *                enum: [apuesta, compra_directa]
 *              montoBase:
 *                type: number
 *              vehiculoId:
 *                type: integer
 *              tiempoId:
 *                type: integer
 *    responses:
 *      201:
 *        description: Venta guardada
 *      400:
 *        description: Errores de validación
 *      500:
 *        description: Error al guardar la venta
 */
rutas.post('/guardar',controladorventas.Guardar);

/**
 * @swagger
 * /venta/agregarparticipante:
 *  post:
 *    summary: Agregar participante a una venta
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              ventaId:
 *                type: integer
 *              compradorVendedorId:
 *                type: integer
 *              montoOferta:
 *                type: number
 *              comentario:
 *                type: string
 *    responses:
 *      201:
 *        description: Participante agregado
 *      400:
 *        description: Errores de validación
 *      500:
 *        description: Error al agregar participante
 */
rutas.post('/agregarparticipante',controladorventas.AgregarParticipante);

/**
 * @swagger
 * /venta/cerrar:
 *  put:
 *   summary: Cerrar una venta y seleccionar ganador
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             ganadorId:
 *               type: integer
 *   responses:
 *     200:
 *       description: Venta cerrada
 *     400:
 *       description: Errores de validación
 *     404:
 *       description: Venta no encontrada
 *     500:
 *       description: Error al cerrar la venta
 */
rutas.put('/cerrar',controladorventas.CerrarVenta);

/**
 * @swagger
 * /venta/eliminar:
 *  delete:
 *    summary: Cancelar una venta
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        description: ID de la venta a cancelar
 *    responses:
 *      200:
 *        description: Venta cancelada
 *      404:
 *        description: Venta no encontrada
 *      500:
 *        description: Error al cancelar la venta
 */
rutas.delete('/eliminar',controladorventas.Cancelar);

module.exports = rutas;
