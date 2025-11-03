const db = require('../configuraciones/db');
const { DataTypes } = require('sequelize');

const Permiso = db.define('permiso', {
    clave: {              
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'permiso',
    timestamps: false
});

module.exports = Permiso;
