const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./configuraciones/swagger');
require('dotenv').config();
const db = require('./configuraciones/db');

const { rol: ModeloRol, crearTablasJunction } = require('./modelos/rol');
const ModeloPermiso = require('./modelos/permisos');
const ModeloUsuario = require('./modelos/usuario');
const ModeloEmpleado = require('./modelos/empleado');
const ModeloCompradorVendedor = require('./modelos/CompradorVendedor');
const ModeloVehiculo = require('./modelos/vehiculo');
const ModeloImagenVehiculo = require('./modelos/imagenvehiculo');
const ModeloTiempo = require('./modelos/tiempo');
const ModeloApuesta = require('./modelos/apuesta');
const ModeloCompraDirecta = require('./modelos/compradirecta');
const ModeloVentas = require('./modelos/ventas');
const ModeloVentaParticipante = require('./modelos/ventaparticipante');
const ModeloReporteVenta = require('./modelos/reporteventa');
const ModeloNotificacion = require('./modelos/notificacion');
const ModeloRevisionCompra = require('./modelos/revisioncompra');
const ModeloTituloVehiculo = require('./modelos/titulovehiculo');

const rutasRol = require('./rutas/rutasrol');
const rutasPermisos = require('./rutas/rutaspermisos');
const rutasUsuario = require('./rutas/rutasusuario');
const rutasEmpleado = require('./rutas/rutasempleado');
const rutasCompradorVendedor = require('./rutas/rutascompradorvendedor');
const rutasVehiculo = require('./rutas/rutasvehiculo');
const rutasImagenVehiculo = require('./rutas/rutasimagenvehiculo');
const rutasTiempo = require('./rutas/rutastiempo');
const rutasApuesta = require('./rutas/rutasapuesta');
const rutasCompraDirecta = require('./rutas/rutascompradirecta');
const rutasVentas = require('./rutas/rutasventas');
const rutasReporteVenta = require('./rutas/rutasreporteventa');
const rutasNotificacion = require('./rutas/rutasnotificacion');
const rutasRevisionCompra = require('./rutas/rutasrevisioncompra');
const rutasTituloVehiculo = require('./rutas/rutastititulovehiculo');
const rutasAuth = require('./rutas/rutasauth');

const app = express();

