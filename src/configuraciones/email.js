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

// Función para enviar email de confirmación de cuenta
const enviarEmailConfirmacionCuenta = async (email, nombre, tipoUsuario) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '¡Bienvenido al Sistema de Subastas! - Cuenta Creada Exitosamente',
            html: `
                <h2>¡Bienvenido ${nombre}!</h2>
                
                <p>Tu cuenta ha sido creada exitosamente en nuestro Sistema de Subastas.</p>
                
                <h3>Detalles de tu cuenta:</h3>
                <ul>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Rol:</strong> ${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)}</li>
                    <li><strong>Estado:</strong> Activa</li>
                </ul>
                
                <h3>¿Qué puedes hacer según tu rol?</h3>
                ${tipoUsuario === 'cliente' ? `
                <h4>Como Cliente puedes:</h4>
                <ul>
                    <li>Realizar apuestas en vehículos</li>
                    <li>Comprar vehículos directamente</li>
                    <li>Ver historial de tus apuestas</li>
                    <li>Consultar vehículos disponibles</li>
                </ul>
                ` : tipoUsuario === 'empleado' ? `
                <h4>Como Empleado puedes:</h4>
                <ul>
                    <li> Todos los permisos de cliente</li>
                    <li>Agregar y gestionar vehículos</li>
                    <li>Subir imágenes de vehículos</li>
                    <li>Gestionar títulos de vehículos</li>
                    <li>Finalizar subastas</li>
                    <li>Asociar compradores/vendedores</li>
                    <li>Editar usuarios cliente</li>
                </ul>
                ` : `
                <h4>Como Administrador tienes acceso completo:</h4>
                <ul>
                    <li> Todos los permisos del sistema</li>
                    <li> Gestionar roles y permisos</li>
                    <li> Editar cualquier usuario</li>
                    <li> Configurar el sistema</li>
                    <li>Generar reportes completos</li>
                </ul>
                `}
                
                <p><strong>Ya puedes iniciar sesión con tus credenciales.</strong></p>
                
                <hr>
                <p style="color: #666; font-size: 12px;">
                    Este es un email automático del Sistema de Subastas.<br>
                    Si no solicitaste esta cuenta, contacta al administrador.
                </p>
            `,
            text: `¡Bienvenido ${nombre}!

Tu cuenta ha sido creada exitosamente en nuestro Sistema de Subastas.

Detalles de tu cuenta:
- Email: ${email}
- Rol: ${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)}
- Estado: Activa

Ya puedes iniciar sesión con tus credenciales.

Sistema de Subastas`
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email de confirmación enviado:', result.messageId);
        return true;
    } catch (error) {
        console.error('Error enviando email de confirmación:', error);
        return false;
    }
};

module.exports = {
    enviarEmailRecuperacion,
    enviarEmailConfirmacionCuenta
};