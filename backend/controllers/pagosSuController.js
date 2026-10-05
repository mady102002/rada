const model = require("../models/pagosSuModel");

// Listar pagos SU
const listarPagos = async (req, res) => {
    try {
        const datos =
            await model.obtenerPagos();

        res.status(200).json(datos);

    } catch (error) {
        console.error(
            "ERROR AL LISTAR PAGOS SU:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al listar pagos SU",
            error: error.message
        });
    }
};

// Obtener pago SU
const obtenerPago = async (req, res) => {
    try {
        const dato =
            await model.obtenerPagoPorId(
                req.params.id
            );

        if (!dato) {
            return res.status(404).json({
                mensaje:
                    "Pago SU no encontrado"
            });
        }

        res.status(200).json(dato);

    } catch (error) {
        console.error(
            "ERROR AL OBTENER PAGO SU:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al obtener pago SU",
            error: error.message
        });
    }
};

// Crear pago SU
const crearPago = async (req, res) => {
    try {
        console.log(
            "PAGO SU RECIBIDO:",
            req.body
        );

        const dato =
            await model.crearPago(
                req.body
            );

        res.status(201).json({
            mensaje:
                "Pago SU creado correctamente",
            dato
        });

    } catch (error) {
        console.error(
            "ERROR AL CREAR PAGO SU:"
        );

        console.error(error);

        res.status(500).json({
            mensaje:
                "Error al crear pago",
            error: error.message
        });
    }
};

// Actualizar pago SU
const actualizarPago = async (req, res) => {
    try {
        const existente =
            await model.obtenerPagoPorId(
                req.params.id
            );

        if (!existente) {
            return res.status(404).json({
                mensaje:
                    "Pago SU no encontrado"
            });
        }

        const dato =
            await model.actualizarPago(
                req.params.id,
                req.body
            );

        res.status(200).json({
            mensaje:
                "Pago SU actualizado correctamente",
            dato
        });

    } catch (error) {
        console.error(
            "ERROR AL ACTUALIZAR PAGO SU:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al actualizar pago",
            error: error.message
        });
    }
};

// Eliminar pago SU
const eliminarPago = async (req, res) => {
    try {
        const existente =
            await model.obtenerPagoPorId(
                req.params.id
            );

        if (!existente) {
            return res.status(404).json({
                mensaje:
                    "Pago SU no encontrado"
            });
        }

        await model.eliminarPago(
            req.params.id
        );

        res.status(200).json({
            mensaje:
                "Pago SU eliminado correctamente"
        });

    } catch (error) {
        console.error(
            "ERROR AL ELIMINAR PAGO SU:",
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