const {Router} = require('express');
const controladorpermisos = require('../controladores/controladorpermisos');
const {body,query}=require('express-validator');
const modelopermisos = require('../modelos/permisos');
const rutas = Router();

/**
 * @swagger
 * /permisos/listar:
 *  get:
 *    summary: Listar permisos
 *    tags: [Permiso]
 *    responses:
 *      200:
 *        description: Lista de permisos
 *      500:
 *        description: Error al listar permisos
 */
rutas.get('/listar',controladorpermisos.Listar);

/**
 * @swagger
 * /permisos/buscar:
 *  get:
 *    summary: Buscar permiso por ID
 *    tags: [Permiso]
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del permiso a buscar
 *    responses:
 *      200:
 *        description: Permiso encontrado
 *      404:
 *        description: Permiso no encontrado
 *      500:
 *        description: Error al buscar el permiso
 */
rutas.get('/buscar',controladorpermisos.Buscar);

/**
 * @swagger
 * /permisos/guardar:
 *  post:
 *    summary: Guardar un nuevo permiso
 *    tags: [Permiso]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - clave
 *              - nombre
 *            properties:
 *              clave:
 *                type: string
 *                example: "vehiculo.create"
 *              nombre:
 *                type: string
 *                example: "Crear Vehículos"
 *              descripcion:
 *                type: string
 *                example: "Permite crear nuevos vehículos"
 *    responses:
 *      201:
 *        description: Permiso guardado
 *      400:
 *        description: Errores de validación
 *      500:
 *        description: Error al guardar el permiso
 */
rutas.post('/guardar',controladorpermisos.Guardar);

/**
 * @swagger
 * /permisos/actualizar:
 *  put:
 *   summary: Actualizar un permiso existente
 *   tags: [Permiso]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             clave:
 *               type: string
 *               example: "vehiculo.update"
 *             nombre:
 *               type: string
 *               example: "Actualizar Vehículos"
 *             descripcion:
 *               type: string
 *               example: "Permite actualizar vehículos"
 *   responses:
 *     200:
 *       description: Permiso actualizado
 *     400:
 *       description: Errores de validación
 *     404:
 *       description: Permiso no encontrado
 *     500:
 *       description: Error al actualizar el permiso
 */
rutas.put('/actualizar',controladorpermisos.Actualizar);

/**
 * @swagger
 * /permisos/eliminar:
 *  delete:
 *    summary: Eliminar un permiso existente
 *    tags: [Permiso]
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del permiso a eliminar
 *    responses:
 *      200:
 *        description: Permiso eliminado
 *      404:
 *        description: Permiso no encontrado
 *      500:
 *        description: Error al eliminar el permiso
 */
rutas.delete('/eliminar',controladorpermisos.Eliminar);

/**
 * @swagger
 * /permisos/asignar:
 *  post:
 *    summary: Asignar permiso a un rol
 *    tags: [Permiso]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - permisoId
 *              - rolId
 *            properties:
 *              permisoId:
 *                type: integer
 *                example: 1
 *              rolId:
 *                type: integer
 *                example: 1
 *    responses:
 *      200:
 *        description: Permiso asignado al rol
 *      404:
 *        description: Permiso o rol no encontrado
 *      500:
 *        description: Error al asignar el permiso
 */
rutas.post('/asignar',controladorpermisos.AsignarARol);

/**
 * @swagger
 * /permisos/remover:
 *  post:
 *    summary: Remover permiso de un rol
 *    tags: [Permiso]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - permisoId
 *              - rolId
 *            properties:
 *              permisoId:
 *                type: integer
 *                example: 1
 *              rolId:
 *                type: integer
 *                example: 1
 *    responses:
 *      200:
 *        description: Permiso removido del rol
 *      404:
 *        description: Permiso o rol no encontrado
 *      500:
 *        description: Error al remover el permiso
 */
rutas.post('/remover',controladorpermisos.RemoverDeRol);

module.exports = rutas;
