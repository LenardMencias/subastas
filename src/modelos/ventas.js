const db = require('../configuraciones/db');
const { DataTypes } = require('sequelize');

const ventas = db.define(
    'Ventas',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        numeroVenta: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Número único de venta generado automáticamente'
        },
        fechaVenta: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        tipo: {
            type: DataTypes.ENUM('apuesta', 'compra_directa'),
            allowNull: false,
            comment: 'Tipo de venta'
        },
        montoBase: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            },
            comment: 'Monto base de la venta (precio inicial)'
        },
        montoFinal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: 'Monto final de la venta (oferta ganadora)'
        },
        estado: {
            type: DataTypes.ENUM('abierta', 'en_proceso', 'cerrada', 'cancelada'),
            allowNull: false,
            defaultValue: 'abierta',
            comment: 'Estado de la venta'
        },
        vehiculoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Vehículo en venta'
        },
        tiempoId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Tiempo de duración (para apuestas)'
        },
        compradirectaaId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Referencia a compra directa (si aplica)'
        },
        apuestaId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Referencia a apuesta (si aplica)'
        }
    },
    {
        tableName: 'ventas',
        timestamps: true,
        hooks: {
            beforeValidate: (venta) => {
                if (!venta.numeroVenta) {
                    const timestamp = Date.now();
                    const random = Math.floor(Math.random() * 1000);
                    venta.numeroVenta = `V-${timestamp}-${random}`;
                }
            }
        }
    }
);

module.exports = ventas;
