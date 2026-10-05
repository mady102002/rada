const express = require("express");

const router = express.Router();

const controller =
    require("../controllers/pagosSuController");

const verificarToken =
    require("../middleware/verificarToken");

const verificarPermiso =
    require("../middleware/verificarPermiso");

// ==========================================
// LISTAR PAGOS SU
// GET /pagos-su
// ==========================================
router.get(
    "/",
    verificarToken,
    verificarPermiso("PAGOS_VER"),
    controller.listarPagos
);

// ==========================================
// OBTENER PAGO SU POR ID
// GET /pagos-su/:id
// ==========================================
router.get(
    "/:id",
    verificarToken,
    verificarPermiso("PAGOS_VER"),
    controller.obtenerPago
);

// ==========================================
// CREAR PAGO SU
// POST /pagos-su
// ==========================================
router.post(
    "/",
    verificarToken,
    verificarPermiso("PAGOS_CREAR"),
    controller.crearPago
);

// ==========================================
// ACTUALIZAR PAGO SU
// PUT /pagos-su/:id
// ==========================================
router.put(
    "/:id",
    verificarToken,
    verificarPermiso("PAGOS_EDITAR"),
    controller.actualizarPago
);

// ==========================================
// ELIMINAR PAGO SU
// DELETE /pagos-su/:id
// ==========================================
router.delete(
    "/:id",
    verificarToken,
    verificarPermiso("PAGOS_ELIMINAR"),
    controller.eliminarPago
);

module.exports = router;