const {Router} = require('express');
const ControladorReporteVenta = require('../controladores/controladorreporteventa');
const ModeloReporteVenta = require('../modelos/reporteventa');
const {body,query}=require('express-validator');
const rutas = Router();

rutas.get('/listar', ControladorReporteVenta.Listar);

rutas.post('/guardar', ControladorReporteVenta.Guardar);

module.exports = rutas;
