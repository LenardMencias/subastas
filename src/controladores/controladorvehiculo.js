const modeloVehiculo = require('../modelos/vehiculo');
const { validationResult } = require('express-validator');

exports.Listar = async (req, res) => {
    try {
        const lista = await modeloVehiculo.findAll({
            include: ['ImagenVehiculos']
        });
        res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar los vehículos' });
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
        const vehiculoEncontrado = await modeloVehiculo.findByPk(id);
        if (!vehiculoEncontrado) {
            return res.status(404).json({ msj: 'Vehículo no encontrado' });
        }
        res.json(vehiculoEncontrado);
    }
    catch (er) {
        console.error(er);
        res.status(500).json({ msj: 'Error al buscar el vehículo' });
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
    const { marca, modelo, anio, vin, reporte, motor, transmision, traccion, combustible, llaves, kilometraje, tituloId, usuarioId } = req.body;
    try {
        // Verificar que no exista un vehículo con el mismo VIN
        const vehiculoConMismoVin = await modeloVehiculo.findOne({
            where: { vin: vin }
        });
        if (vehiculoConMismoVin) {
            return res.status(400).json({ msj: 'Ya existe un vehículo registrado con ese VIN' });
        }

        const nuevoVehiculo = await modeloVehiculo.create({
            marca: marca,
            modelo: modelo,
            anio: anio,
            vin: vin,
            reporte: reporte,
            motor: motor,
            transmision: transmision,
            traccion: traccion,
            combustible: combustible,
            llaves: llaves,
            kilometraje: kilometraje,
            tituloId: tituloId,
            usuarioId: usuarioId
        });
        res.status(201).json(nuevoVehiculo);
    }
    catch (er) {
        console.error(er);
        res.status(500).json({ msj: 'Error al guardar el vehículo' });
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
    const { id, marca, modelo, anio, vin, reporte, motor, transmision, traccion, combustible, llaves, kilometraje, tituloId, usuarioId } = req.body;
    try {
        const vehiculoEncontrado = await modeloVehiculo.findByPk(id, {
            include: ['ImagenVehiculos']
        });
        if (!vehiculoEncontrado) {
            return res.status(404).json({ msj: 'Vehículo no encontrado' });
        }

        // Verificar que no exista otro vehículo con el mismo VIN (si se está actualizando el VIN)
        if (vin && vin !== vehiculoEncontrado.vin) {
            const vehiculoConMismoVin = await modeloVehiculo.findOne({
                where: { vin: vin }
            });
            if (vehiculoConMismoVin) {
                return res.status(400).json({ msj: 'Ya existe otro vehículo registrado con ese VIN' });
            }
        }

        const vehiculoActualizado = await vehiculoEncontrado.update({
            marca: marca,
            modelo: modelo,
            anio: anio,
            vin: vin,
            reporte: reporte,
            motor: motor,
            transmision: transmision,
            traccion: traccion,
            combustible: combustible,
            llaves: llaves,
            kilometraje: kilometraje,
            tituloId: tituloId,
            usuarioId: usuarioId
        });
        res.json(vehiculoActualizado);
    }
    catch (er) {
        console.error(er);
        res.status(500).json({ msj: 'Error al actualizar el vehículo' });
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
        const vehiculoEncontrado = await modeloVehiculo.findByPk(id);
        if (!vehiculoEncontrado) {
            return res.status(404).json({ msj: 'Vehículo no encontrado' });
        }
        await vehiculoEncontrado.destroy();
        res.json({ msj: 'Vehículo eliminado' });
    }
    catch (er) {
        console.error(er);
        res.status(500).json({ msj: 'Error al eliminar el vehículo' });
    }
};
