const {Router} = require('express');
const controladorempleado = require('../controladores/controladorempleado');
const {body,query}=require('express-validator');
const modeloempleado = require('../modelos/empleado');
const rutas = Router();

/**
 * @swagger
 * /empleados/listar:
 *  get:
 *    summary: Listar empleados
 *    responses:
 *      200:
 *        description: Lista de empleados
 *      500:
 *        description: Error al listar empleados
 */
rutas.get('/listar',controladorempleado.Listar);

/**
 * @swagger
 * /empleados/buscar:
 *  get:
 *    summary: Buscar empleado por ID
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        description: ID del empleado a buscar
 *    responses:
 *      200:
 *        description: Empleado encontrado
 *      404:
 *        description: Empleado no encontrado
 *      500:
 *        description: Error al buscar el empleado
 */
rutas.get('/buscar',controladorempleado.Buscar);

/**
 * @swagger
 * /empleados/guardar:
 *  post:
 *    summary: Guardar un nuevo empleado
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              nombre:
 *                type: string
 *              direccion:
 *                type: string
 *              telefono:
 *                type: string
 *              usuarioId:
 *                type: integer
 *    responses:
 *      201:
 *        description: Empleado guardado
 *      400:
 *        description: Errores de validación
 *      500:
 *        description: Error al guardar el empleado
 */
rutas.post('/guardar',controladorempleado.Guardar);

/**
 * @swagger
 * /empleados/actualizar:
 *  put:
 *   summary: Actualizar un empleado existente
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             nombre:
 *               type: string
 *             direccion:
 *               type: string
 *             telefono:
 *               type: string
 *   responses:
 *     200:
 *       description: Empleado actualizado
 *     400:
 *       description: Errores de validación
 *     404:
 *       description: Empleado no encontrado
 *     500:
 *       description: Error al actualizar el empleado
 */
rutas.put('/actualizar',controladorempleado.Actualizar);

/**
 * @swagger
 * /empleados/eliminar:
 *  delete:
 *    summary: Eliminar un empleado existente
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        description: ID del empleado a eliminar
 *    responses:
 *      200:
 *        description: Empleado eliminado
 *      404:
 *        description: Empleado no encontrado
 *      500:
 *        description: Error al eliminar el empleado
 */
rutas.delete('/eliminar',controladorempleado.Eliminar);

module.exports = rutas;
