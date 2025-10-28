// Modelo de Apuesta
const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const Usuario = require('./usuario');
const Vehiculo = require('./vehiculo');
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
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
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
    tiempoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tiempo,
            key: 'id'
        }
    }
}, {
    tableName: 'apuestas',
    timestamps: true,
    hooks: {
        beforeCreate: async (apuesta) => {
            const tiempo = await Tiempo.findByPk(apuesta.tiempoId);
            const duracionMinutos = tiempo ? tiempo.duracion : 300; 
            apuesta.fechaFin = new Date(new Date().getTime() + duracionMinutos * 60000);
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
