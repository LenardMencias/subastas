const db = require('../configuraciones/db');
const { DataTypes } = require('sequelize');
const usuario = require('./usuario');
const { monthsShort } = require('moment');
const imagen = require('./imagen');
const titulo = require('./titulo');
const { all } = require('../rutas/rutasrol');

const vehiculo = db.define(
    'Vehiculo',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        marca: {
            type: DataTypes.STRING,
            allowNull: false
        },
        modelo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        anio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        vin: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        reporte: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        motor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        transmision: {
            type: DataTypes.STRING,
            allowNull: false
        },
        traccion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        combustible: {
            type: DataTypes.STRING,
            allowNull: false
        },
        llaves: {
            type: DataTypes.STRING,
            allowNull: false
        },
        kilometraje: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imagenId: {
            type: DataTypes.INTEGER,
            references: {
                model: imagen,
                key: 'id'
            }
        },
        tituloId: {
            type: DataTypes.INTEGER,
            references: {
                model: titulo,
                key: 'id'
            }
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            references: {
                model: usuario,
                key: 'id'
            }
        }
    }
);
