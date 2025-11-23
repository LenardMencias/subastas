const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuario');

// Definir jerarquía de permisos
const JERARQUIA_ROLES = {
    'cliente': 1,
    'empleado': 2, 
    'admin': 3
};

// Permisos específicos por rol
const PERMISOS = {
    'cliente': [
        'auth:login',
        'auth:register', 
        'auth:profile',
        'apuesta:crear',
        'apuesta:listar-propias',
        'compra-directa:realizar',
        'vehiculo:listar',
        'vehiculo:ver'
    ],
    'empleado': [
        // Todos los permisos de cliente
        'auth:login',
        'auth:register',
        'auth:profile', 
        'apuesta:crear',
        'apuesta:listar-propias',
        'compra-directa:realizar',
        'vehiculo:listar',
        'vehiculo:ver',
        // Permisos adicionales de empleado
        'vehiculo:crear',
        'vehiculo:editar',
        'vehiculo:eliminar',
        'titulo-vehiculo:crear',
        'titulo-vehiculo:editar',
        'imagen-vehiculo:subir',
        'imagen-vehiculo:eliminar',
        'venta:gestionar',
        'apuesta:listar-todas',
        'apuesta:finalizar',
        'comprador-vendedor:asociar',
        'usuario:editar-clientes',
        'usuario:listar'
    ],
    'admin': [
        // Todos los permisos anteriores más
        'auth:login',
        'auth:register',
        'auth:profile',
        'apuesta:crear',
        'apuesta:listar-propias', 
        'compra-directa:realizar',
        'vehiculo:listar',
        'vehiculo:ver',
        'vehiculo:crear',
        'vehiculo:editar',
        'vehiculo:eliminar',
        'titulo-vehiculo:crear',
        'titulo-vehiculo:editar',
        'imagen-vehiculo:subir',
        'imagen-vehiculo:eliminar',
        'venta:gestionar',
        'apuesta:listar-todas',
        'apuesta:finalizar',
        'comprador-vendedor:asociar',
        'usuario:editar-clientes',
        'usuario:listar',
        // Permisos exclusivos de admin
        'rol:crear',
        'rol:editar',
        'rol:eliminar',
        'permisos:gestionar',
        'usuario:editar-empleados',
        'usuario:editar-admins',
        'usuario:eliminar',
        'sistema:configurar',
        'reportes:generar-todos'
    ]
};

// Middleware para verificar token y cargar usuario con rol
const verificarToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                msj: 'Token no proporcionado o formato incorrecto',
                token: null
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar el usuario en la base de datos
        const usuario = await Usuario.findByPk(decoded.userId, {
            attributes: ['id', 'nombre', 'email', 'estado', 'rolId']
        });

        if (!usuario) {
            return res.status(401).json({ 
                msj: 'Usuario no encontrado',
                token: null 
            });
        }

        if (!usuario.estado) {
            return res.status(401).json({ 
                msj: 'Usuario inactivo',
                token: null 
            });
        }

        // Obtener información del rol
        let rolInfo = null;
        if (usuario.rolId) {
            const [roles] = await Usuario.sequelize.query(
                'SELECT id, nombre, descripcion FROM rol WHERE id = ?',
                { replacements: [usuario.rolId] }
            );
            rolInfo = roles[0] || null;
        }

        // Establecer información en el request
        req.userId = usuario.id;
        req.userRole = rolInfo?.nombre || 'cliente';
        req.userType = req.userRole; // Para compatibilidad
        req.usuario = usuario;
        req.rolInfo = rolInfo;
        req.token = token; // Hacer el token visible

        next();
    } catch (error) {
        return res.status(401).json({
            msj: 'Token inválido',
            token: null,
            error: error.message
        });
    }
};

// Middleware para verificar permisos específicos
const verificarPermiso = (permisoRequerido) => {
    return (req, res, next) => {
        const rolUsuario = req.userRole || 'cliente';
        
        if (!PERMISOS[rolUsuario] || !PERMISOS[rolUsuario].includes(permisoRequerido)) {
            return res.status(403).json({
                msj: `No tienes permisos para realizar esta acción. Se requiere: ${permisoRequerido}`,
                rolActual: rolUsuario,
                permisoRequerido: permisoRequerido,
                token: req.token
            });
        }
        
        next();
    };
};

// Middleware para verificar jerarquía de roles (mínimo requerido)
const verificarRolMinimo = (rolMinimo) => {
    return (req, res, next) => {
        const rolUsuario = req.userRole || 'cliente';
        const nivelUsuario = JERARQUIA_ROLES[rolUsuario] || 0;
        const nivelRequerido = JERARQUIA_ROLES[rolMinimo] || 999;
        
        if (nivelUsuario < nivelRequerido) {
            return res.status(403).json({
                msj: `Acceso denegado. Se requiere rol mínimo: ${rolMinimo}`,
                rolActual: rolUsuario,
                rolRequerido: rolMinimo,
                token: req.token
            });
        }
        
        next();
    };
};

// Middleware específico para edición de usuarios con validación de jerarquía
const verificarEdicionUsuario = async (req, res, next) => {
    try {
        const { id } = req.params || req.body;
        const rolActual = req.userRole;
        
        if (!id) {
            return res.status(400).json({ msj: 'ID de usuario requerido' });
        }

        // Obtener el usuario objetivo
        const usuarioObjetivo = await Usuario.findByPk(id, {
            attributes: ['id', 'rolId']
        });
        
        if (!usuarioObjetivo) {
            return res.status(404).json({ msj: 'Usuario no encontrado' });
        }

        // Obtener rol del usuario objetivo
        let rolObjetivo = 'cliente';
        if (usuarioObjetivo.rolId) {
            const [roles] = await Usuario.sequelize.query(
                'SELECT nombre FROM rol WHERE id = ?',
                { replacements: [usuarioObjetivo.rolId] }
            );
            rolObjetivo = roles[0]?.nombre || 'cliente';
        }

        // Verificar si puede editar según jerarquía
        const nivelActual = JERARQUIA_ROLES[rolActual] || 0;
        const nivelObjetivo = JERARQUIA_ROLES[rolObjetivo] || 0;

        if (rolActual === 'empleado' && rolObjetivo === 'admin') {
            return res.status(403).json({
                msj: 'Los empleados no pueden editar usuarios administradores',
                rolActual: rolActual,
                rolObjetivo: rolObjetivo,
                token: req.token
            });
        }

        if (nivelActual <= nivelObjetivo && req.userId !== usuarioObjetivo.id) {
            return res.status(403).json({
                msj: 'No tienes permisos para editar este usuario',
                rolActual: rolActual,
                rolObjetivo: rolObjetivo,
                token: req.token
            });
        }

        next();
    } catch (error) {
        console.error('Error en verificarEdicionUsuario:', error);
        res.status(500).json({ msj: 'Error interno del servidor' });
    }
};

module.exports = {
    verificarToken,
    verificarPermiso,
    verificarRolMinimo,
    verificarEdicionUsuario,
    JERARQUIA_ROLES,
    PERMISOS
};