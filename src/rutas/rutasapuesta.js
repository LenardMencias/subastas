const { Router } = require('express');
const controladorApuesta = require('../controladores/controladorapuesta');
const { body, query } = require('express-validator');
const { verificarToken, verificarPermiso, verificarRolMinimo } = require('../configuraciones/permisos');
const rutas = Router();

/**
 * @swagger
 * /apuesta/listar:
 *  get:
 *    summary: Listar todas las apuestas
 *    tags: [Apuesta]
 *    responses:
 *      200:
 *        description: Lista de apuestas con sus relaciones
 *      500:
 *        description: Error al listar las apuestas
 */
rutas.get('/listar', verificarToken, verificarPermiso('apuesta:listar-todas'), controladorApuesta.Listar);

/**
 * @swagger
 * /apuesta/listarvehiculo:
 *  get:
 *    summary: Listar apuestas de un vehículo específico
 *    tags: [Apuesta]
 *    parameters:
 *      - in: query
 *        name: vehiculoId
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del vehículo
 *    responses:
 *      200:
 *        description: Lista de apuestas del vehículo
 *      400:
 *        description: Error de validación
 *      500:
 *        description: Error al listar las apuestas
 */
rutas.get('/listarvehiculo',
    verificarToken,
    verificarRolMinimo('empleado'),
    query('vehiculoId')
        .isInt().withMessage('El ID del vehículo debe ser un número entero')
        .notEmpty().withMessage('El ID del vehículo es requerido'),
    controladorApuesta.ListarPorVehiculo
);

/**
 * @swagger
 * /apuesta/listarusuario:
 *  get:
 *    summary: Listar apuestas de un usuario específico
 *    tags: [Apuesta]
 *    parameters:
 *      - in: query
 *        name: usuarioId
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del usuario
 *    responses:
 *      200:
 *        description: Lista de apuestas del usuario
 *      400:
 *        description: Error de validación
 *      500:
 *        description: Error al listar las apuestas
 */
rutas.get('/listarusuario',
    verificarToken,
    verificarPermiso('apuesta:listar-propias'),
    query('usuarioId')
        .isInt().withMessage('El ID del usuario debe ser un número entero')
        .notEmpty().withMessage('El ID del usuario es requerido'),
    controladorApuesta.ListarPorUsuario
);

/**
 * @swagger
 * /apuesta/guardar:
 *  post:
 *    summary: Crear una nueva apuesta
 *    tags: [Apuesta]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - monto
 *              - usuarioId
 *              - vehiculoId
 *            properties:
 *              monto:
 *                type: number
 *                minimum: 0
 *                description: Monto de la apuesta (debe ser igual o mayor al precio de compra directa del vehículo y superior a apuestas existentes)
 *              usuarioId:
 *                type: integer
 *                description: ID del usuario que realiza la apuesta
 *              vehiculoId:
 *                type: integer
 *                description: ID del vehículo por el que se apuesta
 *              tiempoId:
 *                type: integer
 *                description: ID del tiempo de duración (opcional, por defecto 5 horas)
 *    responses:
 *      201:
 *        description: Apuesta creada exitosamente
 *      400:
 *        description: Error de validación - monto insuficiente o menor al requerido
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msj:
 *                  type: string
 *                  example: "Su apuesta debe ser mayor a la apuesta más alta actual: $25000"
 *                montoMinimo:
 *                  type: number
 *                  example: 25000.01
 *                apuestaMasAlta:
 *                  type: number
 *                  example: 25000
 *      500:
 *        description: Error al crear la apuesta
 */
rutas.post('/guardar', [
    verificarToken,
    verificarPermiso('apuesta:crear'),
    body('monto')
        .notEmpty().withMessage('El monto es requerido')
        .isFloat({ min: 0.01 }).withMessage('El monto debe ser un número positivo mayor a 0'),
    body('usuarioId')
        .notEmpty().withMessage('El ID del usuario es requerido')
        .isInt().withMessage('El ID del usuario debe ser un número entero'),
    body('vehiculoId')
        .notEmpty().withMessage('El ID del vehículo es requerido')
        .isInt().withMessage('El ID del vehículo debe ser un número entero'),
    body('tiempoId')
        .optional()
        .isInt().withMessage('El ID del tiempo debe ser un número entero')
], controladorApuesta.Guardar);

