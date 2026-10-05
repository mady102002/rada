const model = require("../models/usuariosRolesModel");

// Listar
const listarRelaciones = async (req, res) => {
    try {
        const datos =
            await model.obtenerRelaciones();

        res.status(200).json(datos);

    } catch (error) {
        console.error(
            "ERROR AL LISTAR RELACIONES:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al listar relaciones"
        });
    }
};

// Obtener por ID
const obtenerRelacion = async (req, res) => {
    try {
        const dato =
            await model.obtenerRelacionPorId(
                req.params.id
            );

        if (!dato) {
            return res.status(404).json({
                mensaje:
                    "Relación no encontrada"
            });
        }

        res.status(200).json(dato);

    } catch (error) {
        console.error(
            "ERROR AL OBTENER RELACIÓN:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al obtener relación"
        });
    }
};

// Crear
const crearRelacion = async (req, res) => {
    try {
        const {
            usuario_id,
            rol_id
        } = req.body;

        if (!usuario_id || !rol_id) {
            return res.status(400).json({
                mensaje:
                    "usuario_id y rol_id son obligatorios"
            });
        }

        const dato =
            await model.crearRelacion({
                usuario_id,
                rol_id
            });

        res.status(201).json({
            mensaje:
                "Rol asignado correctamente",
            dato
        });

    } catch (error) {
        console.error(
            "ERROR AL ASIGNAR ROL:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al crear relación",
            error: error.message
        });
    }
};

// Actualizar
const actualizarRelacion = async (req, res) => {
    try {
        const dato =
            await model.actualizarRelacion(
                req.params.id,
                req.body
            );

        if (!dato) {
            return res.status(404).json({
                mensaje:
                    "Relación no encontrada"
            });
        }

        res.status(200).json({
            mensaje:
                "Relación actualizada correctamente",
            dato
        });

    } catch (error) {
        console.error(
            "ERROR AL ACTUALIZAR RELACIÓN:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al actualizar",
            error: error.message
        });
    }
};

// Eliminar
const eliminarRelacion = async (req, res) => {
    try {
        const dato =
            await model.eliminarRelacion(
                req.params.id
            );

        if (!dato) {
            return res.status(404).json({
                mensaje:
                    "Relación no encontrada"
            });
        }

        res.status(200).json({
            mensaje:
                "Relación eliminada correctamente"
        });

    } catch (error) {
        console.error(
            "ERROR AL ELIMINAR RELACIÓN:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al eliminar",
            error: error.message
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