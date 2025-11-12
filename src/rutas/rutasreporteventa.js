const {Router} = require('express');
const ControladorReporteVenta = require('../controladores/controladorreporteventa');
const ModeloReporteVenta = require('../modelos/reporteventa');
const {body,query}=require('express-validator');
const rutas = Router();

/**
 * @swagger
 * /reportesventa/listar:
 *   get:
 *     summary: Listar todos los reportes de ventas
 *     tags: [ReporteVenta]
 *     responses:
 *       200:
 *         description: Lista de reportes de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   fechaVenta:
 *                     type: string
 *                     format: date
 *                   montoVenta:
 *                     type: number
 *                     format: decimal
 *                   comision:
 *                     type: number
 *                     format: decimal
 *                   vehiculoId:
 *                     type: integer
 *                   usuarioId:
 *                     type: integer
 *       500:
 *         description: Error interno del servidor
 */
rutas.get('/listar', ControladorReporteVenta.Listar);

/**
 * @swagger
 * /reportesventa/guardar:
 *   post:
 *     summary: Crear un nuevo reporte de venta
 *     tags: [ReporteVenta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fechaVenta
 *               - montoVenta
 *               - comision
 *               - vehiculoId
 *               - usuarioId
 *             properties:
 *               fechaVenta:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-12"
 *               montoVenta:
 *                 type: number
 *                 format: decimal
 *                 example: 25000.00
 *               comision:
 *                 type: number
 *                 format: decimal
 *                 example: 2500.00
 *               vehiculoId:
 *                 type: integer
 *                 example: 1
 *               usuarioId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Reporte de venta creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
rutas.post('/guardar', ControladorReporteVenta.Guardar);

module.exports = rutas;
