const { Router } = require('express');
const controladorTituloVehiculo = require('../controladores/controladortitulovehiculo');
const { body, query } = require('express-validator');
const rutas = Router();

/**
 * @swagger
 * /titulovehiculo/listar:
 *  get:
 *    summary: Listar todos los títulos de vehículos
 *    tags: [TituloVehiculo]
 *    responses:
 *      200:
 *        description: Lista de títulos de vehículos con sus relaciones
 *      500:
 *        description: Error al listar los títulos
 */
rutas.get('/listar', controladorTituloVehiculo.Listar);

/**
 * @swagger
 * /titulovehiculo/listarvehiculo:
 *  get:
 *    summary: Listar títulos de un vehículo específico
 *    tags: [TituloVehiculo]
 *    parameters:
 *      - in: query
 *        name: vehiculoId
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del vehículo
 *    responses:
 *      200:
 *        description: Lista de títulos del vehículo
 *      400:
 *        description: Error de validación
 *      500:
 *        description: Error al listar los títulos
 */
rutas.get('/listarvehiculo',
    query('vehiculoId')
        .isInt().withMessage('El ID del vehículo debe ser un número entero')
        .notEmpty().withMessage('El ID del vehículo es requerido'),
    controladorTituloVehiculo.ListarPorVehiculo
);

/**
 * @swagger
 * /titulovehiculo/buscar:
 *  get:
 *    summary: Buscar un título por ID
 *    tags: [TituloVehiculo]
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del título a buscar
 *    responses:
 *      200:
 *        description: Título encontrado
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Título no encontrado
 *      500:
 *        description: Error al buscar el título
 */
rutas.get('/buscar',
    query('id')
        .isInt().withMessage('El ID debe ser un número entero')
        .notEmpty().withMessage('El ID es requerido'),
    controladorTituloVehiculo.Buscar
);

/**
 * @swagger
 * /titulovehiculo/guardar:
 *  post:
 *    summary: Guardar un nuevo título de vehículo
 *    tags: [TituloVehiculo]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - numeroTitulo
 *              - fechaEmision
 *              - estado
 *              - propietarioRegistrado
 *              - documentoPropietario
 *              - vehiculoId
 *            properties:
 *              numeroTitulo:
 *                type: string
 *                description: Número único del título de propiedad
 *              fechaEmision:
 *                type: string
 *                format: date
 *                description: Fecha de emisión del título
 *              fechaVencimiento:
 *                type: string
 *                format: date
 *                description: Fecha de vencimiento (opcional)
 *              estado:
 *                type: string
 *                enum: [vigente, vencido, en_tramite, perdido]
 *                description: Estado del título
 *              propietarioRegistrado:
 *                type: string
 *                minLength: 3
 *                maxLength: 255
 *                description: Nombre del propietario registrado
 *              documentoPropietario:
 *                type: string
 *                description: Documento de identidad del propietario
 *              certificadoRegistro:
 *                type: string
 *                description: Número o URL del certificado de registro (opcional)
 *              certificadoVerificacion:
 *                type: string
 *                description: Número o URL del certificado de verificación (opcional)
 *              polizaSeguro:
 *                type: string
 *                description: Número de póliza de seguro (opcional)
 *              placas:
 *                type: string
 *                minLength: 7
 *                maxLength: 7
 *                pattern: '^[A-Z0-9]{7}$'
 *                description: Número de placas del vehículo (opcional, exactamente 7 caracteres alfanuméricos)
 *              observaciones:
 *                type: string
 *                description: Observaciones adicionales (opcional)
 *              vehiculoId:
 *                type: integer
 *                description: ID del vehículo al que pertenece el título
 *    responses:
 *      201:
 *        description: Título guardado exitosamente
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Vehículo no encontrado
 *      500:
 *        description: Error al guardar el título
 */
rutas.post('/guardar', [
    body('numeroTitulo')
        .notEmpty().withMessage('El número de título es requerido')
        .isString().withMessage('El número de título debe ser texto')
        .trim(),
    body('fechaEmision')
        .notEmpty().withMessage('La fecha de emisión es requerida')
        .isISO8601().withMessage('La fecha de emisión debe ser una fecha válida')
        .toDate(),
    body('fechaVencimiento')
        .optional()
        .isISO8601().withMessage('La fecha de vencimiento debe ser una fecha válida')
        .toDate()
        .custom((value, { req }) => {
            if (value && req.body.fechaEmision) {
                const emision = new Date(req.body.fechaEmision);
                const vencimiento = new Date(value);
                if (vencimiento <= emision) {
                    throw new Error('La fecha de vencimiento debe ser posterior a la fecha de emisión');
                }
            }
            return true;
        }),
    body('estado')
        .notEmpty().withMessage('El estado es requerido')
        .isIn(['vigente', 'vencido', 'en_tramite', 'perdido'])
        .withMessage('El estado debe ser: vigente, vencido, en_tramite o perdido'),
    body('propietarioRegistrado')
        .notEmpty().withMessage('El nombre del propietario es requerido')
        .isString().withMessage('El nombre del propietario debe ser texto')
        .isLength({ min: 3, max: 255 }).withMessage('El nombre del propietario debe tener entre 3 y 255 caracteres')
        .trim(),
    body('documentoPropietario')
        .notEmpty().withMessage('El documento del propietario es requerido')
        .isString().withMessage('El documento del propietario debe ser texto')
        .trim(),
    body('placas')
        .optional()
        .isString().withMessage('Las placas deben ser texto')
        .isLength({ min: 7, max: 7 }).withMessage('La placa debe tener exactamente 7 caracteres')
        .matches(/^[A-Z0-9]{7}$/i).withMessage('La placa debe contener solo letras y números')
        .trim()
        .toUpperCase(),
    body('observaciones')
        .optional()
        .isString().withMessage('Las observaciones deben ser texto'),
    body('vehiculoId')
        .notEmpty().withMessage('El ID del vehículo es requerido')
        .isInt().withMessage('El ID del vehículo debe ser un número entero')
], controladorTituloVehiculo.Guardar);

