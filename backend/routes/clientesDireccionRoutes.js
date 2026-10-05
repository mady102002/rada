const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/verificarToken");

const controller = require("../controllers/clientesDireccionController");

router.get("/", verificarToken, controller.listarDirecciones);

router.get("/:id", verificarToken, controller.obtenerDireccion);

router.post("/", verificarToken, controller.crearDireccion);

router.put("/:id", verificarToken, controller.actualizarDireccion);

router.delete("/:id", verificarToken, controller.eliminarDireccion);

module.exports = router;