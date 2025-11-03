const ModeloPermiso = require('../modelos/permisos');
const ModeloRol = require('../modelos/rol');

exports.Guardar = async (req, res) => {
    try {
        const { clave, nombre, descripcion } = req.body;

        if (!clave || !nombre) {
            return res.status(400).json({
                message: 'Faltan campos requeridos: clave, nombre'
            });
        }

        const claveExistente = await ModeloPermiso.findOne({ where: { clave } });
        if (claveExistente) {
            return res.status(400).json({
                message: 'La clave del permiso ya existe'
            });
        }

        const nuevoPermiso = await ModeloPermiso.create({
            clave,
            nombre,
            descripcion
        });

        res.status(201).json({
            message: 'Permiso creado exitosamente',
            permiso: nuevoPermiso
        });
    } catch (error) {
        console.error('Error al crear permiso:', error);
        res.status(500).json({
            message: 'Error al crear permiso',
            error: error.message
        });
    }
};

exports.Listar = async (req, res) => {
    try {
        const permisos = await ModeloPermiso.findAll({
            order: [['clave', 'ASC']]
        });

        res.status(200).json({
            total: permisos.length,
            permisos
        });
    } catch (error) {
        console.error('Error al listar permisos:', error);
        res.status(500).json({
            message: 'Error al listar permisos',
            error: error.message
        });
    }
};

exports.Buscar = async (req, res) => {
    try {
        const { id } = req.query;

        const permiso = await ModeloPermiso.findByPk(id);

        if (!permiso) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }

        res.status(200).json(permiso);
    } catch (error) {
        console.error('Error al obtener permiso:', error);
        res.status(500).json({
            message: 'Error al obtener permiso',
            error: error.message
        });
    }
};


exports.Actualizar = async (req, res) => {
    try {
        const { id } = req.body;
        const { nombre, descripcion } = req.body;

        const permiso = await ModeloPermiso.findByPk(id);
        if (!permiso) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }

        if (nombre) permiso.nombre = nombre;
        if (descripcion !== undefined) permiso.descripcion = descripcion;

        await permiso.save();

        res.status(200).json({
            message: 'Permiso actualizado exitosamente',
            permiso
        });
    } catch (error) {
        console.error('Error al actualizar permiso:', error);
        res.status(500).json({
            message: 'Error al actualizar permiso',
            error: error.message
        });
    }
};

exports.Eliminar = async (req, res) => {
    try {
        const { id } = req.query;

        const permiso = await ModeloPermiso.findByPk(id);
        if (!permiso) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }

        await permiso.destroy();

        res.status(200).json({
            message: 'Permiso eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar permiso:', error);
        res.status(500).json({
            message: 'Error al eliminar permiso',
            error: error.message
        });
    }
};

exports.AsignarARol = async (req, res) => {
    try {
        const { permisoId, rolId } = req.body;

        if (!permisoId || !rolId) {
            return res.status(400).json({
                message: 'Faltan campos requeridos: permisoId, rolId'
            });
        }

        const permiso = await ModeloPermiso.findByPk(permisoId);
        if (!permiso) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }

        const rol = await ModeloRol.findByPk(rolId);
        if (!rol) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        await rol.addPermiso(permiso);

        res.status(200).json({
            message: 'Permiso asignado al rol exitosamente'
        });
    } catch (error) {
        console.error('Error al asignar permiso:', error);
        res.status(500).json({
            message: 'Error al asignar permiso',
            error: error.message
        });
    }
};

exports.RemoverDeRol = async (req, res) => {
    try {
        const { permisoId, rolId } = req.body;

        if (!permisoId || !rolId) {
            return res.status(400).json({
                message: 'Faltan campos requeridos: permisoId, rolId'
            });
        }

        const permiso = await ModeloPermiso.findByPk(permisoId);
        if (!permiso) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }

        const rol = await ModeloRol.findByPk(rolId);
        if (!rol) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        await rol.removePermiso(permiso);

        res.status(200).json({
            message: 'Permiso removido del rol exitosamente'
        });
    } catch (error) {
        console.error('Error al remover permiso:', error);
        res.status(500).json({
            message: 'Error al remover permiso',
            error: error.message
        });
    }
};
