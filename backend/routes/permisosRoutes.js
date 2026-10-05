const express = require("express");

const router = express.Router();

const permisosController =
    require("../controllers/permisosController");

const verificarToken =
    require("../middleware/verificarToken");

const verificarPermiso =
    require("../middleware/verificarPermiso");

// VER
router.get(
    "/",
    verificarToken,
    verificarPermiso(
        "PERMISOS_VER"
    ),
    permisosController.listarPermisos
);

// VER POR ID
router.get(
    "/:id",
    verificarToken,
    verificarPermiso(
        "PERMISOS_VER"
    ),
    permisosController.obtenerPermiso
);

// CREAR
router.post(
    "/",
    verificarToken,
    verificarPermiso(
        "PERMISOS_CREAR"
    ),
    permisosController.crearPermiso
);

// EDITAR
router.put(
    "/:id",
    verificarToken,
    verificarPermiso(
        "PERMISOS_EDITAR"
    ),
    permisosController.actualizarPermiso
);

// ELIMINAR
router.delete(
    "/:id",
    verificarToken,
    verificarPermiso(
        "PERMISOS_ELIMINAR"
    ),
    permisosController.eliminarPermiso
);

module.exports = router;