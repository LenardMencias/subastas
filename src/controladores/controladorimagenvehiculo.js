const modeloImagenVehiculo = require('../modelos/imagenvehiculo');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

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
        // Si hay un archivo subido, eliminarlo
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        const data = errores.array().map(i => ({
            atributo: i.path,
            msj: i.msg
        }));
        return res.status(400).json({ msj: 'Hay errores', data: data });
    }

    if (!req.file) {
        return res.status(400).json({ msj: 'No se ha proporcionado ninguna imagen' });
    }

    const { descripcion, vehiculoId } = req.body;
    try {
        // Crear la URL relativa para la imagen
        const urlImagen = `/vehiculoimagen/${req.file.filename}`;

        const nuevaImagen = await modeloImagenVehiculo.create({
            url: urlImagen,
            descripcion: descripcion,
            vehiculoId: vehiculoId
        });

        // Devolver la información completa
        res.status(201).json({
            ...nuevaImagen.toJSON(),
            urlCompleta: `${req.protocol}://${req.get('host')}${urlImagen}`
        });
    } catch (error) {
        // Si hay error, eliminar el archivo subido
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error(error);
        res.status(500).json({ msj: 'Error al guardar la imagen' });
    }
};

exports.Actualizar = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        const data = errores.array().map(i => ({
            atributo: i.path,
            msj: i.msg
        }));
        return res.status(400).json({ msj: 'Hay errores', data: data });
    }

    const { id, descripcion } = req.body;
    try {
        const imagenEncontrada = await modeloImagenVehiculo.findByPk(id);
        if (!imagenEncontrada) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ msj: 'Imagen no encontrada' });
        }

        let actualizacion = { descripcion };

        // Si hay una nueva imagen
        if (req.file) {
            // Eliminar la imagen anterior
            const rutaAnterior = path.join(__dirname, '../../public', imagenEncontrada.url);
            if (fs.existsSync(rutaAnterior)) {
                fs.unlinkSync(rutaAnterior);
            }

            // Actualizar con la nueva ruta
            const urlImagen = `/vehiculoimagen/${req.file.filename}`;
            actualizacion.url = urlImagen;
        }

        const imagenActualizada = await imagenEncontrada.update(actualizacion);

        // Devolver la información completa
        res.json({
            ...imagenActualizada.toJSON(),
            urlCompleta: `${req.protocol}://${req.get('host')}${imagenActualizada.url}`
        });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
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

        // Eliminar el archivo físico
        const rutaImagen = path.join(__dirname, '../../public', imagenEncontrada.url);
        if (fs.existsSync(rutaImagen)) {
            fs.unlinkSync(rutaImagen);
        }

        await imagenEncontrada.destroy();
        res.json({ msj: 'Imagen eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al eliminar la imagen' });
    }
};
