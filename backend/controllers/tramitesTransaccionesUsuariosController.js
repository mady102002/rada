const model = require("../models/tramitesTransaccionesUsuariosModel");

// Listar
const listarTransacciones = async (req, res) => {

    try {

        const datos = await model.obtenerTransacciones();

        res.json(datos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al listar transacciones"
        });

    }

};

// Obtener uno
const obtenerTransaccion = async (req, res) => {

    try {

        const dato = await model.obtenerTransaccionPorId(req.params.id);

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
const crearTransaccion = async (req, res) => {

    try {

        const dato = await model.crearTransaccion(req.body);

        res.status(201).json({
            mensaje: "Registro creado correctamente",
            dato
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear registro"
        });

    }

};

// Actualizar
const actualizarTransaccion = async (req, res) => {

    try {

        const dato = await model.actualizarTransaccion(
            req.params.id,
            req.body
        );

        res.json({
            mensaje: "Registro actualizado correctamente",
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
const eliminarTransaccion = async (req, res) => {

    try {

        await model.eliminarTransaccion(req.params.id);

        res.json({
            mensaje: "Registro eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar"
        });

    }

};

module.exports = {
    listarTransacciones,
    obtenerTransaccion,
    crearTransaccion,
    actualizarTransaccion,
    eliminarTransaccion
};