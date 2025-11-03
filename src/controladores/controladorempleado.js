const ModeloEmpleado = require('../modelos/empleado');
const ModeloUsuario = require('../modelos/usuario');

exports.Guardar = async (req, res) => {
    try {
        const { nombre, direccion, telefono } = req.body;

        if (!nombre || !direccion || !telefono) {
            return res.status(400).json({
                message: 'Faltan campos requeridos: nombre, direccion, telefono'
            });
        }

        const nuevoEmpleado = await ModeloEmpleado.create({
            nombre,
            direccion,
            telefono,
            usuarioId: null
        });

        res.status(201).json({
            message: 'Empleado creado exitosamente. Ahora puede crear un usuario y asociarlo.',
            empleado: nuevoEmpleado
        });
    } catch (error) {
        console.error('Error al crear empleado:', error);
        res.status(500).json({
            message: 'Error al crear empleado',
            error: error.message
        });
    }
};

exports.Listar = async (req, res) => {
    try {
        const empleados = await ModeloEmpleado.findAll({
            include: [
                {
                    model: ModeloUsuario,
                    attributes: ['id', 'nombre', 'email', 'estado']
                }
            ],
            order: [['id', 'ASC']]
        });

        res.status(200).json({
            total: empleados.length,
            empleados
        });
    } catch (error) {
        console.error('Error al listar empleados:', error);
        res.status(500).json({
            message: 'Error al listar empleados',
            error: error.message
        });
    }
};

exports.Buscar = async (req, res) => {
    try {
        const { id } = req.query;

        const empleado = await ModeloEmpleado.findByPk(id, {
            include: [
                {
                    model: ModeloUsuario,
                    attributes: ['id', 'nombre', 'email', 'estado']
                }
            ]
        });

        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        res.status(200).json(empleado);
    } catch (error) {
        console.error('Error al obtener empleado:', error);
        res.status(500).json({
            message: 'Error al obtener empleado',
            error: error.message
        });
    }
};

exports.Actualizar = async (req, res) => {
    try {
        const { id } = req.body;
        const { nombre, direccion, telefono } = req.body;

        const empleado = await ModeloEmpleado.findByPk(id);
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        if (nombre) empleado.nombre = nombre;
        if (direccion) empleado.direccion = direccion;
        if (telefono) empleado.telefono = telefono;

        await empleado.save();

        res.status(200).json({
            message: 'Empleado actualizado exitosamente',
            empleado
        });
    } catch (error) {
        console.error('Error al actualizar empleado:', error);
        res.status(500).json({
            message: 'Error al actualizar empleado',
            error: error.message
        });
    }
};

exports.Eliminar = async (req, res) => {
    try {
        const { id } = req.query;

        const empleado = await ModeloEmpleado.findByPk(id);
        if (!empleado) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        await empleado.destroy();

        res.status(200).json({
            message: 'Empleado eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        res.status(500).json({
            message: 'Error al eliminar empleado',
            error: error.message
        });
    }
};
