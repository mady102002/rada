const clientesLicenciasModel = require("../models/clientesLicenciasModel");

// Listar
const listarLicencias = async (req, res) => {

  try {

    const datos = await clientesLicenciasModel.obtenerLicencias();

    res.json(datos);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener licencias"
    });

  }

};

// Obtener una
const obtenerLicencia = async (req, res) => {

  try {

    const licencia =
      await clientesLicenciasModel.obtenerLicenciaPorId(req.params.id);

    if (!licencia) {

      return res.status(404).json({
        mensaje: "Licencia no encontrada"
      });

    }

    res.json(licencia);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener licencia"
    });

  }

};

// Crear
const crearLicencia = async (req, res) => {

  try {

    const licencia =
      await clientesLicenciasModel.crearLicencia(req.body);

    res.status(201).json({
      mensaje: "Licencia creada correctamente",
      licencia
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear licencia"
    });

  }

};

// Actualizar
const actualizarLicencia = async (req, res) => {

  try {

    const licencia =
      await clientesLicenciasModel.actualizarLicencia(
        req.params.id,
        req.body
      );

    res.json({
      mensaje: "Licencia actualizada correctamente",
      licencia
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar licencia"
    });

  }

};

// Eliminar
const eliminarLicencia = async (req, res) => {

  try {

    await clientesLicenciasModel.eliminarLicencia(req.params.id);

    res.json({
      mensaje: "Licencia eliminada correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar licencia"
    });

  }

};

module.exports = {
  listarLicencias,
  obtenerLicencia,
  crearLicencia,
  actualizarLicencia,
  eliminarLicencia
};