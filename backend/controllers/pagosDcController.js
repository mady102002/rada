const model = require("../models/pagosDcModel");

// Listar pagos DC
const listarPagos = async (req, res) => {
    try {
        const datos =
            await model.obtenerPagos();

        res.status(200).json(datos);

    } catch (error) {
        console.error(
            "ERROR AL LISTAR PAGOS DC:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al listar pagos DC",
            error: error.message
        });
    }
};

// Obtener pago DC
const obtenerPago = async (req, res) => {
    try {
        const dato =
            await model.obtenerPagoPorId(
                req.params.id
            );

        if (!dato) {
            return res.status(404).json({
                mensaje:
                    "Pago DC no encontrado"
            });
        }

        res.status(200).json(dato);

    } catch (error) {
        console.error(
            "ERROR AL OBTENER PAGO DC:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al obtener pago DC",
            error: error.message
        });
    }
};

// Crear pago DC
const crearPago = async (req, res) => {
    try {
        console.log(
            "PAGO DC RECIBIDO:",
            req.body
        );

        const dato =
            await model.crearPago(
                req.body
            );

        res.status(201).json({
            mensaje:
                "Pago DC creado correctamente",
            dato
        });

    } catch (error) {
        console.error(
            "ERROR AL CREAR PAGO DC:"
        );

        console.error(error);

        res.status(500).json({
            mensaje:
                "Error al crear pago",
            error: error.message
        });
    }
};

// Actualizar pago DC
const actualizarPago = async (req, res) => {
    try {
        const existente =
            await model.obtenerPagoPorId(
                req.params.id
            );

        if (!existente) {
            return res.status(404).json({
                mensaje:
                    "Pago DC no encontrado"
            });
        }

        const dato =
            await model.actualizarPago(
                req.params.id,
                req.body
            );

        res.status(200).json({
            mensaje:
                "Pago DC actualizado correctamente",
            dato
        });

    } catch (error) {
        console.error(
            "ERROR AL ACTUALIZAR PAGO DC:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al actualizar pago",
            error: error.message
        });
    }
};

// Eliminar pago DC
const eliminarPago = async (req, res) => {
    try {
        const existente =
            await model.obtenerPagoPorId(
                req.params.id
            );

        if (!existente) {
            return res.status(404).json({
                mensaje:
                    "Pago DC no encontrado"
            });
        }

        await model.eliminarPago(
            req.params.id
        );

        res.status(200).json({
            mensaje:
                "Pago DC eliminado correctamente"
        });

    } catch (error) {
        console.error(
            "ERROR AL ELIMINAR PAGO DC:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al eliminar pago",
            error: error.message
        });
    }
};

module.exports = {
    listarPagos,
    obtenerPago,
    crearPago,
    actualizarPago,
    eliminarPago
};