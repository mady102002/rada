const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/verificarToken");

const controller = require("../controllers/clientesLicenciasController");

router.get("/", verificarToken, controller.listarLicencias);

router.get("/:id", verificarToken, controller.obtenerLicencia);

router.post("/", verificarToken, controller.crearLicencia);

router.put("/:id", verificarToken, controller.actualizarLicencia);

router.delete("/:id", verificarToken, controller.eliminarLicencia);

module.exports = router;