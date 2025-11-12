const { Router } = require('express');
const controladorusuario = require('../controladores/controladorusuario');
const { body, query } = require('express-validator');
const modelousuario = require('../modelos/usuario');
const rutas = Router();
/**
 * @swagger
 * /usuarios/listar:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Usuario]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       500:
 *         description: Error interno del servidor
 */
rutas.get('/listar', controladorusuario.Listar);

/**
 * @swagger
 * /usuarios/buscar:
 *   get:
 *     summary: Buscar un usuario por ID
 *     tags: [Usuario]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID del usuario a buscar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
rutas.get('/buscar', controladorusuario.Buscar);
/**
 * @swagger
 * /usuarios/guardar:
 *   post:
 *     summary: Crear un usuario asociado a un Empleado o CompradorVendedor existente
 *     description: Primero debe crear un Empleado o CompradorVendedor, luego usar su ID para crear el usuario
 *     tags:
 *       - Usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - contrasena
 *               - rolId
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "juan123"
 *               email:
 *                 type: string
 *                 example: "juan@sistema.com"
 *               contrasena:
 *                 type: string
 *                 example: "Password123!"
 *               estado:
 *                 type: boolean
 *                 default: true
 *               rolId:
 *                 type: integer
 *                 example: 1
 *               empleadoId:
 *                 type: integer
 *                 example: 1
 *                 description: ID del empleado creado previamente (usar este O compradorVendedorId)
 *               compradorVendedorId:
 *                 type: integer
 *                 example: 1
 *                 description: ID del comprador/vendedor creado previamente (usar este O empleadoId)
 *           examples:
 *             usuarioEmpleado:
 *               summary: Crear usuario para empleado existente
 *               value:
 *                 nombre: "admin123"
 *                 email: "admin@sistema.com"
 *                 contrasena: "Admin123!"
 *                 estado: true
 *                 rolId: 1
 *                 empleadoId: 1
 *             usuarioComprador:
 *               summary: Crear usuario para comprador/vendedor existente
 *               value:
 *                 nombre: "maria456"
 *                 email: "maria@sistema.com"
 *                 contrasena: "Maria456!"
 *                 estado: true
 *                 rolId: 2
 *                 compradorVendedorId: 1
 *     responses:
 *       201:
 *         description: Usuario creado y asociado exitosamente
 *       400:
 *         description: Errores de validación o empleado/comprador ya tiene usuario
 *       404:
 *         description: Empleado o CompradorVendedor no encontrado
 *       500:
 *         description: Error interno del servidor
 */
rutas.post('/guardar', controladorusuario.Guardar);
/**
 * @swagger
 * /usuarios/actualizar:
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               estado:
 *                 type: string
 *               rolId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Errores de validación
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
rutas.put('/actualizar', controladorusuario.Actualizar);
/**
 * @swagger
 * /usuarios/eliminar:
 *   delete:
 *     summary: Eliminar un usuario existente
 *     tags: [Usuario]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
rutas.delete('/eliminar', controladorusuario.Eliminar); 

module.exports = rutas;