const db = require('../src/configuraciones/db');

async function crearTablasJunction() {
    try {
        await db.authenticate();
        console.log('Conectado a la base de datos');

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
        console.log('Tabla rol_permiso creada');

        console.log('Tablas junction creadas exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

crearTablasJunction();
