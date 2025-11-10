const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const controladorAuth = require('../controladores/controladorauth');

const validacionLogin = [
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('contrasena')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
];

// Validaciones para registro
const validacionRegistro = [
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isLength({ min: 2 })
        .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('contrasena')
        .isLength({ min: 4 })
        .withMessage('La contraseña debe tener al menos 4 caracteres'),
    body('tipoUsuario')
        .optional()
        .isIn(['cliente', 'empleado', 'administrador'])
        .withMessage('El tipo de usuario debe ser: cliente, empleado o administrador')
];

// Importar middleware de autenticación
const { verificarToken } = require('../configuraciones/auth');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Permite a clientes y empleados iniciar sesión con email y contraseña
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - contrasena
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token JWT para autenticación
 *                     usuario:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         nombre:
 *                           type: string
 *                         email:
 *                           type: string
 *                         tipo:
 *                           type: string
 *                           enum: [cliente, empleado]
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
router.post('/login', validacionLogin, controladorAuth.iniciarSesion);

/**
 * @swagger
 * /api/auth/registrar:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: Permite registrar un nuevo usuario para pruebas de apuestas
 *     tags: [Autenticación]
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
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre completo del usuario
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico único del usuario
 *                 example: "juan@email.com"
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario (mínimo 4 caracteres)
 *                 example: "1234"
 *               tipoUsuario:
 *                 type: string
 *                 description: Tipo de usuario (cliente, empleado, administrador)
 *                 enum: [cliente, empleado, administrador]
 *                 default: cliente
 *                 example: "cliente"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Email ya existe o errores de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post('/registrar', validacionRegistro, controladorAuth.registrar);

/**
 * @swagger
 * /api/auth/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     description: Endpoint protegido que retorna información del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Acceso autorizado"
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     email:
 *                       type: string
 *                     tipo:
 *                       type: string
 *       401:
 *         description: Token inválido o no proporcionado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/perfil', verificarToken, (req, res) => {
    res.json({
        mensaje: "Acceso autorizado",
        usuario: {
            id: req.userId,
            tipo: req.userType,
            email: req.usuario.email,
            nombre: req.usuario.nombre
        }
    });
});

module.exports = router;