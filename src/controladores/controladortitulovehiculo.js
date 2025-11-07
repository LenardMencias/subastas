// Controlador de TituloVehiculo
const modeloTituloVehiculo = require('../modelos/titulovehiculo');
const modeloVehiculo = require('../modelos/vehiculo');
const { validationResult } = require('express-validator');


exports.Listar = async (req, res) => {
    try {
        const lista = await modeloTituloVehiculo.findAll({
            include: [{
                model: modeloVehiculo,
                as: 'Vehiculo'
            }]
        });
        res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar los títulos de vehículos' });
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
        const titulos = await modeloTituloVehiculo.findAll({
            where: { vehiculoId: vehiculoId },
            include: [{
                model: modeloVehiculo,
                as: 'Vehiculo'
            }]
        });
        res.json(titulos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar los títulos del vehículo' });
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
        const tituloEncontrado = await modeloTituloVehiculo.findByPk(id, {
            include: [{
                model: modeloVehiculo,
                as: 'Vehiculo'
            }]
        });
        if (!tituloEncontrado) {
            return res.status(404).json({ msj: 'Título no encontrado' });
        }
        res.json(tituloEncontrado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al buscar el título' });
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

    const {
        numeroTitulo,
        fechaEmision,
        fechaVencimiento,
        estado,
        propietarioRegistrado,
        documentoPropietario,
        certificadoRegistro,
        certificadoVerificacion,
        polizaSeguro,
        placas,
        observaciones,
        vehiculoId
    } = req.body;

    try {
        const vehiculoExiste = await modeloVehiculo.findByPk(vehiculoId);
        if (!vehiculoExiste) {
            return res.status(404).json({ msj: 'El vehículo especificado no existe' });
        }

        const tituloExiste = await modeloTituloVehiculo.findOne({
            where: { numeroTitulo: numeroTitulo }
        });
        if (tituloExiste) {
            return res.status(400).json({ msj: 'Ya existe un título con ese número' });
        }

        if (placas) {
            const placaExiste = await modeloTituloVehiculo.findOne({
                where: { placa: placas.toUpperCase() }
            });
            if (placaExiste) {
                return res.status(400).json({ msj: 'Ya existe un título con esa placa registrada' });
            }
        }

        const nuevoTitulo = await modeloTituloVehiculo.create({
            numeroTitulo,
            fechaEmision,
            fechaVencimiento,
            estado,
            propietarioRegistrado,
            documentoPropietario,
            certificadoRegistro,
            certificadoVerificacion,
            polizaSeguro,
            placa: placas ? placas.toUpperCase() : null,
            observaciones,
            vehiculoId
        });

        const tituloConRelaciones = await modeloTituloVehiculo.findByPk(nuevoTitulo.id, {
            include: [{
                model: modeloVehiculo,
                as: 'Vehiculo'
            }]
        });

        res.status(201).json(tituloConRelaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al guardar el título', error: error.message });
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

    const { id, ...datosActualizacion } = req.body;

    try {
        const tituloEncontrado = await modeloTituloVehiculo.findByPk(id);
        if (!tituloEncontrado) {
            return res.status(404).json({ msj: 'Título no encontrado' });
        }

        if (datosActualizacion.numeroTitulo && datosActualizacion.numeroTitulo !== tituloEncontrado.numeroTitulo) {
            const tituloConMismoNumero = await modeloTituloVehiculo.findOne({
                where: { numeroTitulo: datosActualizacion.numeroTitulo }
            });
            if (tituloConMismoNumero) {
                return res.status(400).json({ msj: 'Ya existe un título con ese número' });
            }
        }

        if (datosActualizacion.placas) {
            const placaUpper = datosActualizacion.placas.toUpperCase();
            if (placaUpper !== tituloEncontrado.placa) {
                const tituloConMismaPlaca = await modeloTituloVehiculo.findOne({
                    where: { placa: placaUpper }
                });
                if (tituloConMismaPlaca) {
                    return res.status(400).json({ msj: 'Ya existe un título con esa placa registrada' });
                }
            }
            datosActualizacion.placa = placaUpper;
            delete datosActualizacion.placas;
        }

        const tituloActualizado = await tituloEncontrado.update(datosActualizacion);

        const tituloConRelaciones = await modeloTituloVehiculo.findByPk(id, {
            include: [{
                model: modeloVehiculo,
                as: 'Vehiculo'
            }]
        });

        res.json(tituloConRelaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al actualizar el título', error: error.message });
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
        const tituloEncontrado = await modeloTituloVehiculo.findByPk(id);
        if (!tituloEncontrado) {
            return res.status(404).json({ msj: 'Título no encontrado' });
        }

        await tituloEncontrado.destroy();
        res.json({ msj: 'Título eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al eliminar el título' });
    }
};
