const express = require("express");

const router = express.Router();

const authController =
    require("../controllers/authController");

const verificarToken =
    require("../middleware/verificarToken");

// ========================================
// LOGIN
// ========================================
router.post(
    "/login",
    authController.login
);

// ========================================
// PERFIL
// ========================================
router.get(
    "/perfil",
    verificarToken,
    authController.obtenerPerfil
);

// ========================================
// PERMISOS
// ========================================
router.get(
    "/permisos",
    verificarToken,
    authController.obtenerPermisos
);

// ========================================
// ROLES
// ========================================
router.get(
    "/roles",
    verificarToken,
    authController.obtenerRoles
);

// ========================================
// CAMBIAR CONTRASEÑA
// ========================================
router.put(
    "/cambiar-contrasena",
    verificarToken,
    authController.cambiarContrasena
);

module.exports = router;