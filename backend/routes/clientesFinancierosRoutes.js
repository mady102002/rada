const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/verificarToken");

const controller = require("../controllers/clientesFinancierosController");

router.get("/", verificarToken, controller.listarFinancieros);

router.get("/:id", verificarToken, controller.obtenerFinanciero);

router.post("/", verificarToken, controller.crearFinanciero);

router.put("/:id", verificarToken, controller.actualizarFinanciero);

router.delete("/:id", verificarToken, controller.eliminarFinanciero);

module.exports = router;