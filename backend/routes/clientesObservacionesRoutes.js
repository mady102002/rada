const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/verificarToken");

const controller = require("../controllers/clientesObservacionesController");

router.get("/", verificarToken, controller.listarObservaciones);

router.get("/:id", verificarToken, controller.obtenerObservacion);

router.post("/", verificarToken, controller.crearObservacion);

router.put("/:id", verificarToken, controller.actualizarObservacion);

router.delete("/:id", verificarToken, controller.eliminarObservacion);

module.exports = router;
