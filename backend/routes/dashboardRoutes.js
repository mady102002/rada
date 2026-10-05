const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/verificarToken");

const dashboardController =
require("../controllers/dashboardController");

router.get(
    "/",
    verificarToken,
    dashboardController.obtenerResumen
);

module.exports = router;