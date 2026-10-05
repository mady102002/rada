const express = require("express");

const router = express.Router();

const controller =
    require("../controllers/pagosDcController");

const verificarToken =
    require("../middleware/verificarToken");

const verificarPermiso =
    require("../middleware/verificarPermiso");

// ==========================================
// LISTAR PAGOS DC
// GET /pagos-dc
// ==========================================
router.get(
    "/",
    verificarToken,
    verificarPermiso("PAGOS_VER"),
    controller.listarPagos
);

// ==========================================
// OBTENER PAGO DC POR ID
// GET /pagos-dc/:id
// ==========================================
router.get(
    "/:id",
    verificarToken,
    verificarPermiso("PAGOS_VER"),
    controller.obtenerPago
);

// ==========================================
// CREAR PAGO DC
// POST /pagos-dc
// ==========================================
router.post(
    "/",
    verificarToken,
    verificarPermiso("PAGOS_CREAR"),
    controller.crearPago
);

// ==========================================
// ACTUALIZAR PAGO DC
// PUT /pagos-dc/:id
// ==========================================
router.put(
    "/:id",
    verificarToken,
    verificarPermiso("PAGOS_EDITAR"),
    controller.actualizarPago
);

// ==========================================
// ELIMINAR PAGO DC
// DELETE /pagos-dc/:id
// ==========================================
router.delete(
    "/:id",
    verificarToken,
    verificarPermiso("PAGOS_ELIMINAR"),
    controller.eliminarPago
);

module.exports = router;