const db = require('../configuraciones/db');
const { DataTypes } = require('sequelize');

const tituloVehiculo = db.define(
    'TituloVehiculo',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        numeroTitulo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: 'El número de título no puede estar vacío'
                }
            }
        },
        fechaEmision: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: {
                    msg: 'La fecha de emisión debe ser una fecha válida'
                },
                notNull: {
                    msg: 'La fecha de emisión es requerida'
                }
            }
        },
        fechaVencimiento: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'La fecha de vencimiento debe ser una fecha válida'
                },
                isAfterEmision(value) {
                    if (value && this.fechaEmision && new Date(value) <= new Date(this.fechaEmision)) {
                        throw new Error('La fecha de vencimiento debe ser posterior a la fecha de emisión');
                    }
                }
            }
        },
        estado: {
            type: DataTypes.ENUM('vigente', 'vencido', 'en_tramite', 'perdido'),
            allowNull: false,
            defaultValue: 'vigente',
            validate: {
                isIn: {
                    args: [['vigente', 'vencido', 'en_tramite', 'perdido']],
                    msg: 'El estado debe ser: vigente, vencido, en_tramite o perdido'
                }
            }
        },
        propietarioRegistrado: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El nombre del propietario no puede estar vacío'
                },
                len: {
                    args: [3, 255],
                    msg: 'El nombre del propietario debe tener entre 3 y 255 caracteres'
                }
            }
        },
        documentoPropietario: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El documento del propietario no puede estar vacío'
                }
            }
        },
        certificadoRegistro: {
            type: DataTypes.STRING,
            allowNull: true
        },
        certificadoVerificacion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        polizaSeguro: {
            type: DataTypes.STRING,
            allowNull: true
        },
        placa: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                len: {
                    args: [7, 7],
                    msg: 'La placa debe tener exactamente 7 caracteres'
                },
                is: {
                    args: /^[A-Z0-9]{7}$/i,
                    msg: 'La placa debe contener solo letras y números'
                }
            }
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        vehiculoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'vehiculos',
                key: 'id'
            },
            validate: {
                notNull: {
                    msg: 'El ID del vehículo es requerido'
                },
                isInt: {
                    msg: 'El ID del vehículo debe ser un número entero'
                }
            }
        }
    },
    {
        tableName: 'titulos_vehiculos',
        timestamps: true
    }
);

module.exports = tituloVehiculo;
