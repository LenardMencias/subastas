const {Router} = require('express');
const controladorvehiculo = require('../controladores/controladorvehiculo');
const {body,query}=require('express-validator');
const modelovehiculo = require('../modelos/vehiculo');
const rutas = Router();

/**
 * @swagger
 * /vehiculo/listar:
 *  get:
 *    summary: Listar vehículos
 *    tags: [Vehiculo]
 *    responses:
 *      200:
 *        description: Lista de vehículos
 *      500:
 *        description: Error al listar vehículos
 */
rutas.get('/listar',controladorvehiculo.Listar);

/**
 * @swagger
 * /vehiculo/buscar:
 *  get:
 *    summary: Buscar vehículo por ID
 *    tags: [Vehiculo]
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del vehículo a buscar
 *    responses:
 *      200:
 *        description: Vehículo encontrado
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Vehículo no encontrado
 *      500:
 *        description: Error al buscar el vehículo
 */
rutas.get('/buscar',
    query('id')
        .notEmpty().withMessage('El ID es requerido')
        .isInt().withMessage('El ID debe ser un número entero'),
    controladorvehiculo.Buscar
);

/**
 * @swagger
 * /vehiculo/guardar:
 *  post:
 *    summary: Guardar un nuevo vehículo
 *    tags: [Vehiculo]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - marca
 *              - modelo
 *              - anio
 *              - vin
 *              - motor
 *              - transmision
 *              - traccion
 *              - combustible
 *              - llaves
 *              - kilometraje
 *              - usuarioId
 *            properties:
 *              marca:
 *                type: string
 *                description: Marca del vehículo
 *              modelo:
 *                type: string
 *                description: Modelo del vehículo
 *              anio:
 *                type: integer
 *                minimum: 1900
 *                description: Año del vehículo
 *              vin:
 *                type: string
 *                minLength: 17
 *                maxLength: 17
 *                description: VIN del vehículo (17 caracteres, único)
 *              reporte:
 *                type: string
 *                description: Reporte del vehículo (opcional)
 *              motor:
 *                type: string
 *                description: Tipo de motor
 *              transmision:
 *                type: string
 *                description: Tipo de transmisión
 *              traccion:
 *                type: string
 *                description: Tipo de tracción
 *              combustible:
 *                type: string
 *                description: Tipo de combustible
 *              llaves:
 *                type: string
 *                description: Disponibilidad de llaves
 *              kilometraje:
 *                type: integer
 *                minimum: 0
 *                description: Kilometraje del vehículo
 *              tituloId:
 *                type: integer
 *                description: ID del título (opcional)
 *              usuarioId:
 *                type: integer
 *                description: ID del usuario propietario
 *    responses:
 *      201:
 *        description: Vehículo guardado exitosamente
 *      400:
 *        description: Error de validación o VIN duplicado
 *      500:
 *        description: Error al guardar el vehículo
 */
rutas.post('/guardar', [
    body('marca')
        .notEmpty().withMessage('La marca es requerida')
        .isString().withMessage('La marca debe ser texto')
        .trim(),
    body('modelo')
        .notEmpty().withMessage('El modelo es requerido')
        .isString().withMessage('El modelo debe ser texto')
        .trim(),
    body('anio')
        .notEmpty().withMessage('El año es requerido')
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
        .withMessage(`El año debe ser un número entre 1900 y ${new Date().getFullYear() + 1}`),
    body('vin')
        .notEmpty().withMessage('El VIN es requerido')
        .isString().withMessage('El VIN debe ser texto')
        .isLength({ min: 17, max: 17 }).withMessage('El VIN debe tener exactamente 17 caracteres')
        .matches(/^[A-HJ-NPR-Z0-9]{17}$/i).withMessage('El VIN tiene un formato inválido')
        .trim()
        .toUpperCase(),
    body('reporte')
        .optional()
        .isString().withMessage('El reporte debe ser texto'),
    body('motor')
        .notEmpty().withMessage('El motor es requerido')
        .isString().withMessage('El motor debe ser texto')
        .trim(),
    body('transmision')
        .notEmpty().withMessage('La transmisión es requerida')
        .isString().withMessage('La transmisión debe ser texto')
        .trim(),
    body('traccion')
        .notEmpty().withMessage('La tracción es requerida')
        .isString().withMessage('La tracción debe ser texto')
        .trim(),
    body('combustible')
        .notEmpty().withMessage('El combustible es requerido')
        .isString().withMessage('El combustible debe ser texto')
        .trim(),
    body('llaves')
        .notEmpty().withMessage('La información de llaves es requerida')
        .isString().withMessage('Las llaves deben ser texto')
        .trim(),
    body('kilometraje')
        .notEmpty().withMessage('El kilometraje es requerido')
        .isInt({ min: 0 }).withMessage('El kilometraje debe ser un número entero positivo'),
    body('tituloId')
        .optional()
        .isInt().withMessage('El ID del título debe ser un número entero'),
    body('usuarioId')
        .notEmpty().withMessage('El ID del usuario es requerido')
        .isInt().withMessage('El ID del usuario debe ser un número entero')
], controladorvehiculo.Guardar);

