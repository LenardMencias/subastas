const { rol: ModeloRol } = require('../modelos/rol');
const { validationResult } = require('express-validator');

exports.Listar= async (resq,res)=>{
    const lista = await ModeloRol.findAll();
    res.json(lista);
};

exports.Buscar = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const data = errores.array().map(i => ({
            atributo: i.path,
            msj: i.msg
        }));
        return res.status(400).json({ msj: 'Hay errores', data: data });
    }
    const { id } = req.query;
    try {
        const rolEncontrado = await ModeloRol.findByPk(id);
        if (!rolEncontrado) {
            return res.status(404).json({ msj: 'Rol no encontrado' });
        }
        res.json(rolEncontrado);
    } catch (er) {
        console.error(er);
        res.status(500).json({ msj: 'Error al buscar el rol' });
    }
};

exports.Guardar = async (req,res)=>{
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        const data = errores.array().map(i => ({
            atributo: i.path,
            msj: i.msg
        }));
        return res.status(400).json({ msj: 'Hay errores', data: data });
    }   
    const {nombre, estado} = req.body;
    try {
        const nuevoRol = await ModeloRol.create({   
            nombre: nombre,
            estado: estado
        });
        res.json({msj:"Registro Guardado", data:nuevoRol });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msj: 'Error al guardar el rol' });
    }
};

exports.Actualizar = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const data = errores.array().map(i => ({
            atributo: i.path,
            msj: i.msg
        }));
        return res.status(400).json({ msj: 'Hay errores', data: data });
    }
    const { id, nombre, estado } = req.body;
    try {
        const rolEncontrado = await ModeloRol.findByPk(id);
        if (!rolEncontrado) {
            return res.status(404).json({ msj: 'Rol no encontrado' });
        }
        rolEncontrado.nombre = nombre;
        rolEncontrado.estado = estado;
        await rolEncontrado.save();
        res.json({ msj: 'Registro Actualizado', data: rolEncontrado });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msj: 'Error al actualizar el rol' });
    }
};

exports.Eliminar = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const data = errores.array().map(i => ({
            atributo: i.path,
            msj: i.msg
        }));
        return res.status(400).json({ msj: 'Hay errores', data: data });
    }
    const { id } = req.query;
    try {
        const rolEncontrado = await ModeloRol.findByPk(id);
        if (!rolEncontrado) {
            return res.status(404).json({ msj: 'Rol no encontrado' });
        }   
        await rolEncontrado.destroy();
        res.json({ msj: 'Registro Eliminado' });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msj: 'Error al eliminar el rol' });
    }
};

