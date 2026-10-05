const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/verificarToken");

const controller = require("../controllers/usuariosClientesController");

router.get("/", verificarToken, controller.listarRelaciones);

router.get("/:id", verificarToken, controller.obtenerRelacion);

router.post("/", verificarToken, controller.crearRelacion);

router.put("/:id", verificarToken, controller.actualizarRelacion);

router.delete("/:id", verificarToken, controller.eliminarRelacion);

module.exports = router;