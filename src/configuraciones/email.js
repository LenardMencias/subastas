const nodemailer = require('nodemailer');

// Configuración del transportador de email
const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes cambiar esto según tu proveedor
    auth: {
        user: process.env.EMAIL_USER, // Tu email
        pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación
    }
});

// Función para enviar email de recuperación
const enviarEmailRecuperacion = async (email, token, nombre) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperación de Contraseña - Sistema de Subastas',
            text: `Hola ${nombre},

Has solicitado recuperar tu contraseña. Tu código de recuperación es: ${token}

Este código es válido por 15 minutos.

Si no solicitaste esta recuperación, puedes ignorar este email.

Sistema de Subastas`
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email enviado exitosamente:', result.messageId);
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        return false;
    }
};

module.exports = {
    enviarEmailRecuperacion
};