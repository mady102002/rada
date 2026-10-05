const express = require("express");

const router = express.Router();

const rolesController =
    require("../controllers/rolesController");

const verificarToken =
    require("../middleware/verificarToken");

const verificarPermiso =
    require("../middleware/verificarPermiso");

// VER
router.get(
    "/",
    verificarToken,
    verificarPermiso(
        "ROLES_VER"
    ),
    rolesController.listarRoles
);

// VER POR ID
router.get(
    "/:id",
    verificarToken,
    verificarPermiso(
        "ROLES_VER"
    ),
    rolesController.obtenerRol
);

// CREAR
router.post(
    "/",
    verificarToken,
    verificarPermiso(
        "ROLES_CREAR"
    ),
    rolesController.crearRol
);

// EDITAR
router.put(
    "/:id",
    verificarToken,
    verificarPermiso(
        "ROLES_EDITAR"
    ),
    rolesController.actualizarRol
);

// ELIMINAR
router.delete(
    "/:id",
    verificarToken,
    verificarPermiso(
        "ROLES_ELIMINAR"
    ),
    rolesController.eliminarRol
);

module.exports = router;