const {Router} = require('express');
const controladorcompradorvendedor = require('../controladores/controladorcompradorvendedor');
const {body,query}=require('express-validator');
const modelocompradorvendedor = require('../modelos/CompradorVendedor');
const rutas = Router();

/**
 * @swagger
 * /compradoresvendedores/listar:
 *  get:
 *    summary: Listar compradores/vendedores
 *    responses:
 *      200:
 *        description: Lista de compradores/vendedores
 *      500:
 *        description: Error al listar compradores/vendedores
 */
rutas.get('/listar',controladorcompradorvendedor.Listar);

/**
 * @swagger
 * /compradoresvendedores/buscar:
 *  get:
 *    summary: Buscar comprador/vendedor por ID
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        description: ID del comprador/vendedor a buscar
 *    responses:
 *      200:
 *        description: Comprador/vendedor encontrado
 *      404:
 *        description: Comprador/vendedor no encontrado
 *      500:
 *        description: Error al buscar el comprador/vendedor
 */
rutas.get('/buscar',controladorcompradorvendedor.Buscar);

/**
 * @swagger
 * /compradoresvendedores/guardar:
 *  post:
 *    summary: Guardar un nuevo comprador/vendedor
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              identidad:
 *                type: string
 *              primernombre:
 *                type: string
 *              segundonombre:
 *                type: string
 *              primerapellido:
 *                type: string
 *              segundoapellido:
 *                type: string
 *              telefono:
 *                type: string
 *              direccion:
 *                type: string
 *              correo:
 *                type: string
 *              fechaNacimiento:
 *                type: string
 *                format: date
 *              usuarioId:
 *                type: integer
 *    responses:
 *      201:
 *        description: Comprador/vendedor guardado
 *      400:
 *        description: Errores de validación
 *      500:
 *        description: Error al guardar el comprador/vendedor
 */
rutas.post('/guardar',controladorcompradorvendedor.Guardar);

/**
 * @swagger
 * /compradoresvendedores/actualizar:
 *  put:
 *   summary: Actualizar un comprador/vendedor existente
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             primernombre:
 *               type: string
 *             segundonombre:
 *               type: string
 *             primerapellido:
 *               type: string
 *             segundoapellido:
 *               type: string
 *             telefono:
 *               type: string
 *             direccion:
 *               type: string
 *             correo:
 *               type: string
 *             fechaNacimiento:
 *               type: string
 *               format: date
 *   responses:
 *     200:
 *       description: Comprador/vendedor actualizado
 *     400:
 *       description: Errores de validación
 *     404:
 *       description: Comprador/vendedor no encontrado
 *     500:
 *       description: Error al actualizar el comprador/vendedor
 */
rutas.put('/actualizar',controladorcompradorvendedor.Actualizar);

/**
 * @swagger
 * /compradoresvendedores/eliminar:
 *  delete:
 *    summary: Eliminar un comprador/vendedor existente
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        description: ID del comprador/vendedor a eliminar
 *    responses:
 *      200:
 *        description: Comprador/vendedor eliminado
 *      404:
 *        description: Comprador/vendedor no encontrado
 *      500:
 *        description: Error al eliminar el comprador/vendedor
 */
rutas.delete('/eliminar',controladorcompradorvendedor.Eliminar);

module.exports = rutas;
