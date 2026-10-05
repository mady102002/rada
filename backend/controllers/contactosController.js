const contactosModel = require("../models/contactosModel");

// Listar
const listarContactos = async (req, res) => {

    try {

        const datos = await contactosModel.obtenerContactos();

        res.json(datos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener contactos"
        });

    }

};

// Obtener uno
const obtenerContacto = async (req, res) => {

    try {

        const contacto = await contactosModel.obtenerContactoPorId(req.params.id);

        if (!contacto) {

            return res.status(404).json({
                mensaje: "Contacto no encontrado"
            });

        }

        res.json(contacto);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener contacto"
        });

    }

};

// Crear
const crearContacto = async (req, res) => {

    try {

        const contacto = await contactosModel.crearContacto(req.body);

        res.status(201).json({
            mensaje: "Contacto creado correctamente",
            contacto
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear contacto"
        });

    }

};

// Actualizar
const actualizarContacto = async (req, res) => {

    try {

        const contacto = await contactosModel.actualizarContacto(
            req.params.id,
            req.body
        );

        res.json({
            mensaje: "Contacto actualizado correctamente",
            contacto
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar contacto"
        });

    }

};

// Eliminar
const eliminarContacto = async (req, res) => {

    try {

        await contactosModel.eliminarContacto(req.params.id);

        res.json({
            mensaje: "Contacto eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar contacto"
        });

    }

};

module.exports = {
    listarContactos,
    obtenerContacto,
    crearContacto,
    actualizarContacto,
    eliminarContacto
};