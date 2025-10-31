const modeloCompraDirecta = require('../modelos/compradirecta');
const modeloVehiculo = require('../modelos/vehiculo');
const { validationResult } = require('express-validator');

exports.Listar = async (req, res) => {
    try {
        const lista = await modeloCompraDirecta.findAll({
            include: ['Usuario', 'Vehiculo']
        });
        res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar las compras directas' });
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
        const compras = await modeloCompraDirecta.findAll({
            where: { usuarioId: usuarioId },
            include: ['Vehiculo']
        });
        res.json(compras);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar las compras del usuario' });
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

    const { usuarioId, vehiculoId } = req.body;
    try {
        const vehiculo = await modeloVehiculo.findByPk(vehiculoId);
        if (!vehiculo) {
            return res.status(404).json({ msj: 'Vehículo no encontrado' });
        }
        
        if (!vehiculo.disponibleCompraDirecta) {
            return res.status(400).json({ msj: 'Este vehículo no está disponible para compra directa' });
        }

        if (!vehiculo.precioCompraDirecta) {
            return res.status(400).json({ msj: 'Este vehículo no tiene un precio de compra directa establecido' });
        }

        const nuevaCompra = await modeloCompraDirecta.create({
            precio: vehiculo.precioCompraDirecta,
            usuarioId: usuarioId,
            vehiculoId: vehiculoId
        });

        const compraConRelaciones = await modeloCompraDirecta.findByPk(nuevaCompra.id, {
            include: ['Usuario', 'Vehiculo']
        });
        
        res.status(201).json(compraConRelaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al procesar la compra directa' });
    }
};

exports.ActualizarEstado = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const data = errores.array().map(i => ({
            atributo: i.path,
            msj: i.msg
        }));
        return res.status(400).json({ msj: 'Hay errores', data: data });
    }

    const { id, estado, comprobantePago } = req.body;
    try {
        const compra = await modeloCompraDirecta.findByPk(id);
        if (!compra) {
            return res.status(404).json({ msj: 'Compra no encontrada' });
        }

        const actualizacion = {
            estado: estado
        };
        
        if (comprobantePago) {
            actualizacion.comprobantePago = comprobantePago;
        }

        await compra.update(actualizacion);

        if (estado === 'completada') {
            const vehiculo = await modeloVehiculo.findByPk(compra.vehiculoId);
            if (vehiculo) {
                await vehiculo.update({
                    disponibleCompraDirecta: false
                });
            }
        }

        res.json({ msj: 'Estado de compra actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al actualizar el estado de la compra' });
    }
};

exports.Cancelar = async (req, res) => {
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
        const compra = await modeloCompraDirecta.findByPk(id);
        if (!compra) {
            return res.status(404).json({ msj: 'Compra no encontrada' });
        }

        if (compra.estado === 'completada') {
            return res.status(400).json({ msj: 'No se puede cancelar una compra completada' });
        }

        await compra.update({
            estado: 'cancelada'
        });

        res.json({ msj: 'Compra cancelada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al cancelar la compra' });
    }
};