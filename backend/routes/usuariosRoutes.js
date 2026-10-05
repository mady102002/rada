const express = require("express");

const router = express.Router();

const usuariosController =
    require("../controllers/usuariosController");

const verificarToken =
    require("../middleware/verificarToken");

const verificarPermiso =
    require("../middleware/verificarPermiso");

// VER
router.get(
    "/",
    verificarToken,
    verificarPermiso(
        "USUARIOS_VER"
    ),
    usuariosController.listarUsuarios
);

// VER POR ID
router.get(
    "/:id",
    verificarToken,
    verificarPermiso(
        "USUARIOS_VER"
    ),
    usuariosController.obtenerUsuario
);

// CREAR
router.post(
    "/",
    verificarToken,
    verificarPermiso(
        "USUARIOS_CREAR"
    ),
    usuariosController.crearUsuario
);

// EDITAR
router.put(
    "/:id",
    verificarToken,
    verificarPermiso(
        "USUARIOS_EDITAR"
    ),
    usuariosController.actualizarUsuario
);

// ELIMINAR
router.delete(
    "/:id",
    verificarToken,
    verificarPermiso(
        "USUARIOS_ELIMINAR"
    ),
    usuariosController.eliminarUsuario
);

module.exports = router;