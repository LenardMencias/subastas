const argon2 = require('argon2');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const usuarioModelo = require('../modelos/usuario');
const { rol: rolModelo } = require('../modelos/rol');
const { enviarEmailRecuperacion, enviarEmailConfirmacionCuenta } = require('../configuraciones/email');

// Función para generar PIN de 6 dígitos
function generarPin(longitud = 6) {
    const min = Math.pow(10, longitud - 1);
    const max = Math.pow(10, longitud) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// LOGIN PARA CLIENTES Y EMPLEADOS CON CONTROL DE INTENTOS FALLIDOS
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
        
        // Verificar si la cuenta está bloqueada
        const ahora = new Date();
        if (buscarUsuario.bloqueadoHasta && buscarUsuario.bloqueadoHasta > ahora) {
            const tiempoRestante = Math.ceil((buscarUsuario.bloqueadoHasta - ahora) / 1000);
            return res.status(423).json({ 
                errores: `Cuenta bloqueada. Intenta de nuevo en ${tiempoRestante} segundos.`,
                tiempoRestante: tiempoRestante
            });
        }
        
        // Verificar contraseña con argon2
        if (await argon2.verify(buscarUsuario.contrasena, contrasena)) {
            // Contraseña correcta - resetear intentos fallidos
            await buscarUsuario.update({
                intentosFallidos: 0,
                bloqueadoHasta: null
            });

            // Obtener información del rol mediante consulta SQL directa
            let rolInfo = null;
            if (buscarUsuario.rolId) {
                const [roles] = await usuarioModelo.sequelize.query(
                    'SELECT id, nombre, descripcion FROM rol WHERE id = ?',
                    { replacements: [buscarUsuario.rolId] }
                );
                rolInfo = roles[0] || null;
            }

            // Generar JWT token con información completa
            const token = jwt.sign(
                { 
                    userId: buscarUsuario.id,
                    email: buscarUsuario.email,
                    nombre: buscarUsuario.nombre,
                    role: rolInfo?.nombre || 'cliente',
                    rolId: rolInfo?.id || 1,
                    iat: Math.floor(Date.now() / 1000)
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const data = {
                token: token,
                usuario: {
                    id: buscarUsuario.id,
                    nombre: buscarUsuario.nombre,
                    email: buscarUsuario.email,
                    estado: buscarUsuario.estado,
                    rol: rolInfo
                },
                permisos: {
                    puede: {
                        apostar: true,
                        comprarDirecto: true,
                        verVehiculos: true,
                        gestionarVehiculos: rolInfo?.nombre !== 'cliente',
                        editarUsuarios: rolInfo?.nombre === 'admin' || rolInfo?.nombre === 'empleado',
                        gestionarRoles: rolInfo?.nombre === 'admin'
                    }
                }
            };
            res.json({ data });
        } else {
            // Contraseña incorrecta - incrementar intentos fallidos
            const nuevosIntentos = (buscarUsuario.intentosFallidos || 0) + 1;
            let actualizacion = { intentosFallidos: nuevosIntentos };
            
            // Si llega a 3 intentos fallidos, bloquear por 1 minuto
            if (nuevosIntentos >= 3) {
                const bloqueadoHasta = new Date(ahora.getTime() + 60000); // 1 minuto
                actualizacion.bloqueadoHasta = bloqueadoHasta;
                
                await buscarUsuario.update(actualizacion);
                
                return res.status(423).json({ 
                    errores: 'Cuenta bloqueada por 1 minuto debido a múltiples intentos fallidos.',
                    tiempoRestante: 60
                });
            } else {
                await buscarUsuario.update(actualizacion);
                const intentosRestantes = 3 - nuevosIntentos;
                return res.status(400).json({ 
                    errores: `Contraseña incorrecta. Te quedan ${intentosRestantes} intentos.`,
                    intentosRestantes: intentosRestantes
                });
            }
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
        
        // Enviar email de confirmación de cuenta
        const emailEnviado = await enviarEmailConfirmacionCuenta(email, nombre, tipoUsuario);
        
        // Generar token para el usuario recién creado
        const token = jwt.sign(
            { 
                userId: nuevoUsuario.id,
                email: nuevoUsuario.email,
                nombre: nuevoUsuario.nombre,
                role: tipoUsuario,
                rolId: rolId,
                iat: Math.floor(Date.now() / 1000)
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({ 
            mensaje: 'Usuario registrado exitosamente',
            emailConfirmacion: emailEnviado ? 'Email de confirmación enviado' : 'Error al enviar email de confirmación',
            token: token,
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                estado: nuevoUsuario.estado,
                rol: tipoUsuario,
                rolId: rolId
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// SOLICITAR RECUPERACIÓN DE CONTRASEÑA
exports.solicitarRecuperacion = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

    const { email } = req.body;
    
    try {
        // Buscar usuario por email
        const usuario = await usuarioModelo.findOne({
            where: {
                email: email,
                estado: true
            }
        });

        if (!usuario) {
            return res.status(404).json({ errores: 'No se encontró una cuenta con este email' });
        }
        
        // Generar token de 6 dígitos
        const token = generarPin(6);
        
        // Establecer expiración del token (15 minutos)
        const expiracion = new Date();
        expiracion.setMinutes(expiracion.getMinutes() + 15);
        
        // Guardar token en la base de datos
        await usuario.update({
            tokenRecuperacion: token,
            tokenExpiracion: expiracion
        });
        
        // Enviar email con el token
        const emailEnviado = await enviarEmailRecuperacion(email, token, usuario.nombre);
        
        if (emailEnviado) {
            res.json({ 
                mensaje: 'Se ha enviado un código de recuperación a tu email',
                expiraEn: '15 minutos'
            });
        } else {
            res.status(500).json({ errores: 'Error al enviar el email de recuperación' });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// VALIDAR TOKEN Y CAMBIAR CONTRASEÑA
exports.cambiarContrasenaConToken = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

    const { email, token, nuevaContrasena } = req.body;
    
    try {
        // Buscar usuario por email
        const usuario = await usuarioModelo.findOne({
            where: {
                email: email,
                estado: true
            }
        });

        if (!usuario) {
            return res.status(404).json({ errores: 'Usuario no encontrado' });
        }
        
        // Verificar si tiene un token de recuperación activo
        if (!usuario.tokenRecuperacion || !usuario.tokenExpiracion) {
            return res.status(400).json({ errores: 'No hay solicitud de recuperación activa' });
        }
        
        // Verificar si el token no ha expirado
        const ahora = new Date();
        if (usuario.tokenExpiracion < ahora) {
            // Limpiar token expirado
            await usuario.update({
                tokenRecuperacion: null,
                tokenExpiracion: null
            });
            return res.status(400).json({ errores: 'El token de recuperación ha expirado' });
        }
        
        // Verificar si el token es correcto
        if (usuario.tokenRecuperacion !== token) {
            return res.status(400).json({ errores: 'Token de recuperación inválido' });
        }
        
        // Hash de la nueva contraseña
        const nuevaContrasenaHasheada = await argon2.hash(nuevaContrasena);
        
        // Actualizar contraseña y limpiar datos de recuperación
        await usuario.update({
            contrasena: nuevaContrasenaHasheada,
            tokenRecuperacion: null,
            tokenExpiracion: null,
            intentosFallidos: 0, // Resetear intentos fallidos
            bloqueadoHasta: null // Desbloquear cuenta si estaba bloqueada
        });
        
        res.json({ mensaje: 'Contraseña cambiada exitosamente' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// VERIFICAR TOKEN (sin cambiar contraseña)
exports.verificarToken = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

    const { email, token } = req.body;
    
    try {
        const usuario = await usuarioModelo.findOne({
            where: {
                email: email,
                estado: true
            }
        });

        if (!usuario || !usuario.tokenRecuperacion || usuario.tokenRecuperacion !== token) {
            return res.status(400).json({ errores: 'Token inválido' });
        }
        
        if (usuario.tokenExpiracion < new Date()) {
            return res.status(400).json({ errores: 'Token expirado' });
        }
        
        res.json({ mensaje: 'Token válido' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = exports;
