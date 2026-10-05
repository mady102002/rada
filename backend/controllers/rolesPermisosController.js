const rolesPermisosModel =
    require("../models/rolesPermisosModel");


// ========================================
// LISTAR TODOS
// ========================================
const listarRolesPermisos = async (req, res) => {
    try {
        const datos =
            await rolesPermisosModel.obtenerRolesPermisos();

        res.status(200).json(datos);

    } catch (error) {
        console.error(
            "ERROR AL OBTENER ROLES-PERMISOS:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al obtener los roles y permisos",
            error: error.message
        });
    }
};


// ========================================
// OBTENER POR ID
// ========================================
const obtenerRolPermiso = async (req, res) => {
    try {
        const { id } = req.params;

        const dato =
            await rolesPermisosModel.obtenerRolPermisoPorId(
                id
            );

        if (!dato) {
            return res.status(404).json({
                mensaje:
                    "Relación rol-permiso no encontrada"
            });
        }

        res.status(200).json(dato);

    } catch (error) {
        console.error(
            "ERROR AL OBTENER ROL-PERMISO:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al obtener la relación rol-permiso",
            error: error.message
        });
    }
};


// ========================================
// OBTENER PERMISOS DE UN ROL
// ========================================
const obtenerPermisosRol = async (req, res) => {
    try {
        const { id } = req.params;

        const permisos =
            await rolesPermisosModel.obtenerPermisosPorRol(
                id
            );

        res.status(200).json(permisos);

    } catch (error) {
        console.error(
            "ERROR AL OBTENER PERMISOS DEL ROL:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al obtener los permisos del rol",
            error: error.message
        });
    }
};


// ========================================
// CREAR
// ========================================
const crearRolPermiso = async (req, res) => {
    try {
        const {
            rol_id,
            permiso_id
        } = req.body;

        if (!rol_id || !permiso_id) {
            return res.status(400).json({
                mensaje:
                    "rol_id y permiso_id son obligatorios"
            });
        }

        const nuevo =
            await rolesPermisosModel.crearRolPermiso(
                {
                    rol_id,
                    permiso_id
                }
            );

        res.status(201).json({
            mensaje:
                "Permiso asignado al rol correctamente",
            dato: nuevo
        });

    } catch (error) {
        console.error(
            "ERROR AL CREAR ROL-PERMISO:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al asignar el permiso al rol",
            error: error.message
        });
    }
};


// ========================================
// ACTUALIZAR POR ID
// ========================================
const actualizarRolPermiso = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            rol_id,
            permiso_id
        } = req.body;

        const actualizado =
            await rolesPermisosModel.actualizarRolPermiso(
                id,
                {
                    rol_id,
                    permiso_id
                }
            );

        if (!actualizado) {
            return res.status(404).json({
                mensaje:
                    "Relación rol-permiso no encontrada"
            });
        }

        res.status(200).json({
            mensaje:
                "Relación actualizada correctamente",
            dato: actualizado
        });

    } catch (error) {
        console.error(
            "ERROR AL ACTUALIZAR ROL-PERMISO:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al actualizar la relación rol-permiso",
            error: error.message
        });
    }
};


// ========================================
// GUARDAR TODOS LOS PERMISOS DEL ROL
// ========================================
const actualizarPermisosRol = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            permisos
        } = req.body;

        if (!Array.isArray(permisos)) {
            return res.status(400).json({
                mensaje:
                    "El campo permisos debe ser un arreglo"
            });
        }

        const permisosActualizados =
            await rolesPermisosModel.actualizarPermisosPorRol(
                id,
                permisos
            );

        res.status(200).json({
            mensaje:
                "Permisos del rol actualizados correctamente",
            permisos: permisosActualizados
        });

    } catch (error) {
        console.error(
            "ERROR AL ACTUALIZAR PERMISOS DEL ROL:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al actualizar los permisos del rol",
            error: error.message
        });
    }
};


// ========================================
// ELIMINAR
// ========================================
const eliminarRolPermiso = async (req, res) => {
    try {
        const { id } = req.params;

        const eliminado =
            await rolesPermisosModel.eliminarRolPermiso(
                id
            );

        if (!eliminado) {
            return res.status(404).json({
                mensaje:
                    "Relación rol-permiso no encontrada"
            });
        }

        res.status(200).json({
            mensaje:
                "Permiso eliminado del rol correctamente"
        });

    } catch (error) {
        console.error(
            "ERROR AL ELIMINAR ROL-PERMISO:",
            error
        );

        res.status(500).json({
            mensaje:
                "Error al eliminar el permiso del rol",
            error: error.message
        });
    }
};


module.exports = {
    listarRolesPermisos,
    obtenerRolPermiso,
    obtenerPermisosRol,
    crearRolPermiso,
    actualizarRolPermiso,
    actualizarPermisosRol,
    eliminarRolPermiso
};