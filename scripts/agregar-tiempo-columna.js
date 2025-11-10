// Agregar columna tiempoId a la tabla apuestas
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const db = new Sequelize(process.env.NombreBD, process.env.UsuarioBD, process.env.ContrasenaBD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log
});

async function agregarColumnasTiempo() {
    try {
        await db.authenticate();
        console.log('Conectado a la base de datos');

        // Agregar columna tiempoId
        await db.query(`
            ALTER TABLE apuestas 
            ADD COLUMN tiempoId INT NULL AFTER usuarioId
        `);
        console.log('✅ Columna tiempoId agregada');

        // Agregar foreign key
        await db.query(`
            ALTER TABLE apuestas 
            ADD FOREIGN KEY (tiempoId) REFERENCES tiempos(id)
        `);
        console.log('✅ Foreign key para tiempoId agregada');

        console.log('🎉 Migración completada exitosamente');
        
    } catch (error) {
        if (error.message.includes('Duplicate column name')) {
            console.log('ℹ️  La columna tiempoId ya existe');
        } else if (error.message.includes('Duplicate foreign key')) {
            console.log('ℹ️  La foreign key ya existe');
        } else {b
            console.error('❌ Error en la migración:', error.message);
        }
    } finally {
        await db.close();
        process.exit(0);
    }
}

agregarColumnasTiempo();