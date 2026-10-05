const clientesObservacionesModel = require("../models/clientesObservacionesModel");

// Listar
const listarObservaciones = async (req, res) => {
  try {
    const datos = await clientesObservacionesModel.obtenerObservaciones();
    res.json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener observaciones"
    });
  }
};

// Obtener una
const obtenerObservacion = async (req, res) => {
  try {
    const observacion =
      await clientesObservacionesModel.obtenerObservacionPorId(req.params.id);

    if (!observacion) {
      return res.status(404).json({
        mensaje: "Observación no encontrada"
      });
    }

    res.json(observacion);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener observación"
    });

  }
};

// Crear
const crearObservacion = async (req, res) => {
  try {

    const observacion =
      await clientesObservacionesModel.crearObservacion(req.body);

    res.status(201).json({
      mensaje: "Observación creada correctamente",
      observacion
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear observación"
    });

  }
};

// Actualizar
const actualizarObservacion = async (req, res) => {
  try {

    const observacion =
      await clientesObservacionesModel.actualizarObservacion(
        req.params.id,
        req.body
      );

    res.json({
      mensaje: "Observación actualizada correctamente",
      observacion
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar observación"
    });

  }
};

// Eliminar
const eliminarObservacion = async (req, res) => {
  try {

    await clientesObservacionesModel.eliminarObservacion(req.params.id);

    res.json({
      mensaje: "Observación eliminada correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar observación"
    });

  }
};

module.exports = {
  listarObservaciones,
  obtenerObservacion,
  crearObservacion,
  actualizarObservacion,
  eliminarObservacion
};