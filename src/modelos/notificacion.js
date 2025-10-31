// Modelo de Notificación
const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');
const modeloNotificacion = db.define(
    'Notificacion',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mensaje: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        leida: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'Notificaciones',
        timestamps: false
    }
);
module.exports = modeloNotificacion;

const nodeMailer = require('nodemailer');

const mensaje = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'carlosbenhur.14@gmail.com',
        pass: 'glkn gcze zhjg xxbt'
    }
});

const sendEmail = async (to, subject, text) => {
    try {
    mensaje.sendMail = await mensaje.sendMail({
        from: 'carlosbenhur.14@gmail.com',
        to,
        subject,
        text
    });
    console.log('Mensaje enviado: ', mensaje.sendMail.messageId);
  } catch (error) {
    console.error('Error al enviar:', error);
  }

};

module.exports = sendEmail;