/**
 * @swagger
 * /apuesta/actualizar:
 *  put:
 *    summary: Actualizar el estado de una apuesta
 *    tags: [Apuesta]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - id
 *              - estado
 *              - ganador
 *            properties:
 *              id:
 *                type: integer
 *                description: ID de la apuesta
 *              estado:
 *                type: string
 *                enum: [activa, finalizada, cancelada]
 *                description: Nuevo estado de la apuesta
 *              ganador:
 *                type: boolean
 *                description: Indica si la apuesta es ganadora
 *    responses:
 *      200:
 *        description: Apuesta actualizada exitosamente
 *      400:
 *        description: Error de validación
 *      404:
 *        description: Apuesta no encontrada
 *      500:
 *        description: Error al actualizar la apuesta
 */
rutas.put('/actualizar', [
    verificarToken,
    verificarRolMinimo('empleado'),
    body('id')
        .notEmpty().withMessage('El ID es requerido')
        .isInt().withMessage('El ID debe ser un número entero'),
    body('estado')
        .notEmpty().withMessage('El estado es requerido')
        .isIn(['activa', 'finalizada', 'cancelada']).withMessage('Estado inválido. Debe ser: activa, finalizada o cancelada'),
    body('ganador')
        .notEmpty().withMessage('El campo ganador es requerido')
        .isBoolean().withMessage('El ganador debe ser verdadero o falso')
], controladorApuesta.Actualizar);

/**
 * @swagger
 * /apuesta/finalizar:
 *  put:
 *    summary: Finalizar una apuesta activa
 *    tags: [Apuesta]
 *    parameters:
 *      - in: query
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID de la apuesta a finalizar
 *    responses:
 *      200:
 *        description: Apuesta finalizada exitosamente
 *      400:
 *        description: Error de validación o apuesta no activa
 *      404:
 *        description: Apuesta no encontrada
 *      500:
 *        description: Error al finalizar la apuesta
 */
rutas.put('/finalizar',
    verificarToken,
    verificarPermiso('apuesta:finalizar'),
    query('id')
        .notEmpty().withMessage('El ID es requerido')
        .isInt().withMessage('El ID debe ser un número entero'),
    controladorApuesta.FinalizarApuesta
);

/**
 * @swagger
 * /apuesta/tiempos:
 *  get:
 *    summary: Listar tiempos disponibles para las apuestas
 *    tags: [Apuesta]
 *    responses:
 *      200:
 *        description: Lista de tiempos disponibles
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                  duracion:
 *                    type: integer
 *                    description: Duración en minutos
 *                  descripcion:
 *                    type: string
 *      500:
 *        description: Error al listar los tiempos
 */
rutas.get('/tiempos', verificarToken, controladorApuesta.ListarTiempos);

/**
 * @swagger
 * /apuesta/finalizar:
 *  post:
 *    summary: Finalizar subasta completa y determinar ganador automáticamente
 *    tags: [Apuesta]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - vehiculoId
 *            properties:
 *              vehiculoId:
 *                type: integer
 *                description: ID del vehículo cuya subasta se va a finalizar
 *                example: 3
 *    responses:
 *      200:
 *        description: Subasta finalizada exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msj:
 *                  type: string
 *                  example: "¡Subasta finalizada exitosamente! El vehículo ya no está disponible."
 *                ganador:
 *                  type: object
 *                  properties:
 *                    apuestaId:
 *                      type: integer
 *                    usuario:
 *                      type: string
 *                    email:
 *                      type: string
 *                    monto:
 *                      type: number
 *                    vehiculo:
 *                      type: string
 *                    fechaFinalizacion:
 *                      type: string
 *                      format: date-time
 *                totalParticipantes:
 *                  type: integer
 *                resumenApuestas:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      usuario:
 *                        type: string
 *                      monto:
 *                        type: number
 *                      esGanador:
 *                        type: boolean
 *                vehiculoEstado:
 *                  type: string
 *                  example: "No disponible para futuras transacciones"
 *      400:
 *        description: Error de validación - vehiculoId requerido
 *      404:
 *        description: No hay apuestas activas para este vehículo
 *      500:
 *        description: Error interno del servidor
 */
