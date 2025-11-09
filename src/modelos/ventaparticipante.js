const db = require('../configuraciones/db');
const { DataTypes } = require('sequelize');

const VentaParticipante = db.define(
    'VentaParticipante',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ventaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'ID de la venta (apuesta o compra directa)'
        },
        compradorVendedorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'ID del comprador/vendedor participante'
        },
        montoOferta: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            },
            comment: 'Monto ofertado por este participante'
        },
        esGanador: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Indica si este participante ganó la apuesta/compra'
        },
        estadoParticipacion: {
            type: DataTypes.ENUM('activo', 'retirado', 'ganador', 'perdedor'),
            allowNull: false,
            defaultValue: 'activo',
            comment: 'Estado de la participación del usuario'
        },
        fechaParticipacion: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: 'Fecha en que el usuario participó'
        },
        comentario: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'Comentario opcional del participante'
        }
    },
    {
        tableName: 'venta_participante',
        timestamps: true,
        indexes: [
            {
                unique: false,
                fields: ['ventaId']
            },
            {
                unique: false,
                fields: ['compradorVendedorId']
            },
            {
                unique: true,
                fields: ['ventaId', 'compradorVendedorId'],
                name: 'unique_venta_comprador'
            }
        ],
        hooks: {
            beforeCreate: async (participante) => {
               
                if (participante.esGanador) {
                    const ganadorExistente = await VentaParticipante.findOne({
                        where: {
                            ventaId: participante.ventaId,
                            esGanador: true
                        }
                    });

                    if (ganadorExistente && ganadorExistente.id !== participante.id) {
                        throw new Error('Ya existe un ganador para esta venta');
                    }
                }
            },
            beforeUpdate: async (participante) => {
                
                if (participante.esGanador && participante.changed('esGanador')) {
                    participante.estadoParticipacion = 'ganador';
                    const ganadorExistente = await VentaParticipante.findOne({
                        where: {
                            ventaId: participante.ventaId,
                            esGanador: true,
                            id: { [db.Sequelize.Op.ne]: participante.id }
                        }
                    });

                    if (ganadorExistente) {
                        throw new Error('Ya existe un ganador para esta venta');
                    }
                }
            }
        }
    }
);

module.exports = VentaParticipante;
