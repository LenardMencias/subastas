const {Router} = require('express');
const controladorvehiculo = require('../controladores/controladorvehiculo');
const {body,query}=require('express-validator');
const modelovehiculo = require('../modelos/vehiculo');
const rutas = Router();

/**
 * @swagger
 * /vehiculo/listar:
 *  get:
 *    summary: Listar vehículos
 *    responses:
 *      200:
 *        description: Lista de vehículos
 *      500:
 *        description: Error al listar vehículos
 */
rutas.get('/listar',controladorvehiculo.Listar);

/**
 * @swagger
 * /vehiculo/buscar:
 *  get:
 *    summary: Buscar vehículo por ID
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        description: ID del vehículo a buscar
 *    responses:
 *      200:
 *        description: Vehículo encontrado
 *      404:
 *        description: Vehículo no encontrado
 *      500:
 *        description: Error al buscar el vehículo
 */
rutas.get('/buscar',controladorvehiculo.Buscar);

/**
 * @swagger
 * /vehiculo/guardar:
 *  post:
 *    summary: Guardar un nuevo vehículo
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              marca:
 *                type: string
 *              modelo:
 *                type: string
 *              anio:
 *                type: integer
 *              vin:
 *                type: string
 *              reporte:
 *                type: string
 *              motor:
 *                type: string
 *              transmision:
 *                type: string
 *              traccion:
 *                type: string
 *              combustible:
 *                type: string
 *              llaves:
 *                type: integer
 *              kilometraje:
 *                type: integer
 *              imagenId:
 *                type: integer
 *              tituloId:
 *                type: integer
 *    responses:
 *      201:
 *        description: Vehículo guardado
 *      400:
 *        description: Errores de validación
 *      500:
 *        description: Error al guardar el vehículo
 */
rutas.post('/guardar',controladorvehiculo.Guardar);

/**
 * @swagger
 * /vehiculo/actualizar:
 *  put:
 *   summary: Actualizar un vehículo existente
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             marca:
 *               type: string
 *             modelo:
 *               type: string
 *             anio:
 *               type: integer
 *             vin:
 *               type: string
 *             reporte:
 *               type: string
 *             motor:
 *               type: string
 *             transmision:
 *               type: string
 *             traccion:
 *               type: string
 *             combustible:
 *               type: string
 *             llaves:
 *               type: integer
 *             kilometraje:
 *               type: integer
 *             imagenId:
 *               type: integer
 *             tituloId:
 *               type: integer
 *   responses:
 *     200:
 *       description: Vehículo actualizado
 *     400:
 *       description: Errores de validación
 *     404:
 *       description: Vehículo no encontrado
 *     500:
 *       description: Error al actualizar el vehículo
 */
rutas.put('/actualizar',controladorvehiculo.Actualizar);

/**
 * @swagger
 * /vehiculo/eliminar:
 *  delete:
 *    summary: Eliminar un vehículo existente
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        description: ID del vehículo a eliminar
 *    responses:
 *      200:
 *        description: Vehículo eliminado
 *      404:
 *        description: Vehículo no encontrado
 *      500:
 *        description: Error al eliminar el vehículo
 */
rutas.delete('/eliminar',controladorvehiculo.Eliminar);

module.exports = rutas;
