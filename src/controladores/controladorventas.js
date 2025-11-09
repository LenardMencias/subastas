const ModeloVentas = require('../modelos/ventas');
const ModeloVehiculo = require('../modelos/vehiculo');
const ModeloTiempo = require('../modelos/tiempo');
const ModeloCompradorVendedor = require('../modelos/CompradorVendedor');
const ModeloVentaParticipante = require('../modelos/ventaparticipante');

exports.Guardar = async (req, res) => {
    try {
        const { tipo, montoBase, vehiculoId, tiempoId } = req.body;

        if (!tipo || !montoBase || !vehiculoId) {
            return res.status(400).json({
                message: 'Faltan campos requeridos: tipo, montoBase, vehiculoId'
            });
        }

        if (!['apuesta', 'compra_directa'].includes(tipo)) {
            return res.status(400).json({
                message: 'Tipo de venta inválido. Use: apuesta o compra_directa'
            });
        }

        if (tipo === 'apuesta' && !tiempoId) {
            return res.status(400).json({
                message: 'Las ventas de tipo apuesta requieren un tiempoId'
            });
        }

        const nuevaVenta = await ModeloVentas.create({
            tipo,
            montoBase,
            vehiculoId,
            tiempoId,
            estado: 'abierta'
        });

        res.status(201).json({
            message: 'Venta creada exitosamente',
            venta: nuevaVenta
        });
    } catch (error) {
        console.error('Error al crear venta:', error);
        res.status(500).json({
            message: 'Error al crear la venta',
            error: error.message
        });
    }
};

exports.AgregarParticipante = async (req, res) => {
    try {
        const { ventaId } = req.body;
        const { compradorVendedorId, montoOferta, comentario } = req.body;

        if (!compradorVendedorId || !montoOferta) {
            return res.status(400).json({
                message: 'Faltan campos requeridos: compradorVendedorId, montoOferta'
            });
        }

        const venta = await ModeloVentas.findByPk(ventaId);
        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        if (venta.estado !== 'abierta') {
            return res.status(400).json({
                message: `No se pueden agregar participantes a una venta con estado: ${venta.estado}`
            });
        }

        if (parseFloat(montoOferta) < parseFloat(venta.montoBase)) {
            return res.status(400).json({
                message: `El monto ofertado debe ser mayor o igual al monto base: ${venta.montoBase}`
            });
        }

        const compradorVendedor = await ModeloCompradorVendedor.findByPk(compradorVendedorId);
        if (!compradorVendedor) {
            return res.status(404).json({ message: 'Comprador/Vendedor no encontrado' });
        }

        const participanteExistente = await ModeloVentaParticipante.findOne({
            where: { ventaId, compradorVendedorId }
        });

        if (participanteExistente) {
            if (parseFloat(montoOferta) > parseFloat(participanteExistente.montoOferta)) {
                participanteExistente.montoOferta = montoOferta;
                participanteExistente.comentario = comentario || participanteExistente.comentario;
                participanteExistente.fechaParticipacion = new Date();
                await participanteExistente.save();

                return res.status(200).json({
                    message: 'Oferta actualizada exitosamente',
                    participante: participanteExistente
                });
            } else {
                return res.status(400).json({
                    message: 'La nueva oferta debe ser mayor a la oferta actual'
                });
            }
        }

        const nuevoParticipante = await ModeloVentaParticipante.create({
            ventaId,
            compradorVendedorId,
            montoOferta,
            comentario,
            estadoParticipacion: 'activo'
        });

        res.status(201).json({
            message: 'Participante agregado exitosamente',
            participante: nuevoParticipante
        });
    } catch (error) {
        console.error('Error al agregar participante:', error);
        res.status(500).json({
            message: 'Error al agregar participante',
            error: error.message
        });
    }
};

