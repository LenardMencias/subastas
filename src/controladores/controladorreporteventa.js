// Controlador de Reporte de Venta
const ModeloUsuario = require('../modelos/usuario');
const ModeloVehiculo = require('../modelos/vehiculo');
const ModeloVentas = require('../modelos/ventas');
const ModeloReporteVenta = require('../modelos/reporteventa');

// Crear un nuevo reporte de venta
exports.Guardar = async (req, res) => {
    try {
        const { descripcion, vehiculoId, usuarioId } = req.body;
        const nuevoReporte = await ModeloReporteVenta.create({
            descripcion,
            vehiculoId,
            usuarioId
        });
        res.status(201).json(nuevoReporte);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear el reporte de venta' });
    }
};
// Obtener todos los reportes de venta
exports.Listar = async (req, res) => {
    try {
        const reportes = await ModeloReporteVenta.findAll({
            include: [
                { model: ModeloVehiculo, as: 'vehiculo' },
                { model: ModeloUsuario, as: 'usuario' }
            ]
        });
        res.status(200).json(reportes);
    }   
    catch (error) {
        res.status(500).json({ error: 'Error al obtener los reportes de venta' });
    }
};
