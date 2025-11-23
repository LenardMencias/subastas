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

// Validaciones para recuperación de contraseña
const validacionRecuperacion = [
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail()
];

const validacionCambioContrasena = [
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('token')
        .isLength({ min: 6, max: 6 })
        .withMessage('El token debe tener 6 dígitos')
        .isNumeric()
        .withMessage('El token debe ser numérico'),
    body('nuevaContrasena')
        .isLength({ min: 4 })
        .withMessage('La nueva contraseña debe tener al menos 4 caracteres')
];

const validacionVerificarToken = [
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('token')
        .isLength({ min: 6, max: 6 })
        .withMessage('El token debe tener 6 dígitos')
        .isNumeric()
        .withMessage('El token debe ser numérico')
];

// Importar middleware de autenticación y permisos
const { verificarToken } = require('../configuraciones/permisos');

/**
 * @swagger
 * /auth/login:
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
 * /auth/registrar:
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
 * /auth/perfil:
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
        token: req.token,
        usuario: {
            id: req.userId,
            tipo: req.userType,
            rol: req.userRole,
            email: req.usuario.email,
            nombre: req.usuario.nombre,
            rolInfo: req.rolInfo
        },
        permisos: {
            puede: {
                apostar: true,
                comprarDirecto: true,
                verVehiculos: true,
                gestionarVehiculos: req.userRole !== 'cliente',
                editarUsuarios: req.userRole === 'admin' || req.userRole === 'empleado',
                gestionarRoles: req.userRole === 'admin'
            }
        }
    });
});

/**
 * @swagger
 * /auth/solicitar-recuperacion:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     description: Envía un token de 6 dígitos al email del usuario para recuperar su contraseña
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario
 *                 example: usuario@ejemplo.com
 *     responses:
 *       200:
 *         description: Token enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Se ha enviado un código de recuperación a tu email"
 *                 expiraEn:
 *                   type: string
 *                   example: "15 minutos"
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/solicitar-recuperacion', validacionRecuperacion, controladorAuth.solicitarRecuperacion);

/**
 * @swagger
 * /auth/cambiar-contrasena:
 *   post:
 *     summary: Cambiar contraseña con token
 *     description: Cambia la contraseña del usuario usando el token de recuperación
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *               - nuevaContrasena
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario
 *                 example: usuario@ejemplo.com
 *               token:
 *                 type: string
 *                 description: Token de 6 dígitos recibido por email
 *                 example: "123456"
 *               nuevaContrasena:
 *                 type: string
 *                 description: Nueva contraseña
 *                 example: "nuevaContrasena123"
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *       400:
 *         description: Token inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/cambiar-contrasena', validacionCambioContrasena, controladorAuth.cambiarContrasenaConToken);

/**
 * @swagger
 * /auth/verificar-token:
 *   post:
 *     summary: Verificar token de recuperación
 *     description: Verifica si un token de recuperación es válido (sin cambiar la contraseña)
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario
 *                 example: usuario@ejemplo.com
 *               token:
 *                 type: string
 *                 description: Token de 6 dígitos
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Token válido
 *       400:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error del servidor
 */
router.post('/verificar-token', validacionVerificarToken, controladorAuth.verificarToken);

/**
 * @swagger
 * /auth/permisos:
 *   get:
 *     summary: Consultar permisos del usuario autenticado
 *     description: Retorna la lista completa de permisos del usuario basada en su rol
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permisos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT actual
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     rol:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                 permisos:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de permisos específicos
 *                 jerarquia:
 *                   type: object
 *                   properties:
 *                     nivel:
 *                       type: integer
 *                       description: Nivel jerárquico del rol (1-3)
 *                     puede:
 *                       type: object
 *                       description: Capacidades resumidas por categoría
 *       401:
 *         description: Token inválido o no proporcionado
 */
const { PERMISOS, JERARQUIA_ROLES } = require('../configuraciones/permisos');
router.get('/permisos', verificarToken, (req, res) => {
    const rolUsuario = req.userRole || 'cliente';
    const permisosUsuario = PERMISOS[rolUsuario] || [];
    const nivelJerarquico = JERARQUIA_ROLES[rolUsuario] || 1;
    
    res.json({
        token: req.token,
        usuario: {
            id: req.userId,
            rol: rolUsuario,
            nombre: req.usuario.nombre,
            email: req.usuario.email
        },
        permisos: permisosUsuario,
        jerarquia: {
            nivel: nivelJerarquico,
            puede: {
                // Resumen de capacidades por categoría
                autenticacion: permisosUsuario.some(p => p.startsWith('auth:')),
                apuestas: {
                    crear: permisosUsuario.includes('apuesta:crear'),
                    listarPropias: permisosUsuario.includes('apuesta:listar-propias'),
                    listarTodas: permisosUsuario.includes('apuesta:listar-todas'),
                    finalizar: permisosUsuario.includes('apuesta:finalizar')
                },
                vehiculos: {
                    ver: permisosUsuario.includes('vehiculo:ver'),
                    crear: permisosUsuario.includes('vehiculo:crear'),
                    editar: permisosUsuario.includes('vehiculo:editar'),
                    eliminar: permisosUsuario.includes('vehiculo:eliminar')
                },
                usuarios: {
                    listar: permisosUsuario.includes('usuario:listar'),
                    editarClientes: permisosUsuario.includes('usuario:editar-clientes'),
                    editarEmpleados: permisosUsuario.includes('usuario:editar-empleados'),
                    editarAdmins: permisosUsuario.includes('usuario:editar-admins')
                },
                sistema: {
                    gestionarRoles: permisosUsuario.includes('rol:crear'),
                    configurar: permisosUsuario.includes('sistema:configurar'),
                    reportes: permisosUsuario.includes('reportes:generar-todos')
                }
            }
        }
    });
});

module.exports = router;