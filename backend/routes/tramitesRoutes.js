const express = require("express");

const router = express.Router();

const tramitesController =
    require("../controllers/tramitesController");

const verificarToken =
    require("../middleware/verificarToken");

const verificarPermiso =
    require("../middleware/verificarPermiso");

// VER
router.get(
    "/",
    verificarToken,
    verificarPermiso(
        "TRAMITES_VER"
    ),
    tramitesController.listarTramites
);

// VER POR ID
router.get(
    "/:id",
    verificarToken,
    verificarPermiso(
        "TRAMITES_VER"
    ),
    tramitesController.obtenerTramite
);

// CREAR
router.post(
    "/",
    verificarToken,
    verificarPermiso(
        "TRAMITES_CREAR"
    ),
    tramitesController.crearTramite
);

// EDITAR
router.put(
    "/:id",
    verificarToken,
    verificarPermiso(
        "TRAMITES_EDITAR"
    ),
    tramitesController.actualizarTramite
);

// ELIMINAR
router.delete(
    "/:id",
    verificarToken,
    verificarPermiso(
        "TRAMITES_ELIMINAR"
    ),
    tramitesController.eliminarTramite
);

module.exports = router;