// Controlador de Notificación
const ModeloNotificacion = require('../modelos/notificacion');

exports.Guardar = async (req, res) => {
    try {
        const { mensaje, usuarioId } = req.body;    
        const nuevaNotificacion = await ModeloNotificacion.create({
            mensaje,
            usuarioId
        });
        res.status(201).json(nuevaNotificacion);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear la notificación' });
    }
};
exports.Listar = async (req, res) => {
    try {
        const notificaciones = await ModeloNotificacion.findAll(); 
        res.status(200).json(notificaciones);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener las notificaciones' });
    }  
};