exports.Listar = async (req, res) => {
    try {
        const { tipo, estado } = req.query;

        const filtros = {};
        if (tipo) filtros.tipo = tipo;
        if (estado) filtros.estado = estado;

        const ventas = await ModeloVentas.findAll({
            where: filtros,
            include: [
                { 
                    model: ModeloVehiculo, 
                    attributes: ['id', 'marca', 'modelo', 'year', 'precio'] 
                },
                { 
                    model: ModeloTiempo, 
                    as: 'tiempo',
                    attributes: ['id', 'duracion'], 
                    required: false 
                },
                {
                    model: ModeloVentaParticipante,
                    as: 'listaParticipantes',
                    include: [
                        {
                            model: ModeloCompradorVendedor,
                            attributes: ['id', 'primernombre', 'primerapellido', 'correo']
                        }
                    ],
                    order: [['montoOferta', 'DESC']]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            total: ventas.length,
            ventas
        });
    } catch (error) {
        console.error('Error al listar ventas:', error);
        res.status(500).json({
            message: 'Error al listar ventas',
            error: error.message
        });
    }
};

exports.Buscar = async (req, res) => {
    try {
        const { id } = req.query;

        const venta = await ModeloVentas.findByPk(id, {
            include: [
                { model: ModeloVehiculo },
                { model: ModeloTiempo, as: 'tiempo', required: false },
                {
                    model: ModeloVentaParticipante,
                    as: 'listaParticipantes',
                    include: [
                        {
                            model: ModeloCompradorVendedor,
                            attributes: ['id', 'primernombre', 'primerapellido', 'correo', 'telefono']
                        }
                    ],
                    order: [['montoOferta', 'DESC']]
                }
            ]
        });

        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        res.status(200).json(venta);
    } catch (error) {
        console.error('Error al obtener venta:', error);
        res.status(500).json({
            message: 'Error al obtener la venta',
            error: error.message
        });
    }
};

exports.CerrarVenta = async (req, res) => {
    try {
        const { id } = req.body;
        const { ganadorId } = req.body;

        const venta = await ModeloVentas.findByPk(id, {
            include: [
                {
                    model: ModeloVentaParticipante,
                    as: 'listaParticipantes'
                }
            ]
        });

        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        if (venta.estado === 'cerrada') {
            return res.status(400).json({ message: 'La venta ya está cerrada' });
        }
        let participanteGanador;
        if (ganadorId) {
            participanteGanador = await ModeloVentaParticipante.findOne({
                where: { ventaId: id, compradorVendedorId: ganadorId }
            });
        } else {
            participanteGanador = await ModeloVentaParticipante.findOne({
                where: { ventaId: id },
                order: [['montoOferta', 'DESC']]
            });
        }

        if (!participanteGanador) {
            return res.status(400).json({ 
                message: 'No se encontró un ganador. Asegúrese de que haya al menos un participante.' 
            });
        }

        participanteGanador.esGanador = true;
        participanteGanador.estadoParticipacion = 'ganador';
        await participanteGanador.save();

        await ModeloVentaParticipante.update(
            { estadoParticipacion: 'perdedor' },
            { 
                where: { 
                    ventaId: id, 
                    compradorVendedorId: { [require('sequelize').Op.ne]: participanteGanador.compradorVendedorId } 
                } 
            }
        );

        venta.estado = 'cerrada';
        venta.montoFinal = participanteGanador.montoOferta;
        await venta.save();

        res.status(200).json({
            message: 'Venta cerrada exitosamente',
            venta,
            ganador: participanteGanador
        });
    } catch (error) {
        console.error('Error al cerrar venta:', error);
        res.status(500).json({
            message: 'Error al cerrar la venta',
            error: error.message
        });
    }
};
exports.Cancelar = async (req, res) => {
    try {
        const { id } = req.query;

        const venta = await ModeloVentas.findByPk(id);
        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        if (venta.estado === 'cerrada') {
            return res.status(400).json({ 
                message: 'No se puede cancelar una venta ya cerrada' 
            });
        }

        venta.estado = 'cancelada';
        await venta.save();

        await ModeloVentaParticipante.update(
            { estadoParticipacion: 'retirado' },
            { where: { ventaId: id } }
        );

        res.status(200).json({
            message: 'Venta cancelada exitosamente',
            venta
        });
    } catch (error) {
        console.error('Error al cancelar venta:', error);
        res.status(500).json({
            message: 'Error al cancelar la venta',
            error: error.message
        });
    }
};

exports.Estadisticas = async (req, res) => {
    try {
        const { tipo } = req.query;
        const filtros = tipo ? { tipo } : {};

        const total = await ModeloVentas.count({ where: filtros });
        const abiertas = await ModeloVentas.count({ where: { ...filtros, estado: 'abierta' } });
        const cerradas = await ModeloVentas.count({ where: { ...filtros, estado: 'cerrada' } });
        const canceladas = await ModeloVentas.count({ where: { ...filtros, estado: 'cancelada' } });

        const montoTotal = await ModeloVentas.sum('montoFinal', { 
            where: { ...filtros, estado: 'cerrada' } 
        }) || 0;

        res.status(200).json({
            total,
            estadisticas: { abiertas, cerradas, canceladas },
            montoTotalVentas: parseFloat(montoTotal).toFixed(2)
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};
