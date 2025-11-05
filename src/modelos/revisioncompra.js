// Modelo de Revisión de Compra
const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const ModeloRevisionCompra = db.define(
    'RevisionCompra',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        comentarios: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        aprobado: {
            type: DataTypes.BOOLEAN,
            allowNull: false
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
        tableName: 'RevisionCompras',
        timestamps: false
    }
);
module.exports = ModeloRevisionCompra;

/*Verificacion de que el usuario */