db.authenticate().then(async () => {
    console.log('Conectado a la base de datos');

    ModeloRol.belongsToMany(ModeloPermiso, { through: 'rol_permiso', foreignKey: 'rolId', as: 'permisos' });
    ModeloPermiso.belongsToMany(ModeloRol, { through: 'rol_permiso', foreignKey: 'permisoId', as: 'roles' });
    ModeloRol.hasMany(ModeloUsuario, { foreignKey: 'rolId' });
    ModeloUsuario.belongsTo(ModeloRol, { foreignKey: 'rolId' });
    ModeloUsuario.hasMany(ModeloEmpleado, { foreignKey: 'usuarioId' });
    ModeloEmpleado.belongsTo(ModeloUsuario, { foreignKey: 'usuarioId' });
    ModeloUsuario.hasMany(ModeloCompradorVendedor, { foreignKey: 'usuarioId' });
    ModeloCompradorVendedor.belongsTo(ModeloUsuario, { foreignKey: 'usuarioId' });
    ModeloUsuario.hasMany(ModeloVehiculo, { foreignKey: 'usuarioId' });
    ModeloVehiculo.belongsTo(ModeloUsuario, { foreignKey: 'usuarioId' });
    ModeloVehiculo.hasMany(ModeloImagenVehiculo, { foreignKey: 'vehiculoId' });
    ModeloImagenVehiculo.belongsTo(ModeloVehiculo, { foreignKey: 'vehiculoId' });
    ModeloEmpleado.hasMany(ModeloApuesta, { foreignKey: 'empleadoId' });
    ModeloApuesta.belongsTo(ModeloEmpleado, { foreignKey: 'empleadoId' });
    ModeloVehiculo.hasMany(ModeloApuesta, { foreignKey: 'vehiculoId' });
    ModeloApuesta.belongsTo(ModeloVehiculo, { foreignKey: 'vehiculoId' });
    ModeloUsuario.hasMany(ModeloApuesta, { foreignKey: 'usuarioId' });
    ModeloApuesta.belongsTo(ModeloUsuario, { foreignKey: 'usuarioId' });
    ModeloTiempo.hasMany(ModeloApuesta, { foreignKey: 'tiempoId' });
    ModeloApuesta.belongsTo(ModeloTiempo, { foreignKey: 'tiempoId' });
    ModeloUsuario.hasMany(ModeloCompraDirecta, { foreignKey: 'usuarioId' });
    ModeloCompraDirecta.belongsTo(ModeloUsuario, { foreignKey: 'usuarioId' });
    ModeloVehiculo.hasMany(ModeloCompraDirecta, { foreignKey: 'vehiculoId' });
    ModeloCompraDirecta.belongsTo(ModeloVehiculo, { foreignKey: 'vehiculoId' });
    ModeloVehiculo.hasMany(ModeloVentas, { foreignKey: 'vehiculoId' });
    ModeloVentas.belongsTo(ModeloVehiculo, { foreignKey: 'vehiculoId' });
	ModeloTiempo.hasMany(ModeloVentas, { foreignKey: 'tiempoId' });
	ModeloVentas.belongsTo(ModeloTiempo, { foreignKey: 'tiempoId', as: 'tiempo' });
	ModeloCompraDirecta.hasMany(ModeloVentas, { foreignKey: 'compradirectaaId' });
	ModeloVentas.belongsTo(ModeloCompraDirecta, { foreignKey: 'compradirectaaId', as: 'compraDirecta' });
	ModeloApuesta.hasMany(ModeloVentas, { foreignKey: 'apuestaId' });
	ModeloVentas.belongsTo(ModeloApuesta, { foreignKey: 'apuestaId', as: 'apuesta' });
	ModeloVentas.belongsToMany(ModeloCompradorVendedor, { through: ModeloVentaParticipante, foreignKey: 'ventaId', as: 'participantes' });
	ModeloCompradorVendedor.belongsToMany(ModeloVentas, { through: ModeloVentaParticipante, foreignKey: 'compradorVendedorId', as: 'ventas' });
	ModeloVentas.hasMany(ModeloVentaParticipante, { foreignKey: 'ventaId', as: 'listaParticipantes' });
	ModeloVentaParticipante.belongsTo(ModeloVentas, { foreignKey: 'ventaId' });
	ModeloCompradorVendedor.hasMany(ModeloVentaParticipante, { foreignKey: 'compradorVendedorId' });
	ModeloVentaParticipante.belongsTo(ModeloCompradorVendedor, { foreignKey: 'compradorVendedorId' }); 
    // Relaciones correctas - ReporteVenta pertenece a Vehiculo y Usuario
    ModeloVehiculo.hasMany(ModeloReporteVenta, { foreignKey: 'vehiculoId' });
    ModeloReporteVenta.belongsTo(ModeloVehiculo, { foreignKey: 'vehiculoId' });
    ModeloUsuario.hasMany(ModeloReporteVenta, { foreignKey: 'usuarioId' });
    ModeloReporteVenta.belongsTo(ModeloUsuario, { foreignKey: 'usuarioId' });
    
    // Relaciones correctas - RevisionCompra pertenece a Vehiculo y Usuario
    ModeloVehiculo.hasMany(ModeloRevisionCompra, { foreignKey: 'vehiculoId' });
    ModeloRevisionCompra.belongsTo(ModeloVehiculo, { foreignKey: 'vehiculoId' });
    ModeloUsuario.hasMany(ModeloRevisionCompra, { foreignKey: 'usuarioId' });
    ModeloRevisionCompra.belongsTo(ModeloUsuario, { foreignKey: 'usuarioId' });
    ModeloVehiculo.hasOne(ModeloTituloVehiculo, { foreignKey: 'vehiculoId', as: 'titulo' });
    ModeloTituloVehiculo.belongsTo(ModeloVehiculo, { foreignKey: 'vehiculoId' });

    // Paso 1: Sincronizar tablas independientes primero
	await ModeloPermiso.sync().then(() => console.log('Modelo permiso sincronizado')).catch((er) => console.error(' Error modelo permiso:', er.message));
    await ModeloTiempo.sync().then(() => console.log('Modelo tiempo sincronizado')).catch((er) => console.error(' Error modelo tiempo:', er.message));
    await ModeloRol.sync().then(() => console.log('Modelo rol sincronizado')).catch((er) => console.error(' Error modelo rol:', er.message));
    
    // Paso 2: Crear tabla junction después de que existan las tablas padre
    await crearTablasJunction();
    
    // Paso 3: Sincronizar Usuario (depende de Rol)
    await ModeloUsuario.sync().then(() => console.log(' Modelo usuario sincronizado')).catch((er) => console.error(' Error modelo usuario:', er.message));
    
    // Paso 4: Sincronizar modelos que dependen de Usuario
    await ModeloEmpleado.sync().then(() => console.log('Modelo empleado sincronizado')).catch((er) => console.error(' Error modelo empleado:', er.message));
    await ModeloCompradorVendedor.sync().then(() => console.log(' Modelo comprador/vendedor sincronizado')).catch((er) => console.error(' Error modelo comprador/vendedor:', er.message));
    await ModeloVehiculo.sync().then(() => console.log('Modelo vehiculo sincronizado')).catch((er) => console.error(' Error modelo vehiculo:', er.message));
    
    // Paso 5: Sincronizar modelos que dependen de Vehículo
    await ModeloImagenVehiculo.sync().then(() => console.log('Modelo imagen vehiculo sincronizado')).catch((er) => console.error(' Error modelo imagen vehiculo:', er.message));
    await ModeloTituloVehiculo.sync().then(() => console.log('Modelo titulo vehiculo sincronizado')).catch((er) => console.error(' Error modelo titulo vehiculo:', er.message));
    
    // Paso 6: Sincronizar modelos de transacciones
    await ModeloApuesta.sync().then(() => console.log('Modelo apuesta sincronizado')).catch((er) => console.error(' Error modelo apuesta:', er.message));
    await ModeloCompraDirecta.sync().then(() => console.log(' Modelo compra directa sincronizado')).catch((er) => console.error(' Error modelo compra directa:', er.message));
    await ModeloVentas.sync().then(() => console.log('Modelo ventas sincronizado')).catch((er) => console.error(' Error modelo ventas:', er.message));
    await ModeloVentaParticipante.sync().then(() => console.log('Modelo venta participante sincronizado')).catch((er) => console.error(' Error modelo venta participante:', er.message));
    
    // Paso 7: Sincronizar modelos de reporting (dependen de Usuario y Vehículo)
	await ModeloReporteVenta.sync().then(() => console.log(' Modelo reporte de venta sincronizado')).catch((er) => console.error(' Error modelo reporte de venta:', er.message));
    await ModeloRevisionCompra.sync().then(() => console.log('Modelo revision compra sincronizado')).catch((er) => console.error(' Error modelo revision compra:', er.message));
    await ModeloNotificacion.sync().then(() => console.log('Modelo notificacion sincronizado')).catch((er) => console.error(' Error modelo notificacion:', er.message));

    console.log('Todos los modelos sincronizados\n');
    
}).catch((er) => {
    console.error('Error conectando a la base de datos:', er);
});

