const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/verificarToken");

const controller = require("../controllers/contactosController");

router.get("/", verificarToken, controller.listarContactos);

router.get("/:id", verificarToken, controller.obtenerContacto);

router.post("/", verificarToken, controller.crearContacto);

router.put("/:id", verificarToken, controller.actualizarContacto);

router.delete("/:id", verificarToken, controller.eliminarContacto);

module.exports = router;