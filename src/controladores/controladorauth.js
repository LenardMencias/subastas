const argon2 = require('argon2');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const usuarioModelo = require('../modelos/usuario');
const { rol: rolModelo } = require('../modelos/rol');

// Función para generar PIN de 6 dígitos
function generarPin(longitud = 6) {
    const min = Math.pow(10, longitud - 1);
    const max = Math.pow(10, longitud) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// LOGIN PARA CLIENTES Y EMPLEADOS
exports.iniciarSesion = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

    const { email, contrasena } = req.body;
    
    try {
        // Buscar usuario por email
        const buscarUsuario = await usuarioModelo.findOne({
            where: {
                email: email,
                estado: true
            }
        });

        if (!buscarUsuario) return res.status(400).json({ errores: 'Usuario inválido' });
        
        // Verificar contraseña con argon2
        if (await argon2.verify(buscarUsuario.contrasena, contrasena)) {
            // Obtener información del rol mediante consulta SQL directa
            let rolInfo = null;
            if (buscarUsuario.rolId) {
                const [roles] = await usuarioModelo.sequelize.query(
                    'SELECT id, nombre, descripcion FROM rol WHERE id = ?',
                    { replacements: [buscarUsuario.rolId] }
                );
                rolInfo = roles[0] || null;
            }

            const token = generarPin(6);
            const data = {
                token: token,
                usuario: {
                    id: buscarUsuario.id,
                    nombre: buscarUsuario.nombre,
                    email: buscarUsuario.email,
                    estado: buscarUsuario.estado,
                    rol: rolInfo
                }
            };
            res.json({ data });
        } else {
            return res.status(400).json({ errores: 'Error en los datos enviados' });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// REGISTRO SIMPLE PARA PRUEBAS DE APUESTAS
exports.registrar = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

    const { nombre, email, contrasena, tipoUsuario = 'cliente' } = req.body;
    
    try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await usuarioModelo.findOne({
            where: { email: email }
        });

        if (usuarioExistente) {
            return res.status(400).json({ errores: 'El usuario ya existe con este email' });
        }
        
        // Hashear contraseña con argon2
        const contrasenaHasheada = await argon2.hash(contrasena);
        
        // Determinar ID del rol basado en el tipo de usuario
        let rolId;
        if (tipoUsuario.toLowerCase() === 'empleado') {
            rolId = 2; // Empleado
        } else if (tipoUsuario.toLowerCase() === 'administrador') {
            rolId = 3; // Administrador
        } else {
            rolId = 1; // Cliente (por defecto)
        }
        
        // Crear usuario
        const nuevoUsuario = await usuarioModelo.create({
            nombre: nombre,
            email: email,
            contrasena: contrasenaHasheada,
            estado: true,
            rolId: rolId
        });
        
        res.status(201).json({ 
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                estado: nuevoUsuario.estado
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = exports;
