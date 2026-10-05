const authModel =
    require("../models/authModel");

const perfilModel =
    require("../models/perfilModel");

const bcrypt =
    require("bcrypt");

const jwt =
    require("jsonwebtoken");

// ========================================
// LOGIN
// ========================================
const login = async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        const usuario =
            await authModel.buscarUsuario(
                username
            );

        if (!usuario) {
            return res.status(401).json({
                mensaje:
                    "Usuario o contraseña incorrectos"
            });
        }

        const coincide =
            await bcrypt.compare(
                password,
                usuario.password_hash
            );

        if (!coincide) {
            return res.status(401).json({
                mensaje:
                    "Usuario o contraseña incorrectos"
            });
        }

        const roles =
            await authModel.obtenerRolesUsuario(
                usuario.id
            );

        const permisos =
            await authModel.obtenerPermisosUsuario(
                usuario.id
            );

        const token =
            jwt.sign(
                {
                    id:
                        usuario.id,

                    username:
                        usuario.username
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:
                        "8h"
                }
            );

        return res.status(200).json({
            mensaje:
                "Inicio de sesión exitoso",

            token,

            usuario: {
                id:
                    usuario.id,

                username:
                    usuario.username,

                email:
                    usuario.email,

                roles,
                permisos
            }
        });

    } catch (error) {
        console.error(
            "ERROR EN LOGIN:",
            error
        );

        return res.status(500).json({
            mensaje:
                "Error interno del servidor",

            error:
                error.message
        });
    }
};

// ========================================
// PERFIL
// ========================================
const obtenerPerfil = async (
    req,
    res
) => {
    try {
        const usuarioId =
            req.usuario.id;

        const usuario =
            await perfilModel
                .obtenerPerfilUsuario(
                    usuarioId
                );

        if (!usuario) {
            return res.status(404).json({
                mensaje:
                    "Usuario no encontrado"
            });
        }

        return res
            .status(200)
            .json(usuario);

    } catch (error) {
        console.error(
            "ERROR AL OBTENER PERFIL:",
            error
        );

        return res.status(500).json({
            mensaje:
                "Error al obtener el perfil",

            error:
                error.message
        });
    }
};

// ========================================
// PERMISOS
// ========================================
const obtenerPermisos = async (
    req,
    res
) => {
    try {
        const usuarioId =
            req.usuario.id;

        const permisos =
            await authModel
                .obtenerPermisosUsuario(
                    usuarioId
                );

        return res
            .status(200)
            .json(permisos);

    } catch (error) {
        console.error(
            "ERROR AL OBTENER PERMISOS:",
            error
        );

        return res.status(500).json({
            mensaje:
                "Error al obtener los permisos",

            error:
                error.message
        });
    }
};

// ========================================
// ROLES
// ========================================
const obtenerRoles = async (
    req,
    res
) => {
    try {
        const usuarioId =
            req.usuario.id;

        const roles =
            await authModel
                .obtenerRolesUsuario(
                    usuarioId
                );

        return res
            .status(200)
            .json(roles);

    } catch (error) {
        console.error(
            "ERROR AL OBTENER ROLES:",
            error
        );

        return res.status(500).json({
            mensaje:
                "Error al obtener los roles",

            error:
                error.message
        });
    }
};

// ========================================
// CAMBIAR CONTRASEÑA
// ========================================
const cambiarContrasena = async (
    req,
    res
) => {
    try {
        const usuarioId =
            req.usuario.id;

        const {
            password_actual,
            password_nueva
        } = req.body;

        if (
            !password_actual ||
            !password_nueva
        ) {
            return res.status(400).json({
                mensaje:
                    "La contraseña actual y la nueva son obligatorias"
            });
        }

        if (
            password_nueva.length < 4
        ) {
            return res.status(400).json({
                mensaje:
                    "La nueva contraseña debe tener al menos 4 caracteres"
            });
        }

        const usuario =
            await authModel
                .buscarUsuarioPorId(
                    usuarioId
                );

        if (!usuario) {
            return res.status(404).json({
                mensaje:
                    "Usuario no encontrado"
            });
        }

        // Verificar contraseña actual
        const coincide =
            await bcrypt.compare(
                password_actual,
                usuario.password_hash
            );

        if (!coincide) {
            return res.status(400).json({
                mensaje:
                    "La contraseña actual es incorrecta"
            });
        }

        // No permitir la misma contraseña
        const mismaContrasena =
            await bcrypt.compare(
                password_nueva,
                usuario.password_hash
            );

        if (mismaContrasena) {
            return res.status(400).json({
                mensaje:
                    "La nueva contraseña debe ser diferente a la actual"
            });
        }

        // Crear nuevo hash
        const nuevoHash =
            await bcrypt.hash(
                password_nueva,
                10
            );

        await authModel
            .actualizarContrasena(
                usuarioId,
                nuevoHash
            );

        return res.status(200).json({
            mensaje:
                "Contraseña actualizada correctamente"
        });

    } catch (error) {
        console.error(
            "ERROR AL CAMBIAR CONTRASEÑA:",
            error
        );

        return res.status(500).json({
            mensaje:
                "Error al cambiar la contraseña",

            error:
                error.message
        });
    }
};

// ========================================
// EXPORTAR
// ========================================
module.exports = {
    login,
    obtenerPerfil,
    obtenerPermisos,
    obtenerRoles,
    cambiarContrasena
};