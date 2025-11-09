// Controlador de Revisión de Compra
const ModeloRevisionCompra = require('../modelos/revisioncompra');
const ModeloUsuario = require('../modelos/usuario');
const ModeloVehiculo = require('../modelos/vehiculo');

exports.Guardar = async (req, res) => {
    try {
        const { comentarios, aprobado, vehiculoId, usuarioId } = req.body;
        const nuevaRevision = await ModeloRevisionCompra.create({
            comentarios,
            aprobado,
            vehiculoId,
            usuarioId
        });
        res.status(201).json(nuevaRevision);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear la revisión de compra' });
    }
};
exports.Listar = async (req, res) => {
    try {
        const revisiones = await ModeloRevisionCompra.findAll({ 
            include: [
                { model: ModeloVehiculo, as: 'vehiculo' },
                { model: ModeloUsuario, as: 'usuario' }
            ]
        });
        res.status(200).json(revisiones);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener las revisiones de compra' });
    }
};

exports.Actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { comentarios, aprobado } = req.body;
        const revision = await ModeloRevisionCompra.findByPk(id);
        if (!revision) {
            return res.status(404).json({ error: 'Revisión de compra no encontrada' });
        }
        revision.comentarios = comentarios;
        revision.aprobado = aprobado;
        await revision.save();
        res.status(200).json(revision);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar la revisión de compra' });
    }
};
exports.Eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const revision = await ModeloRevisionCompra.findByPk(id);
        if (!revision) {
            return res.status(404).json({ error: 'Revisión de compra no encontrada' });
        }
        await revision.destroy();
        res.status(200).json({ message: 'Revisión de compra eliminada correctamente' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar la revisión de compra' });
    }
};