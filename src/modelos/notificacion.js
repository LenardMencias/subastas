// Modelo de Notificación
const db = require('../configuraciones/db');
const { DataTypes } = require('sequelize');
const modeloNotificacion = db.define(
    'Notificacion',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mensaje: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        leida: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'Notificaciones',
        timestamps: false
    }
);
module.exports = modeloNotificacion;



