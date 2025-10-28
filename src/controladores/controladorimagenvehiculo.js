const modeloImagenVehiculo = require('../modelos/imagenvehiculo');
const { validationResult } = require('express-validator');

exports.Listar = async (req, res) => {
    try {
        const lista = await modeloImagenVehiculo.findAll();
        res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar las imágenes' });
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
        const imagenes = await modeloImagenVehiculo.findAll({
            where: { vehiculoId: vehiculoId }
        });
        res.json(imagenes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar las imágenes del vehículo' });
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

    const { url, descripcion, vehiculoId } = req.body;
    try {
        const nuevaImagen = await modeloImagenVehiculo.create({
            url: url,
            descripcion: descripcion,
            vehiculoId: vehiculoId
        });
        res.status(201).json(nuevaImagen);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al guardar la imagen' });
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

    const { id, url, descripcion } = req.body;
    try {
        const imagenEncontrada = await modeloImagenVehiculo.findByPk(id);
        if (!imagenEncontrada) {
            return res.status(404).json({ msj: 'Imagen no encontrada' });
        }

        const imagenActualizada = await imagenEncontrada.update({
            url: url,
            descripcion: descripcion
        });
        res.json(imagenActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al actualizar la imagen' });
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
        const imagenEncontrada = await modeloImagenVehiculo.findByPk(id);
        if (!imagenEncontrada) {
            return res.status(404).json({ msj: 'Imagen no encontrada' });
        }

        await imagenEncontrada.destroy();
        res.json({ msj: 'Imagen eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al eliminar la imagen' });
    }
};
