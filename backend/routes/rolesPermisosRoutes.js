const express = require("express");

const router = express.Router();

const verificarToken =
    require("../middleware/verificarToken");

const rolesPermisosController =
    require("../controllers/rolesPermisosController");


// ========================================
// OBTENER TODOS
// ========================================
router.get(
    "/",
    verificarToken,
    rolesPermisosController.listarRolesPermisos
);


// ========================================
// OBTENER PERMISOS DE UN ROL
// IMPORTANTE: debe ir antes de "/:id"
// ========================================
router.get(
    "/rol/:id",
    verificarToken,
    rolesPermisosController.obtenerPermisosRol
);


// ========================================
// GUARDAR TODOS LOS PERMISOS DE UN ROL
// ========================================
router.put(
    "/rol/:id",
    verificarToken,
    rolesPermisosController.actualizarPermisosRol
);


// ========================================
// OBTENER POR ID
// ========================================
router.get(
    "/:id",
    verificarToken,
    rolesPermisosController.obtenerRolPermiso
);


// ========================================
// CREAR
// ========================================
router.post(
    "/",
    verificarToken,
    rolesPermisosController.crearRolPermiso
);


// ========================================
// ACTUALIZAR POR ID
// ========================================
router.put(
    "/:id",
    verificarToken,
    rolesPermisosController.actualizarRolPermiso
);


// ========================================
// ELIMINAR
// ========================================
router.delete(
    "/:id",
    verificarToken,
    rolesPermisosController.eliminarRolPermiso
);


module.exports = router;