const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/verificarToken");
const controller = require("../controllers/clientesEstadosController");

router.get("/", verificarToken, controller.listarEstados);

router.get("/:id", verificarToken, controller.obtenerEstado);

router.post("/", verificarToken, controller.crearEstado);

router.put("/:id", verificarToken, controller.actualizarEstado);

router.delete("/:id", verificarToken, controller.eliminarEstado);

module.exports = router;