const db = require('../configuraciones/db');
const { DataTypes } = require('sequelize');
const permisos = require('./permisos');

async function crearTablasJunction() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS rol_permiso (
                rolId INT NOT NULL,
                permisoId INT NOT NULL,
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (rolId, permisoId),
                FOREIGN KEY (rolId) REFERENCES rol(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (permisoId) REFERENCES permiso(id) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB;
        `);
        console.log('Tabla junction rol_permiso creada exitosamente');
    } catch (error) {
        console.error('Error creando tablas junction:', error.message);
    }
}

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

// Exportar tanto el modelo como la función
module.exports = {
    rol,
    crearTablasJunction
};