/**
 * @swagger
 * /vehiculo/actualizar:
 *  put:
 *   summary: Actualizar un vehículo existente
 *   tags: [Vehiculo]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: integer
 *               description: ID del vehículo a actualizar
 *             marca:
 *               type: string
 *               description: Nueva marca (opcional)
 *             modelo:
 *               type: string
 *               description: Nuevo modelo (opcional)
 *             anio:
 *               type: integer
 *               minimum: 1900
 *               description: Nuevo año (opcional)
 *             vin:
 *               type: string
 *               minLength: 17
 *               maxLength: 17
 *               description: Nuevo VIN (opcional, 17 caracteres, único)
 *             reporte:
 *               type: string
 *               description: Nuevo reporte (opcional)
 *             motor:
 *               type: string
 *               description: Nuevo tipo de motor (opcional)
 *             transmision:
 *               type: string
 *               description: Nueva transmisión (opcional)
 *             traccion:
 *               type: string
 *               description: Nueva tracción (opcional)
 *             combustible:
 *               type: string
 *               description: Nuevo combustible (opcional)
 *             llaves:
 *               type: string
 *               description: Nueva info de llaves (opcional)
 *             kilometraje:
 *               type: integer
 *               minimum: 0
 *               description: Nuevo kilometraje (opcional)
 *             tituloId:
 *               type: integer
 *               description: Nuevo ID del título (opcional)
 *             usuarioId:
 *               type: integer
 *               description: Nuevo ID del usuario (opcional)
 *   responses:
 *     200:
 *       description: Vehículo actualizado exitosamente
 *     400:
 *       description: Error de validación o VIN duplicado
 *     404:
 *       description: Vehículo no encontrado
 *     500:
 *       description: Error al actualizar el vehículo
 */
rutas.put('/actualizar', [
    body('id')
        .notEmpty().withMessage('El ID es requerido')
        .isInt().withMessage('El ID debe ser un número entero'),
    body('marca')
        .optional()
        .isString().withMessage('La marca debe ser texto')
        .trim(),
    body('modelo')
        .optional()
        .isString().withMessage('El modelo debe ser texto')
        .trim(),
    body('anio')
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
        .withMessage(`El año debe ser un número entre 1900 y ${new Date().getFullYear() + 1}`),
    body('vin')
        .optional()
        .isString().withMessage('El VIN debe ser texto')
        .isLength({ min: 17, max: 17 }).withMessage('El VIN debe tener exactamente 17 caracteres')
        .matches(/^[A-HJ-NPR-Z0-9]{17}$/i).withMessage('El VIN tiene un formato inválido')
        .trim()
        .toUpperCase(),
    body('reporte')
        .optional()
        .isString().withMessage('El reporte debe ser texto'),
    body('motor')
        .optional()
        .isString().withMessage('El motor debe ser texto')
        .trim(),
    body('transmision')
        .optional()
        .isString().withMessage('La transmisión debe ser texto')
        .trim(),
    body('traccion')
        .optional()
        .isString().withMessage('La tracción debe ser texto')
        .trim(),
    body('combustible')
        .optional()
        .isString().withMessage('El combustible debe ser texto')
        .trim(),
    body('llaves')
        .optional()
        .isString().withMessage('Las llaves deben ser texto')
        .trim(),
    body('kilometraje')
        .optional()
        .isInt({ min: 0 }).withMessage('El kilometraje debe ser un número entero positivo'),
    body('tituloId')
        .optional()
        .isInt().withMessage('El ID del título debe ser un número entero'),
    body('usuarioId')
        .optional()
        .isInt().withMessage('El ID del usuario debe ser un número entero')
], controladorvehiculo.Actualizar);

/**
 * @swagger
 * /vehiculo/eliminar:
 *  delete:
 *    summary: Eliminar un vehículo existente
 *    tags: [Vehiculo]
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del vehículo a eliminar
 *    responses:
 *      200:
 *        description: Vehículo eliminado exitosamente
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Vehículo no encontrado
 *      500:
 *        description: Error al eliminar el vehículo
 */
rutas.delete('/eliminar',
    query('id')
        .notEmpty().withMessage('El ID es requerido')
        .isInt().withMessage('El ID debe ser un número entero'),
    controladorvehiculo.Eliminar
);

/**
 * @swagger
 * /vehiculo/compra-directa-disponible:
 *  get:
 *    summary: Listar vehículos disponibles para compra directa
 *    tags: [Vehiculo]
 *    responses:
 *      200:
 *        description: Lista de vehículos con compra directa disponible
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msj:
 *                  type: string
 *                total:
 *                  type: integer
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *      500:
 *        description: Error al listar vehículos
 */
rutas.get('/compra-directa-disponible', controladorvehiculo.ListarCompraDirectaDisponible);

module.exports = rutas;
