const model = require("../models/usuariosClientesModel");

// Listar
const listarRelaciones = async (req, res) => {

    try {

        const datos = await model.obtenerRelaciones();

        res.json(datos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al listar relaciones"
        });

    }

};

// Obtener una relación
const obtenerRelacion = async (req, res) => {

    try {

        const dato = await model.obtenerRelacionPorId(req.params.id);

        if (!dato) {

            return res.status(404).json({
                mensaje: "Registro no encontrado"
            });

        }

        res.json(dato);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener registro"
        });

    }

};

// Crear
const crearRelacion = async (req, res) => {

    try {

        const dato = await model.crearRelacion(req.body);

        res.status(201).json({
            mensaje: "Relación creada correctamente",
            dato
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear relación"
        });

    }

};

// Actualizar
const actualizarRelacion = async (req, res) => {

    try {

        const dato = await model.actualizarRelacion(
            req.params.id,
            req.body
        );

        res.json({
            mensaje: "Relación actualizada correctamente",
            dato
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar"
        });

    }

};

// Eliminar
const eliminarRelacion = async (req, res) => {

    try {

        await model.eliminarRelacion(req.params.id);

        res.json({
            mensaje: "Relación eliminada correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar"
        });

    }

};

module.exports = {
    listarRelaciones,
    obtenerRelacion,
    crearRelacion,
    actualizarRelacion,
    eliminarRelacion
};