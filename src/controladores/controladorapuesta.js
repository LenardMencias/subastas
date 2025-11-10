// Controlador de Apuesta
const modeloApuesta = require('../modelos/apuesta');
const modeloTiempo = require('../modelos/tiempo');
const { validationResult } = require('express-validator');
const sendEmail = require('../modelos/notificacion');
const { Sequelize } = require('sequelize');
const modeloUsuarios = require('../modelos/usuario');
const modeloVehiculos = require('../modelos/vehiculo');
const vehiculo = require('../modelos/vehiculo');

exports.Listar = async (req, res) => {
    try {
        const lista = await modeloApuesta.findAll({
            include: ['Usuario', 'Vehiculo', 'Tiempo']
        });
        res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar las apuestas' });
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
        const apuestas = await modeloApuesta.findAll({
            where: { vehiculoId: vehiculoId },
            include: ['Usuario', 'Vehiculo', 'Tiempo']
        });
        res.json(apuestas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar las apuestas del vehículo' });
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
        const apuestas = await modeloApuesta.findAll({
            where: { usuarioId: usuarioId },
            include: ['Vehiculo', 'Usuario', 'Tiempo']
        });
        res.json(apuestas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar las apuestas del usuario' });
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

    const { monto, usuarioId, vehiculoId, tiempoId } = req.body;
    
    try {
        // 🚗 VALIDAR QUE EL VEHÍCULO ESTÉ DISPONIBLE
        const vehiculo = await modeloVehiculos.findByPk(vehiculoId);
        if (!vehiculo) {
            return res.status(404).json({ msj: 'Vehículo no encontrado' });
        }
        
        // Verificar si el vehículo ya fue vendido o no está disponible
        if (vehiculo.disponibleCompraDirecta === false) {
            return res.status(400).json({ 
                msj: 'Este vehículo ya no está disponible para subastas o compra directa' 
            });
        }
        
        // Verificar si ya hay una subasta activa para este vehículo
        const apuestaExistente = await modeloApuesta.findOne({
            where: { 
                vehiculoId: vehiculoId,
                estado: 'activa'
            }
        });
        
        if (apuestaExistente) {
            // Permitir más apuestas en la misma subasta activa
            console.log('Agregando apuesta a subasta existente');
        }

        // Obtener empleado (usar el primero disponible)
        const [empleados] = await modeloApuesta.sequelize.query('SELECT id FROM empleados LIMIT 1');
        const empleadoId = empleados[0]?.id || 1;

        // Crear apuesta - los hooks del modelo se encargarán de calcular fechaInicio y fechaFin
        const nuevaApuesta = await modeloApuesta.create({
            monto: monto,
            usuarioId: usuarioId,
            vehiculoId: vehiculoId,
            empleadoId: empleadoId,
            tiempoId: tiempoId, // Incluir el tiempoId para que el hook lo use
            estado: 'activa',
            ganador: false
        });

        res.status(201).json({
            mensaje: 'Apuesta creada exitosamente',
            apuesta: nuevaApuesta
        });

    } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({ 
            msj: 'Error al guardar la apuesta',
            error: error.message 
        });
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

    const { id, estado, ganador } = req.body;
    try {
        const apuestaEncontrada = await modeloApuesta.findByPk(id);
        if (!apuestaEncontrada) {
            return res.status(404).json({ msj: 'Apuesta no encontrada' });
        }

        const apuestaActualizada = await apuestaEncontrada.update({
            estado: estado,
            ganador: ganador
        });

        const apuestaConRelaciones = await modeloApuesta.findByPk(id, {
            include: ['Usuario', 'Vehiculo', 'Tiempo']
        });

        res.json(apuestaConRelaciones);
        const mensaje = `Se ha actualizado la subasta de el vehículo: ${apuestaConRelaciones.Vehiculo.marca} ${apuestaConRelaciones.Vehiculo.modelo} po el monto de: $${monto} la subasta finalizara el ${apuestaConRelaciones.fechaFin}.`;

        sendEmail('lenardrjc@gmail.com', 'Subasta', mensaje);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al actualizar la apuesta' });
    }
};

exports.FinalizarApuesta = async (req, res) => {
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
        const apuesta = await modeloApuesta.findByPk(id);
        if (!apuesta) {
            return res.status(404).json({ msj: 'Apuesta no encontrada' });
        }

        if (apuesta.estado !== 'activa') {
            return res.status(400).json({ msj: 'La apuesta ya no está activa' });
        }

        await apuesta.update({
            estado: 'finalizada',
            fechaFin: new Date()
        });

        res.json({ msj: 'Apuesta finalizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al finalizar la apuesta' });
    }
};

// Método para listar los tiempos disponibles
exports.ListarTiempos = async (req, res) => {
    try {
        const tiempos = await modeloTiempo.findAll({
            where: { activo: true },
            attributes: ['id', 'duracion', 'descripcion']
        });
        res.json(tiempos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msj: 'Error al listar los tiempos disponibles' });
    }
};

// Finalizar subasta y determinar ganador
exports.FinalizarSubasta = async (req, res) => {
    try {
        const { vehiculoId } = req.body;
        
        if (!vehiculoId) {
            return res.status(400).json({ msj: 'vehiculoId es requerido' });
        }

        // Obtener todas las apuestas activas para el vehículo
        const apuestas = await modeloApuesta.findAll({
            where: { 
                vehiculoId: vehiculoId,
                estado: 'activa'
            },
            include: ['Usuario', 'Vehiculo'],
            order: [['monto', 'DESC']]
        });

        if (apuestas.length === 0) {
            return res.status(404).json({ msj: 'No hay apuestas activas para este vehículo' });
        }

        // El ganador es quien tiene la apuesta más alta
        const apuestaGanadora = apuestas[0];
        
        // Marcar al ganador
        await modeloApuesta.update(
            { ganador: true, estado: 'finalizada' },
            { where: { id: apuestaGanadora.id } }
        );

        // Marcar el resto como finalizadas sin ganador
        const idsOtrasApuestas = apuestas.slice(1).map(apuesta => apuesta.id);
        if (idsOtrasApuestas.length > 0) {
            await modeloApuesta.update(
                { ganador: false, estado: 'finalizada' },
                { where: { id: idsOtrasApuestas } }
            );
        }

        // Obtener información completa del ganador
        const ganador = await modeloApuesta.findByPk(apuestaGanadora.id, {
            include: ['Usuario', 'Vehiculo', 'Tiempo']
        });

        // 🚗 MARCAR EL VEHÍCULO COMO NO DISPONIBLE
        await modeloVehiculos.update(
            { 
                disponibleCompraDirecta: false 
            },
            { 
                where: { id: vehiculoId } 
            }
        );

        res.json({
            msj: '¡Subasta finalizada exitosamente! El vehículo ya no está disponible.',
            ganador: {
                apuestaId: ganador.id,
                usuario: ganador.Usuario.nombre,
                email: ganador.Usuario.email,
                monto: ganador.monto,
                vehiculo: `${ganador.Vehiculo.marca} ${ganador.Vehiculo.modelo}`,
                fechaFinalizacion: new Date()
            },
            totalParticipantes: apuestas.length,
            resumenApuestas: apuestas.map(a => ({
                usuario: a.Usuario.nombre,
                monto: a.monto,
                esGanador: a.id === apuestaGanadora.id
            })),
            vehiculoEstado: 'No disponible para futuras transacciones'
        });

    } catch (error) {
        console.error('Error al finalizar subasta:', error);
        res.status(500).json({ msj: 'Error interno del servidor' });
    }
};

exports.VerificarSubastasVencidas = async (req, res) => {
    try {
        const ahora = new Date();
        
        const apuestasVencidas = await modeloApuesta.findAll({
            where: {
                estado: 'activa',
                fechaFin: { [Sequelize.Op.lt]: ahora }
            },
            include: ['Usuario', 'Vehiculo'],
            order: [['vehiculoId', 'ASC'], ['monto', 'DESC']]
        });

        if (apuestasVencidas.length === 0) {
            return res.json({ msj: 'No hay subastas vencidas', subastasFinalizadas: [] });
        }

        // Agrupar por vehículo
        const subastasFinalizadas = [];
        const vehiculosProcessed = new Set();
        
        for (const apuesta of apuestasVencidas) {
            if (!vehiculosProcessed.has(apuesta.vehiculoId)) {
                vehiculosProcessed.add(apuesta.vehiculoId);
                
                // Obtener todas las apuestas de este vehículo
                const apuestasVehiculo = apuestasVencidas.filter(a => a.vehiculoId === apuesta.vehiculoId);
                const ganadora = apuestasVehiculo[0]; // Ya están ordenadas por monto DESC
                
                // Marcar ganador
                await modeloApuesta.update(
                    { ganador: true, estado: 'finalizada' },
                    { where: { id: ganadora.id } }
                );
                
                // Marcar perdedores
                const perdedores = apuestasVehiculo.slice(1);
                if (perdedores.length > 0) {
                    await modeloApuesta.update(
                        { ganador: false, estado: 'finalizada' },
                        { where: { id: perdedores.map(p => p.id) } }
                    );
                }
                
                // 🚗 MARCAR EL VEHÍCULO COMO NO DISPONIBLE
                await modeloVehiculos.update(
                    { 
                        disponibleCompraDirecta: false 
                    },
                    { 
                        where: { id: ganadora.vehiculoId } 
                    }
                );
                
                subastasFinalizadas.push({
                    vehiculo: `${ganadora.Vehiculo.marca} ${ganadora.Vehiculo.modelo}`,
                    ganador: ganadora.Usuario.nombre,
                    montoGanador: ganadora.monto,
                    totalParticipantes: apuestasVehiculo.length,
                    fechaVencimiento: apuesta.fechaFin,
                    vehiculoEstado: 'No disponible para futuras transacciones'
                });
            }
        }

        res.json({
            msj: `Se finalizaron ${subastasFinalizadas.length} subastas automáticamente`,
            subastasFinalizadas: subastasFinalizadas
        });

    } catch (error) {
        console.error('Error al verificar subastas vencidas:', error);
        res.status(500).json({ msj: 'Error interno del servidor' });
    }
};

// Obtener estadísticas de una subasta
exports.EstadisticasSubasta = async (req, res) => {
    try {
        const { vehiculoId } = req.params;
        
        const apuestas = await modeloApuesta.findAll({
            where: { vehiculoId: vehiculoId },
            include: ['Usuario', 'Vehiculo'],
            order: [['monto', 'DESC']]
        });

        if (apuestas.length === 0) {
            return res.status(404).json({ msj: 'No se encontraron apuestas para este vehículo' });
        }

        const vehiculo = apuestas[0].Vehiculo;
        const apuestaMaxima = Math.max(...apuestas.map(a => a.monto));
        const apuestaMinima = Math.min(...apuestas.map(a => a.monto));
        const montoTotal = apuestas.reduce((sum, a) => sum + parseFloat(a.monto), 0);
        const apuestasActivas = apuestas.filter(a => a.estado === 'activa');
        const tiempoRestante = apuestasActivas.length > 0 ? 
            Math.max(0, new Date(apuestasActivas[0].fechaFin) - new Date()) : 0;

        res.json({
            vehiculo: `${vehiculo.marca} ${vehiculo.modelo}`,
            estadisticas: {
                totalParticipantes: apuestas.length,
                apuestasActivas: apuestasActivas.length,
                apuestaMaxima: apuestaMaxima,
                apuestaMinima: apuestaMinima,
                montoTotal: montoTotal,
                montoPromedio: montoTotal / apuestas.length,
                tiempoRestante: Math.floor(tiempoRestante / 60000), // en minutos
                estado: apuestasActivas.length > 0 ? 'activa' : 'finalizada'
            },
            ranking: apuestas.map((apuesta, index) => ({
                posicion: index + 1,
                usuario: apuesta.Usuario.nombre,
                monto: apuesta.monto,
                estado: apuesta.estado,
                esGanador: apuesta.ganador,
                fechaApuesta: apuesta.createdAt
            }))
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ msj: 'Error interno del servidor' });
    }
};
