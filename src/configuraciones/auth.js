const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuario');

// Middleware que verifica el JWT, carga el usuario y expone datos útiles en req
const verificarToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                msj: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar el usuario en la base de datos y adjuntarlo a la request
        const usuario = await Usuario.findByPk(decoded.userId, {
            attributes: ['id', 'nombre', 'email', 'estado']
        });

        if (!usuario) {
            return res.status(401).json({ msj: 'Usuario no encontrado' });
        }

        req.userId = usuario.id;
        // mantener role tal como viene en el token
        req.userRole = decoded.role || null;
        // compatibilidad con rutas que usan userType / usuario
        req.userType = decoded.role || null;
        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(401).json({
            msj: 'Token inválido'
        });
    }
};

module.exports = {
    verificarToken
};