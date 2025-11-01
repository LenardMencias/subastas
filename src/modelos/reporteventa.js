// Modelo de Reporte de Venta
const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const modeloReporteVenta = db.define(
    'ReporteVenta',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        vehiculoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
        
    },
    {
        tableName: 'ReporteVentas',
        timestamps: false
    }
);
module.exports = modeloReporteVenta;