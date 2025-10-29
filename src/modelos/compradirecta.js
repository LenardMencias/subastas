const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const Usuario = require('./usuario');
const Vehiculo = require('./vehiculo');

const CompraDirecta = db.define('CompraDirecta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
        allowNull: false,
        defaultValue: 'pendiente'
    },
    fechaCompra: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    comprobantePago: {
        type: DataTypes.STRING(500),
        allowNull: true
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
    }
}, {
    tableName: 'compras_directas',
    timestamps: true
});

CompraDirecta.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Usuario.hasMany(CompraDirecta, { foreignKey: 'usuarioId' });

CompraDirecta.belongsTo(Vehiculo, { foreignKey: 'vehiculoId' });
Vehiculo.hasMany(CompraDirecta, { foreignKey: 'vehiculoId' });

module.exports = CompraDirecta;