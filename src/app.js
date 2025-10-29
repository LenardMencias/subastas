const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const db = require('./configuraciones/db');
const ModeloRol = require('./modelos/rol');
const rutasRol = require('./rutas/rutasrol');
const ModeloUsuario = require('./modelos/usuario');
const rutasusuario = require('./rutas/rutasusuario');
const rutasvehiculo = require('./rutas/rutasvehiculo');
const rutasImagenVehiculo = require('./rutas/rutasimagenvehiculo');
const rutasApuesta = require('./rutas/rutasapuesta');
const rutasTiempo = require('./rutas/rutastiempo');
const ModeloVehiculo = require('./modelos/vehiculo');
const ModeloImagenVehiculo = require('./modelos/imagenvehiculo');
const ModeloApuesta = require('./modelos/apuesta');
const ModeloTiempo = require('./modelos/tiempo');
const app = express();

db.authenticate().then(async () => {
	console.log('Conectado a la base de datos');
    ModeloRol.hasMany(ModeloUsuario, { foreignKey: 'rolId' });
    ModeloUsuario.belongsTo(ModeloRol, { foreignKey: 'rolId' });
	await ModeloRol.sync()
		.then(() => console.log('Modelo rol creado correctamente'))
		.catch((er) => console.error(er));
    await ModeloUsuario.sync()
		.then(() => console.log('Modelo usuario creado correctamente'))
		.catch((er) => console.error(er));
	await ModeloVehiculo.sync()
		.then(() => console.log('Modelo vehiculo creado correctamente'))
		.catch((er) => console.error(er));
	await ModeloImagenVehiculo.sync()
		.then(() => console.log('Modelo imagen vehiculo creado correctamente'))
		.catch((er) => console.error(er));
	await ModeloTiempo.sync()
		.then(() => console.log('Modelo tiempo creado correctamente'))
		.catch((er) => console.error(er));
	await ModeloApuesta.sync()
		.then(() => console.log('Modelo apuesta creado correctamente'))
		.catch((er) => console.error(er));
}).catch((er) => {
	console.error('Error conectando a la base de datos:', er);
});

app.set('port', process.env.PORT || 3002);
app.use(morgan('common'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api/roles', rutasRol);
app.use('/api/usuarios', rutasusuario);
app.use('/api/vehiculos', rutasvehiculo);
app.use('/api/imagenesvehiculo', rutasImagenVehiculo);
app.use('/api/apuestas', rutasApuesta);
app.use('/api/tiempos', rutasTiempo);
app.listen(app.get('port'), () => {
	console.log('Servidor iniciado en el puerto', app.get('port'));
});

