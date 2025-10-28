// Controlador de Tiempo
const modeloTiempo = require('../modelos/tiempo');
const { validationResult } = require('express-validator');

exports.Listar = async (req, res) => {
    try {
        const lista = await modeloTiempo.findAll();
        res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar los tiempos' });
    }
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
        const tiempoEncontrado = await modeloTiempo.findByPk(id);
        if (!tiempoEncontrado) {
            return res.status(404).json({ msj: 'Tiempo no encontrado' });
        }
        res.json(tiempoEncontrado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al buscar el tiempo' });
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

    const { duracion, descripcion } = req.body;
    try {
        const nuevoTiempo = await modeloTiempo.create({
            duracion: duracion,
            descripcion: descripcion
        });
        res.status(201).json(nuevoTiempo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al guardar el tiempo' });
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

    const { id, duracion, descripcion, activo } = req.body;
    try {
        const tiempoEncontrado = await modeloTiempo.findByPk(id);
        if (!tiempoEncontrado) {
            return res.status(404).json({ msj: 'Tiempo no encontrado' });
        }

        const tiempoActualizado = await tiempoEncontrado.update({
            duracion: duracion,
            descripcion: descripcion,
            activo: activo
        });
        res.json(tiempoActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al actualizar el tiempo' });
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
        const tiempoEncontrado = await modeloTiempo.findByPk(id);
        if (!tiempoEncontrado) {
            return res.status(404).json({ msj: 'Tiempo no encontrado' });
        }

        await tiempoEncontrado.destroy();
        res.json({ msj: 'Tiempo eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al eliminar el tiempo' });
    }
};
