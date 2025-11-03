const db = require('../configuraciones/db');
const { DataTypes } = require('sequelize');

const CompradorVendedor = db.define(
    'CompradorVendedor',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        identidad: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        primernombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        segundonombre: {
            type: DataTypes.STRING,
            allowNull: true
        },
        primerapellido: {
            type: DataTypes.STRING,
            allowNull: false
        },
        segundoapellido: {
            type: DataTypes.STRING,
            allowNull: true
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: false    
        },
        correo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fechaNacimiento: {
            type: DataTypes.DATE,
            allowNull: false
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        tableName: 'compradores_vendedores',
        timestamps: false
    }
);

module.exports = CompradorVendedor;