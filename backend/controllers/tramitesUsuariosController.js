const tramitesUsuariosModel = require("../models/tramitesUsuariosModel");

// Listar
const listarUsuariosTramites = async (req, res) => {

    try {

        const datos = await tramitesUsuariosModel.obtenerUsuariosTramites();

        res.json(datos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener usuarios de trámites"
        });

    }

};

// Obtener uno
const obtenerUsuarioTramite = async (req, res) => {

    try {

        const usuario = await tramitesUsuariosModel.obtenerUsuarioTramitePorId(req.params.id);

        if (!usuario) {

            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });

        }

        res.json(usuario);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener usuario"
        });

    }

};

// Crear
const crearUsuarioTramite = async (req, res) => {

    try {

        const usuario = await tramitesUsuariosModel.crearUsuarioTramite(req.body);

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear usuario"
        });

    }

};

// Actualizar
const actualizarUsuarioTramite = async (req, res) => {

    try {

        const usuario = await tramitesUsuariosModel.actualizarUsuarioTramite(
            req.params.id,
            req.body
        );

        res.json({
            mensaje: "Usuario actualizado correctamente",
            usuario
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar usuario"
        });

    }

};

// Eliminar
const eliminarUsuarioTramite = async (req, res) => {

    try {

        await tramitesUsuariosModel.eliminarUsuarioTramite(req.params.id);

        res.json({
            mensaje: "Usuario eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar usuario"
        });

    }

};

module.exports = {
    listarUsuariosTramites,
    obtenerUsuarioTramite,
    crearUsuarioTramite,
    actualizarUsuarioTramite,
    eliminarUsuarioTramite
};