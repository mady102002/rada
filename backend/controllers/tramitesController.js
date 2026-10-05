const tramitesModel = require("../models/tramitesModel");

// Listar
const listarTramites = async (req, res) => {
  try {

    const datos = await tramitesModel.obtenerTramites();

    res.json(datos);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener trámites"
    });

  }
};

// Obtener uno
const obtenerTramite = async (req, res) => {
  try {

    const tramite = await tramitesModel.obtenerTramitePorId(req.params.id);

    if (!tramite) {
      return res.status(404).json({
        mensaje: "Trámite no encontrado"
      });
    }

    res.json(tramite);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener trámite"
    });

  }
};

// Crear
const crearTramite = async (req, res) => {
  try {

    const tramite = await tramitesModel.crearTramite(req.body);

    res.status(201).json({
      mensaje: "Trámite creado correctamente",
      tramite
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear trámite",
      error: error.message
    });

  }
};

// Actualizar
const actualizarTramite = async (req, res) => {
  try {

    const tramite = await tramitesModel.actualizarTramite(
      req.params.id,
      req.body
    );

    res.json({
      mensaje: "Trámite actualizado correctamente",
      tramite
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar trámite",
      error: error.message
    });

  }
};

// Eliminar
const eliminarTramite = async (req, res) => {
  try {

    await tramitesModel.eliminarTramite(req.params.id);

    res.json({
      mensaje: "Trámite eliminado correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar trámite",
      error: error.message
    });

  }
};

module.exports = {
  listarTramites,
  obtenerTramite,
  crearTramite,
  actualizarTramite,
  eliminarTramite
};