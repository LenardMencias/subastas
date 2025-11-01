// Controlador de Apuesta
const modeloApuesta = require('../modelos/apuesta');
const modeloTiempo = require('../modelos/tiempo');
const { validationResult } = require('express-validator');
const sendEmail = require('../modelos/notificacion');
const { Sequelize } = require('sequelize');
const modeloUsuarios = require('../modelos/usuario');
const modeloVehiculos = require('../modelos/vehiculo');
const vehiculo = require('../modelos/vehiculo');

exports.Listar = async (req, res) => {
    try {
        const lista = await modeloApuesta.findAll({
            include: ['Usuario', 'Vehiculo', 'Tiempo']
        });
        res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar las apuestas' });
    }
};

exports.ListarPorVehiculo = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const data = errores.array().map(i => ({
            atributo: i.path,
            msj: i.msg
        }));
        return res.status(400).json({ msj: 'Hay errores', data: data });
    }

    const { vehiculoId } = req.query;
    try {
        const apuestas = await modeloApuesta.findAll({
            where: { vehiculoId: vehiculoId },
            include: ['Usuario', 'Tiempo']
        });
        res.json(apuestas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar las apuestas del vehículo' });
    }
};

exports.ListarPorUsuario = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const data = errores.array().map(i => ({
            atributo: i.path,
            msj: i.msg
        }));
        return res.status(400).json({ msj: 'Hay errores', data: data });
    }

    const { usuarioId } = req.query;
    try {
        const apuestas = await modeloApuesta.findAll({
            where: { usuarioId: usuarioId },
            include: ['Vehiculo', 'Tiempo']
        });
        res.json(apuestas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar las apuestas del usuario' });
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

    const { monto, usuarioId, vehiculoId, tiempoId } = req.body;
    try {
        let tiempoFinal = tiempoId;
        if (!tiempoId) {
            const tiempoDefault = await modeloTiempo.findOne({
                where: { duracion: 300, activo: true } 
            });
            if (!tiempoDefault) {
                const nuevoTiempo = await modeloTiempo.create({
                    duracion: 300,
                    descripcion: 'Tiempo por defecto (5 horas)',
                    activo: true
                });
                tiempoFinal = nuevoTiempo.id;
            } else {
                tiempoFinal = tiempoDefault.id;
            }
        }

        const nuevaApuesta = await modeloApuesta.create({
            monto: monto,
            usuarioId: usuarioId,
            vehiculoId: vehiculoId,
            tiempoId: tiempoFinal,
            estado: 'activa'
        });

        const apuestaConRelaciones = await modeloApuesta.findByPk(nuevaApuesta.id, {
            include: ['Usuario', 'Vehiculo', 'Tiempo']
        });
        
        res.status(201).json(apuestaConRelaciones);

        const mensaje = `Se ha creado una nueva subasta de $${monto} para el vehículo: ${apuestaConRelaciones.Vehiculo.marca} ${apuestaConRelaciones.Vehiculo.modelo}, la subasta sera realizada por el usuario: ${apuestaConRelaciones.Usuario.nombre}. \nLa subasta dara inicio el ${apuestaConRelaciones.fechaInicio} y finalizara el ${apuestaConRelaciones.fechaFin}.`;

        sendEmail('lenardrjc@gmail.com', 'Subasta', mensaje);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al guardar la apuesta' });
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

    const { id, estado, ganador } = req.body;
    try {
        const apuestaEncontrada = await modeloApuesta.findByPk(id);
        if (!apuestaEncontrada) {
            return res.status(404).json({ msj: 'Apuesta no encontrada' });
        }

        const apuestaActualizada = await apuestaEncontrada.update({
            estado: estado,
            ganador: ganador
        });

        const apuestaConRelaciones = await modeloApuesta.findByPk(id, {
            include: ['Usuario', 'Vehiculo', 'Tiempo']
        });

        res.json(apuestaConRelaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al actualizar la apuesta' });
    }
};

exports.FinalizarApuesta = async (req, res) => {
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
        const apuesta = await modeloApuesta.findByPk(id);
        if (!apuesta) {
            return res.status(404).json({ msj: 'Apuesta no encontrada' });
        }

        if (apuesta.estado !== 'activa') {
            return res.status(400).json({ msj: 'La apuesta ya no está activa' });
        }

        await apuesta.update({
            estado: 'finalizada',
            fechaFin: new Date()
        });

        res.json({ msj: 'Apuesta finalizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al finalizar la apuesta' });
    }
};
