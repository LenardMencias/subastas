const usuarioModelo = require('../modelos/usuario');
const empleadoModelo = require('../modelos/empleado');
const compradorVendedorModelo = require('../modelos/CompradorVendedor');
const { validationResult } = require('express-validator');
const argon2 = require('argon2');

exports.Listar = async (req, res) => {
    const lista = await usuarioModelo.findAll({
        include: [
            { model: empleadoModelo, as: 'Empleados' },
            { model: compradorVendedorModelo, as: 'CompradorVendedors' }
        ]
    });
    res.json(lista);
};
exports.Buscar = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const data = errores.array().map(i => ({
            atributo: i.path,
            msj: i.msg
        }));
        return res.status(400).json({ msj: 'Hay errores', data: data });
    }
    const { id } = req.query;
    try {
        const usuarioEncontrado = await usuarioModelo.findByPk(id, {
            include: [
                { model: empleadoModelo, as: 'Empleados' },
                { model: compradorVendedorModelo, as: 'CompradorVendedors' }
            ]
        });
        if (!usuarioEncontrado) {
            return res.status(404).json({ msj: 'Usuario no encontrado' });
        }
        res.json(usuarioEncontrado);
    }
    catch (er) {
        console.error(er);
        res.status(500).json({ msj: 'Error al buscar el usuario' });
    }
};

exports.Guardar = async (req, res) => { 
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const data = errores.array().map(i => ({
            atributo: i.path,
            msj: i.msg
        }));
        return res.status(400).json({ msj: 'Hay errores', data: data });
    }
    
    const { nombre, email, contrasena, estado, rolId, empleadoId, compradorVendedorId } = req.body;
    
    // Validar que se especifique empleadoId O compradorVendedorId, pero no ambos
    if (!empleadoId && !compradorVendedorId) {
        return res.status(400).json({ 
            msj: 'Debe especificar empleadoId o compradorVendedorId para asociar el usuario a datos personales existentes' 
        });
    }
    
    if (empleadoId && compradorVendedorId) {
        return res.status(400).json({ 
            msj: 'No puede especificar empleadoId y compradorVendedorId al mismo tiempo' 
        });
    }
    
    const transaction = await usuarioModelo.sequelize.transaction();
    
    try {
        let entidadAsociada;
        
        // Verificar que el empleado o comprador/vendedor existe y no tiene usuario asignado
        if (empleadoId) {
            entidadAsociada = await empleadoModelo.findByPk(empleadoId);
            if (!entidadAsociada) {
                return res.status(404).json({ msj: 'Empleado no encontrado' });
            }
            if (entidadAsociada.usuarioId) {
                return res.status(400).json({ msj: 'Este empleado ya tiene un usuario asociado' });
            }
        } else if (compradorVendedorId) {
            entidadAsociada = await compradorVendedorModelo.findByPk(compradorVendedorId);
            if (!entidadAsociada) {
                return res.status(404).json({ msj: 'Comprador/Vendedor no encontrado' });
            }
            if (entidadAsociada.usuarioId) {
                return res.status(400).json({ msj: 'Este Comprador/Vendedor ya tiene un usuario asociado' });
            }
        }
        
        // Hashear la contraseña con Argon2
        const contrasenaHasheada = await argon2.hash(contrasena);
        
        // Crear el usuario
        const nuevoUsuario = await usuarioModelo.create({
            nombre: nombre,
            email: email,
            contrasena: contrasenaHasheada,
            estado: estado !== undefined ? estado : true,
            rolId: rolId
        }, { transaction });
        
        // Actualizar la entidad con el usuarioId
        entidadAsociada.usuarioId = nuevoUsuario.id;
        await entidadAsociada.save({ transaction });
        
        await transaction.commit();
        
        // Retornar el usuario completo con sus relaciones
        const usuarioCompleto = await usuarioModelo.findByPk(nuevoUsuario.id, {
            include: [
                { model: empleadoModelo, as: 'Empleados' },
                { model: compradorVendedorModelo, as: 'CompradorVendedors' }
            ]
        });
        
        res.status(201).json({
            msj: 'Usuario creado y asociado exitosamente',
            usuario: usuarioCompleto
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ msj: 'Error al guardar el usuario', error: error.message });
    }
};

exports.Actualizar = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const data = errores.array().map(i => ({
            atributo: i.path,
            msj: i.msg
        }));
        return res.status(400).json({ msj: 'Hay errores', data: data });
    }
    const { id, nombre, email, contrasena, estado, rolId } = req.body;
    try {
        const usuarioEncontrado = await usuarioModelo.findByPk(id);
        if (!usuarioEncontrado) {
            return res.status(404).json({ msj: 'Usuario no encontrado' });
        }
        
        // Solo hashear la contraseña si se está actualizando
        let contrasenaFinal = usuarioEncontrado.contrasena;
        if (contrasena && contrasena !== usuarioEncontrado.contrasena) {
            contrasenaFinal = await argon2.hash(contrasena);
        }
        
        usuarioEncontrado.nombre = nombre;
        usuarioEncontrado.email = email;
        usuarioEncontrado.contrasena = contrasenaFinal;
        usuarioEncontrado.estado = estado;
        usuarioEncontrado.rolId = rolId;
        await usuarioEncontrado.save();
        res.json(usuarioEncontrado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al actualizar el usuario' });
    }
};
exports.Eliminar = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const data = errores.array().map(i => ({
            atributo: i.path,
            msj: i.msg
        }));
        return res.status(400).json({ msj: 'Hay errores', data: data });
    }
    const { id } = req.query;
    try {
        const usuarioEncontrado = await usuarioModelo.findByPk(id);
        if (!usuarioEncontrado) {
            return res.status(404).json({ msj: 'Usuario no encontrado' });
        }
        await usuarioEncontrado.destroy();
        res.json({ msj: 'Usuario eliminado correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al eliminar el usuario' });
    }
};