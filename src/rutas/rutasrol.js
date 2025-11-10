const {Router} = require('express');
const controladorrol = require('../controladores/controladorrol');
const { body, query } = require('express-validator');
const { rol: modelorol } = require('../modelos/rol');
const rutas = Router();

/**
 * @swagger
 * /roles/listar:
 *   get:
 *     summary: Listar roles
 *     tags: [Roles]
 *     description: Obtiene una lista de todos los roles
 *     responses:
 *       200:
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rol'
 */
rutas.get('/listar', controladorrol.Listar);

/**
 * @swagger
 * /roles/buscar:
 *   get:
 *     summary: Buscar un rol por ID
 *     tags: [Roles]
 *     description: Obtiene los datos de un rol específico por su ID
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a buscar
 *         example: 1
 *     responses:
 *       200:
 *         description: Rol encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Rol no encontrado
 */
rutas.get('/buscar',
	query('id').isInt().withMessage('El id debe ser un entero'),
	controladorrol.Buscar
);

/**
 * @swagger
 * /roles/guardar:
 *   post:
 *     summary: Guardar un nuevo rol
 *     tags: [Roles]
 *     description: Crea un nuevo rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - estado
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 description: Nombre del rol
 *                 example: "Administrador"
 *               estado:
 *                 type: string
 *                 enum: [AC, IN, BL]
 *                 description: Estado del rol (AC=Activo, IN=Inactivo, BL=Bloqueado)
 *                 example: "AC"
 *     responses:
 *       200:
 *         description: Rol creado exitosamente
 *       400:
 *         description: Error de validación
 */
rutas.post('/guardar', 
    body('nombre').isLength({max:50, min:3}).withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    body('nombre').custom(async (value) => {
        if(value){
            const buscar= await modelorol.findOne({where:{nombre: value}});
            if(buscar){
                throw new Error('El nombre del rol ya existe');
            }
        }
        else{
            throw new Error('No se permite nombres vacios');
        }
    }),
    body("estado").isIn(['AC','IN','BL']).withMessage("El estado debe ser AC, IN o BL"),
    controladorrol.Guardar);

/**
 * @swagger
 * /roles/actualizar:
 *   put:
 *     summary: Actualizar un rol existente
 *     tags: [Roles]
 *     description: Actualiza los datos de un rol
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 description: Nombre del rol
 *                 example: "Administrador"
 *               estado:
 *                 type: string
 *                 enum: [AC, IN, BL]
 *                 description: Estado del rol
 *                 example: "AC"
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Rol no encontrado
 */
rutas.put('/actualizar',
    query("id").isInt().withMessage("El id debe ser un entero"),
    query("id").custom(async (value) => {
        if(value){
            const buscar= await modelorol.findOne({where:{id: value}});
            if(!buscar){
                throw new Error('El rol no existe');
            }
        }
        else{
            throw new Error('No se permite id vacio');
        }
    }),
    body('nombre').optional().isLength({max:50, min:3}).withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    body("estado").optional().isIn(['AC','IN','BL']).withMessage("El estado debe ser AC, IN o BL"),
    controladorrol.Actualizar);

/**
 * @swagger
 * /roles/eliminar:
 *   delete:
 *     summary: Eliminar un rol
 *     tags: [Roles]
 *     description: Elimina un rol por su ID
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 *       404:
 *         description: Rol no encontrado
 */
rutas.delete('/eliminar', 
    query("id").isInt().withMessage("El id debe ser un entero"),
    query("id").custom(async (value) => {
        if(value){
            const buscar= await modelorol.findOne({where:{id: value}});
            if(!buscar){
                throw new Error('El rol no existe');
            }
        }
        else{
            throw new Error('No se permite id vacio');
        }
    }),
    controladorrol.Eliminar);

/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del rol
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre del rol
 *           example: "Administrador"
 *         estado:
 *           type: string
 *           enum: [AC, IN, BL]
 *           description: Estado del rol
 *           example: "AC"
 */

module.exports=rutas;
