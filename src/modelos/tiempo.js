const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');

const Tiempo = db.define('Tiempo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    duracion: {
        type: DataTypes.INTEGER, // Duración en minutos
        allowNull: false,
        defaultValue: 300 // 5 horas = 300 minutos por defecto
    },
    descripcion: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'tiempos',
    timestamps: true
});

module.exports = Tiempo;