/**
 * @swagger
 * /titulovehiculo/actualizar:
 *  put:
 *    summary: Actualizar un título de vehículo existente
 *    tags: [TituloVehiculo]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - id
 *            properties:
 *              id:
 *                type: integer
 *                description: ID del título a actualizar
 *              numeroTitulo:
 *                type: string
 *                description: Nuevo número del título (opcional)
 *              fechaEmision:
 *                type: string
 *                format: date
 *                description: Nueva fecha de emisión (opcional)
 *              fechaVencimiento:
 *                type: string
 *                format: date
 *                description: Nueva fecha de vencimiento (opcional)
 *              estado:
 *                type: string
 *                enum: [vigente, vencido, en_tramite, perdido]
 *                description: Nuevo estado (opcional)
 *              propietarioRegistrado:
 *                type: string
 *                minLength: 3
 *                maxLength: 255
 *                description: Nuevo nombre del propietario (opcional)
 *              documentoPropietario:
 *                type: string
 *                description: Nuevo documento del propietario (opcional)
 *              certificadoRegistro:
 *                type: string
 *                description: Nuevo certificado de registro (opcional)
 *              certificadoVerificacion:
 *                type: string
 *                description: Nuevo certificado de verificación (opcional)
 *              polizaSeguro:
 *                type: string
 *                description: Nueva póliza de seguro (opcional)
 *              placas:
 *                type: string
 *                minLength: 7
 *                maxLength: 7
 *                pattern: '^[A-Z0-9]{7}$'
 *                description: Nuevas placas (opcional, exactamente 7 caracteres alfanuméricos)
 *              observaciones:
 *                type: string
 *                description: Nuevas observaciones (opcional)
 *    responses:
 *      200:
 *        description: Título actualizado exitosamente
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Título no encontrado
 *      500:
 *        description: Error al actualizar el título
 */
rutas.put('/actualizar', [
    body('id')
        .notEmpty().withMessage('El ID es requerido')
        .isInt().withMessage('El ID debe ser un número entero'),
    body('numeroTitulo')
        .optional()
        .isString().withMessage('El número de título debe ser texto')
        .trim(),
    body('fechaEmision')
        .optional()
        .isISO8601().withMessage('La fecha de emisión debe ser una fecha válida')
        .toDate(),
    body('fechaVencimiento')
        .optional()
        .isISO8601().withMessage('La fecha de vencimiento debe ser una fecha válida')
        .toDate(),
    body('estado')
        .optional()
        .isIn(['vigente', 'vencido', 'en_tramite', 'perdido'])
        .withMessage('El estado debe ser: vigente, vencido, en_tramite o perdido'),
    body('propietarioRegistrado')
        .optional()
        .isString().withMessage('El nombre del propietario debe ser texto')
        .isLength({ min: 3, max: 255 }).withMessage('El nombre del propietario debe tener entre 3 y 255 caracteres')
        .trim(),
    body('documentoPropietario')
        .optional()
        .isString().withMessage('El documento del propietario debe ser texto')
        .trim(),
    body('certificadoRegistro')
        .optional()
        .isString().withMessage('El certificado de registro debe ser texto')
        .trim(),
    body('certificadoVerificacion')
        .optional()
        .isString().withMessage('El certificado de verificación debe ser texto')
        .trim(),
    body('polizaSeguro')
        .optional()
        .isString().withMessage('La póliza de seguro debe ser texto')
        .trim(),
    body('placas')
        .optional()
        .isString().withMessage('Las placas deben ser texto')
        .isLength({ min: 7, max: 7 }).withMessage('La placa debe tener exactamente 7 caracteres')
        .matches(/^[A-Z0-9]{7}$/i).withMessage('La placa debe contener solo letras y números')
        .trim()
        .toUpperCase(),
    body('observaciones')
        .optional()
        .isString().withMessage('Las observaciones deben ser texto')
], controladorTituloVehiculo.Actualizar);

/**
 * @swagger
 * /titulovehiculo/eliminar:
 *  delete:
 *    summary: Eliminar un título de vehículo
 *    tags: [TituloVehiculo]
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del título a eliminar
 *    responses:
 *      200:
 *        description: Título eliminado exitosamente
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Título no encontrado
 *      500:
 *        description: Error al eliminar el título
 */
rutas.delete('/eliminar',
    query('id')
        .notEmpty().withMessage('El ID es requerido')
        .isInt().withMessage('El ID debe ser un número entero'),
    controladorTituloVehiculo.Eliminar
);

module.exports = rutas;
