const db = require('../configuraciones/db');
const { DataTypes } = require('sequelize');

const empleado = db.define(
    'Empleado',
    {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false    
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: false    
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        tableName: 'empleados',
        timestamps: false
    }
);

module.exports = empleado;
