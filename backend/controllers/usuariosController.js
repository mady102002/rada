const usuariosModel = require("../models/usuariosModel");

// ==========================================
// LISTAR USUARIOS
// ==========================================
const listarUsuarios = async (req, res) => {
    try {
        const usuarios =
            await usuariosModel.obtenerUsuarios();

        res.status(200).json(usuarios);

    } catch (error) {
        console.error(
            "ERROR AL OBTENER USUARIOS:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al obtener usuarios"
        });
    }
};

// ==========================================
// OBTENER USUARIO POR ID
// ==========================================
const obtenerUsuario = async (req, res) => {
    try {
        const usuario =
            await usuariosModel.obtenerUsuarioPorId(
                req.params.id
            );

        if (!usuario) {
            return res.status(404).json({
                mensaje:
                    "Usuario no encontrado"
            });
        }

        res.status(200).json(usuario);

    } catch (error) {
        console.error(
            "ERROR AL OBTENER USUARIO:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al obtener usuario"
        });
    }
};

// ==========================================
// CREAR USUARIO + ROL
// ==========================================
const crearUsuario = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            rol_id
        } = req.body;

        console.log(
            "DATOS RECIBIDOS EN /usuarios:",
            req.body
        );

        if (
            !username ||
            !email ||
            !password ||
            !rol_id
        ) {
            return res.status(400).json({
                mensaje:
                    "Usuario, correo, contraseña y rol son obligatorios"
            });
        }

        const usuario =
            await usuariosModel.crearUsuario({
                username,
                email,
                password,
                rol_id
            });

        res.status(201).json({
            mensaje:
                "Usuario creado y rol asignado correctamente",
            usuario
        });

    } catch (error) {
        console.error(
            "ERROR AL CREAR USUARIO:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al crear usuario",
            error:
                error.message
        });
    }
};

// ==========================================
// ACTUALIZAR USUARIO + ROL
// ==========================================
const actualizarUsuario = async (req, res) => {
    try {
        const {
            username,
            email,
            rol_id
        } = req.body;

        if (
            !username ||
            !email ||
            !rol_id
        ) {
            return res.status(400).json({
                mensaje:
                    "Usuario, correo y rol son obligatorios"
            });
        }

        const usuario =
            await usuariosModel.actualizarUsuario(
                req.params.id,
                {
                    username,
                    email,
                    rol_id
                }
            );

        if (!usuario) {
            return res.status(404).json({
                mensaje:
                    "Usuario no encontrado"
            });
        }

        res.status(200).json({
            mensaje:
                "Usuario y rol actualizados correctamente",
            usuario
        });

    } catch (error) {
        console.error(
            "ERROR AL ACTUALIZAR USUARIO:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al actualizar usuario",
            error:
                error.message
        });
    }
};

// ==========================================
// ELIMINAR USUARIO
// ==========================================
const eliminarUsuario = async (req, res) => {
    try {
        const usuario =
            await usuariosModel.eliminarUsuario(
                req.params.id
            );

        if (!usuario) {
            return res.status(404).json({
                mensaje:
                    "Usuario no encontrado"
            });
        }

        res.status(200).json({
            mensaje:
                "Usuario eliminado correctamente"
        });

    } catch (error) {
        console.error(
            "ERROR AL ELIMINAR USUARIO:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al eliminar usuario",
            error:
                error.message
        });
    }
};

module.exports = {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};