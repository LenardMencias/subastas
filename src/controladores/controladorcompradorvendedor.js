const ModeloCompradorVendedor = require('../modelos/CompradorVendedor');
const ModeloUsuario = require('../modelos/usuario');


exports.Guardar = async (req, res) => {
    try {
        const {
            identidad,
            primernombre,
            segundonombre,
            primerapellido,
            segundoapellido,
            telefono,
            direccion,
            correo,
            fechaNacimiento
        } = req.body;

        if (!identidad || !primernombre || !primerapellido || !telefono || !direccion || !correo || !fechaNacimiento) {
            return res.status(400).json({
                message: 'Faltan campos requeridos: identidad, primernombre, primerapellido, telefono, direccion, correo, fechaNacimiento'
            });
        }

        const identidadExistente = await ModeloCompradorVendedor.findOne({ where: { identidad } });
        if (identidadExistente) {
            return res.status(400).json({
                message: 'La identidad ya está registrada'
            });
        }

        const nuevoCompradorVendedor = await ModeloCompradorVendedor.create({
            identidad,
            primernombre,
            segundonombre,
            primerapellido,
            segundoapellido,
            telefono,
            direccion,
            correo,
            fechaNacimiento,
            usuarioId: null
        });

        res.status(201).json({
            message: 'Comprador/Vendedor creado exitosamente. Ahora puede crear un usuario y asociarlo.',
            compradorVendedor: nuevoCompradorVendedor
        });
    } catch (error) {
        console.error('Error al crear comprador/vendedor:', error);
        res.status(500).json({
            message: 'Error al crear comprador/vendedor',
            error: error.message
        });
    }
};

exports.Listar = async (req, res) => {
    try {
        const compradoresVendedores = await ModeloCompradorVendedor.findAll({
            include: [
                {
                    model: ModeloUsuario,
                    attributes: ['id', 'nombre', 'email', 'estado']
                }
            ],
            order: [['id', 'ASC']]
        });

        res.status(200).json({
            total: compradoresVendedores.length,
            compradoresVendedores
        });
    } catch (error) {
        console.error('Error al listar compradores/vendedores:', error);
        res.status(500).json({
            message: 'Error al listar compradores/vendedores',
            error: error.message
        });
    }
};

exports.Buscar = async (req, res) => {
    try {
        const { id } = req.query;

        const compradorVendedor = await ModeloCompradorVendedor.findByPk(id, {
            include: [
                {
                    model: ModeloUsuario,
                    attributes: ['id', 'nombre', 'email', 'estado']
                }
            ]
        });

        if (!compradorVendedor) {
            return res.status(404).json({ message: 'Comprador/Vendedor no encontrado' });
        }

        res.status(200).json(compradorVendedor);
    } catch (error) {
        console.error('Error al obtener comprador/vendedor:', error);
        res.status(500).json({
            message: 'Error al obtener comprador/vendedor',
            error: error.message
        });
    }
};

exports.Actualizar = async (req, res) => {
    try {
        const { id } = req.body;
        const {
            primernombre,
            segundonombre,
            primerapellido,
            segundoapellido,
            telefono,
            direccion,
            correo,
            fechaNacimiento
        } = req.body;

        const compradorVendedor = await ModeloCompradorVendedor.findByPk(id);
        if (!compradorVendedor) {
            return res.status(404).json({ message: 'Comprador/Vendedor no encontrado' });
        }

        if (primernombre) compradorVendedor.primernombre = primernombre;
        if (segundonombre !== undefined) compradorVendedor.segundonombre = segundonombre;
        if (primerapellido) compradorVendedor.primerapellido = primerapellido;
        if (segundoapellido !== undefined) compradorVendedor.segundoapellido = segundoapellido;
        if (telefono) compradorVendedor.telefono = telefono;
        if (direccion) compradorVendedor.direccion = direccion;
        if (correo) compradorVendedor.correo = correo;
        if (fechaNacimiento) compradorVendedor.fechaNacimiento = fechaNacimiento;

        await compradorVendedor.save();

        res.status(200).json({
            message: 'Comprador/Vendedor actualizado exitosamente',
            compradorVendedor
        });
    } catch (error) {
        console.error('Error al actualizar comprador/vendedor:', error);
        res.status(500).json({
            message: 'Error al actualizar comprador/vendedor',
            error: error.message
        });
    }
};


exports.Eliminar = async (req, res) => {
    try {
        const { id } = req.query;

        const compradorVendedor = await ModeloCompradorVendedor.findByPk(id);
        if (!compradorVendedor) {
            return res.status(404).json({ message: 'Comprador/Vendedor no encontrado' });
        }

        await compradorVendedor.destroy();

        res.status(200).json({
            message: 'Comprador/Vendedor eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar comprador/vendedor:', error);
        res.status(500).json({
            message: 'Error al eliminar comprador/vendedor',
            error: error.message
        });
    }
};