rutas.post('/finalizar', [
    verificarToken,
    verificarPermiso('apuesta:finalizar'),
    body('vehiculoId').isInt().withMessage('vehiculoId debe ser un número entero')
], controladorApuesta.FinalizarSubasta);

/**
 * @swagger
 * /apuesta/verificar-vencidas:
 *  post:
 *    summary: Verificar y finalizar automáticamente todas las subastas vencidas
 *    tags: [Apuesta]
 *    description: Busca todas las apuestas activas que han superado su fechaFin y las finaliza automáticamente, declarando ganadores
 *    responses:
 *      200:
 *        description: Proceso completado exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                msj:
 *                  type: string
 *                  example: "Se finalizaron 3 subastas automáticamente"
 *                subastasFinalizadas:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      vehiculo:
 *                        type: string
 *                        example: "Ford F-150 2021"
 *                      ganador:
 *                        type: string
 *                        example: "Pedro Gonzalez"
 *                      montoGanador:
 *                        type: number
 *                        example: 25000
 *                      totalParticipantes:
 *                        type: integer
 *                        example: 7
 *                      fechaVencimiento:
 *                        type: string
 *                        format: date-time
 *                      vehiculoEstado:
 *                        type: string
 *                        example: "No disponible para futuras transacciones"
 *      500:
 *        description: Error interno del servidor
 */
rutas.post('/verificar-vencidas', verificarToken, verificarRolMinimo('empleado'), controladorApuesta.VerificarSubastasVencidas);

/**
 * @swagger
 * /apuesta/monto-minimo/{vehiculoId}:
 *  get:
 *    summary: Obtener el monto mínimo requerido para apostar en un vehículo
 *    tags: [Apuesta]
 *    parameters:
 *      - in: path
 *        name: vehiculoId
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del vehículo
 *        example: 3
 *    responses:
 *      200:
 *        description: Monto mínimo obtenido exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                vehiculo:
 *                  type: string
 *                  example: "Ford F-150 2021"
 *                montoMinimo:
 *                  type: number
 *                  example: 25000.01
 *                razon:
 *                  type: string
 *                  example: "Debe superar la apuesta actual más alta de $25000"
 *                precioCompraDirecta:
 *                  type: number
 *                  example: 20000
 *                apuestaMasAlta:
 *                  type: number
 *                  example: 25000
 *                tieneApuestasActivas:
 *                  type: boolean
 *                  example: true
 *      404:
 *        description: Vehículo no encontrado
 *      500:
 *        description: Error interno del servidor
 */
rutas.get('/monto-minimo/:vehiculoId', verificarToken, controladorApuesta.ObtenerMontoMinimo);

/**
 * @swagger
 * /apuesta/estadisticas/{vehiculoId}:
 *  get:
 *    summary: Obtener estadísticas detalladas de una subasta por vehículo
 *    tags: [Apuesta]
 *    parameters:
 *      - in: path
 *        name: vehiculoId
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del vehículo para obtener estadísticas
 *        example: 3
 *    responses:
 *      200:
 *        description: Estadísticas de la subasta obtenidas exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                vehiculo:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                    marca:
 *                      type: string
 *                    modelo:
 *                      type: string
 *                    anio:
 *                      type: integer
 *                totalApuestas:
 *                  type: integer
 *                  example: 7
 *                montoMinimo:
 *                  type: number
 *                  example: 15000
 *                montoMaximo:
 *                  type: number
 *                  example: 25000
 *                montoPromedio:
 *                  type: number
 *                  example: 20142.86
 *                estadoSubasta:
 *                  type: string
 *                  example: "activa"
 *                participantes:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      usuario:
 *                        type: string
 *                      monto:
 *                        type: number
 *                      fechaApuesta:
 *                        type: string
 *                        format: date-time
 *                      esGanador:
 *                        type: boolean
 *      404:
 *        description: No se encontraron apuestas para este vehículo
 *      500:
 *        description: Error interno del servidor
 */
rutas.get('/estadisticas/:vehiculoId', verificarToken, verificarRolMinimo('empleado'), controladorApuesta.EstadisticasSubasta);

module.exports = rutas;
