const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/verificarToken");

const controller = require("../controllers/tramitesUsuariosController");

router.get("/", verificarToken, controller.listarUsuariosTramites);

router.get("/:id", verificarToken, controller.obtenerUsuarioTramite);

router.post("/", verificarToken, controller.crearUsuarioTramite);

router.put("/:id", verificarToken, controller.actualizarUsuarioTramite);

router.delete("/:id", verificarToken, controller.eliminarUsuarioTramite);

module.exports = router;