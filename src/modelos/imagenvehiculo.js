const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const Vehiculo = require('./vehiculo');

const ImagenVehiculo = db.define('ImagenVehiculo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    descripcion: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    vehiculoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Vehiculos',
            key: 'id'
        }
    }
}, {
    tableName: 'imagenesvehiculos',
    timestamps: true
});

ImagenVehiculo.belongsTo(Vehiculo, { foreignKey: 'vehiculoId' });
Vehiculo.hasMany(ImagenVehiculo, { foreignKey: 'vehiculoId' });

module.exports = ImagenVehiculo;
