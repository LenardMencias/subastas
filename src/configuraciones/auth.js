// ARCHIVO LEGACY - Se mantiene por compatibilidad
// Usar preferentemente las funciones de /configuraciones/permisos.js

const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuario');

// Middleware que verifica el JWT (versión legacy)
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

module.exports = {
    verificarToken
};