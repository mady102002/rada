const express = require("express");

const router = express.Router();

const clientesController =
    require("../controllers/clientesController");

const verificarToken =
    require("../middleware/verificarToken");

const verificarPermiso =
    require("../middleware/verificarPermiso");

// VER
router.get(
    "/",
    verificarToken,
    verificarPermiso(
        "CLIENTES_VER"
    ),
    clientesController.listarClientes
);

// VER POR ID
router.get(
    "/:id",
    verificarToken,
    verificarPermiso(
        "CLIENTES_VER"
    ),
    clientesController.obtenerCliente
);

// CREAR
router.post(
    "/",
    verificarToken,
    verificarPermiso(
        "CLIENTES_CREAR"
    ),
    clientesController.crearCliente
);

// EDITAR
router.put(
    "/:id",
    verificarToken,
    verificarPermiso(
        "CLIENTES_EDITAR"
    ),
    clientesController.actualizarCliente
);

// ELIMINAR
router.delete(
    "/:id",
    verificarToken,
    verificarPermiso(
        "CLIENTES_ELIMINAR"
    ),
    clientesController.eliminarCliente
);

module.exports = router;