app.set('port', process.env.PORT || 3000);

// Configurar middleware ANTES de las rutas
app.use(morgan('common'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/vehiculoimagen', express.static('public/vehiculoimagen'));

// Configurar documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configurar rutas de la API
app.use('/api/auth', rutasAuth);
app.use('/api/roles', rutasRol);
app.use('/api/permisos', rutasPermisos);
app.use('/api/usuarios', rutasUsuario);
app.use('/api/empleados', rutasEmpleado);
app.use('/api/compradoresvendedores', rutasCompradorVendedor);
app.use('/api/vehiculo', rutasVehiculo); 
app.use('/api/imagenvehiculo', rutasImagenVehiculo);
app.use('/api/tiempo', rutasTiempo);
app.use('/api/apuesta', rutasApuesta);
app.use('/api/compradirecta', rutasCompraDirecta);
app.use('/api/venta', rutasVentas);
app.use('/api/reportesventa', rutasReporteVenta);
app.use('/api/notificaciones', rutasNotificacion);
app.use('/api/revisioncompra', rutasRevisionCompra);
app.use('/api/titulovehiculo', rutasTituloVehiculo);

app.listen(app.get('port'), () => {
    console.log('Servidor iniciado en el puerto', app.get('port'));
    console.log('API disponible en: http://localhost:' + app.get('port') + '/api');
    console.log('Documentacion Swagger: http://localhost:' + app.get('port') + '/api-docs');
});