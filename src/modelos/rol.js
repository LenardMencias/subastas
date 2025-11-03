const db = require('../configuraciones/db');
const { DataTypes } = require('sequelize');
const permisos = require('./permisos');

const rol = db.define(
    'rol',
    {
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        estado: {
            type: DataTypes.ENUM('AC', 'IN', 'BL'),
            allowNull: true,
            defaultValue: 'AC',
        },
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        permisosId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: permisos,
                key: 'id'
            }
        }
    },  
    {
        tableName: 'rol',
    }
);
rol.belongsTo(permisos, { foreignKey: 'permisosId' });
permisos.hasMany(rol, { foreignKey: 'permisosId' });

module.exports = rol;
