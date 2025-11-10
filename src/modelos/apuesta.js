// Modelo de Apuesta
const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const empleado = require('./empleado');
const Vehiculo = require('./vehiculo');
const Usuario = require('./usuario');
const Tiempo = require('./tiempo');

const Apuesta = db.define('Apuesta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    estado: {
        type: DataTypes.ENUM('activa', 'finalizada', 'cancelada'),
        allowNull: false,
        defaultValue: 'activa'
    },
    fechaInicio: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    fechaFin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    ganador: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    empleadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: empleado,
            key: 'id'
        }
    },
    vehiculoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Vehiculo,
            key: 'id'
        }
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    tiempoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Tiempo,
            key: 'id'
        }
    }

}, {
    tableName: 'apuestas',
    timestamps: true,
    hooks: {
        beforeValidate: async (apuesta) => {
            try {
                // Establecer fecha de inicio si no existe
                if (!apuesta.fechaInicio) {
                    apuesta.fechaInicio = new Date();
                }

                // Calcular fecha de finalización basada en el tiempo
                if (apuesta.tiempoId) {
                    const Tiempo = require('./tiempo');
                    const tiempo = await Tiempo.findByPk(apuesta.tiempoId);
                    if (tiempo) {
                        const duracionMinutos = tiempo.duracion;
                        apuesta.fechaFin = new Date(apuesta.fechaInicio.getTime() + (duracionMinutos * 60000));
                    } else {
                        // Tiempo por defecto si no se encuentra el tiempo especificado
                        apuesta.fechaFin = new Date(apuesta.fechaInicio.getTime() + (300 * 60000));
                    }
                } else {
                    // Tiempo por defecto de 5 horas (300 minutos) si no se especifica tiempoId
                    apuesta.fechaFin = new Date(apuesta.fechaInicio.getTime() + (300 * 60000));
                }
            } catch (error) {
                console.error('Error en hook beforeValidate:', error);
                // En caso de error, usar tiempo por defecto
                apuesta.fechaFin = new Date(apuesta.fechaInicio.getTime() + (300 * 60000));
            }
        }
    }
});

Apuesta.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasMany(Apuesta, { foreignKey: 'usuarioId' });

Apuesta.belongsTo(Vehiculo, { foreignKey: 'vehiculoId' });
Vehiculo.hasMany(Apuesta, { foreignKey: 'vehiculoId' });

Apuesta.belongsTo(Tiempo, { foreignKey: 'tiempoId' });
Tiempo.hasMany(Apuesta, { foreignKey: 'tiempoId' });

module.exports = Apuesta;
