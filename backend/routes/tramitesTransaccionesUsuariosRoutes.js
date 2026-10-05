const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/verificarToken");

const controller = require("../controllers/tramitesTransaccionesUsuariosController");

router.get("/", verificarToken, controller.listarTransacciones);

router.get("/:id", verificarToken, controller.obtenerTransaccion);

router.post("/", verificarToken, controller.crearTransaccion);

router.put("/:id", verificarToken, controller.actualizarTransaccion);

router.delete("/:id", verificarToken, controller.eliminarTransaccion);

module.exports = router;