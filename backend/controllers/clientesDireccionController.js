const clientesDireccionModel = require("../models/clientesDireccionModel");

// Listar
const listarDirecciones = async (req, res) => {

  try {

    const datos =
      await clientesDireccionModel.obtenerDirecciones();

    res.json(datos);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener direcciones"
    });

  }

};

// Obtener por ID
const obtenerDireccion = async (req, res) => {

  try {

    const direccion =
      await clientesDireccionModel.obtenerDireccionPorId(req.params.id);

    if (!direccion) {

      return res.status(404).json({
        mensaje: "Dirección no encontrada"
      });

    }

    res.json(direccion);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener dirección"
    });

  }

};

// Crear
const crearDireccion = async (req, res) => {

  try {

    const direccion =
      await clientesDireccionModel.crearDireccion(req.body);

    res.status(201).json({

      mensaje: "Dirección creada correctamente",

      direccion

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear dirección"
    });

  }

};

// Actualizar
const actualizarDireccion = async (req, res) => {

  try {

    const direccion =
      await clientesDireccionModel.actualizarDireccion(
        req.params.id,
        req.body
      );

    res.json({

      mensaje: "Dirección actualizada correctamente",

      direccion

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar"
    });

  }

};

// Eliminar
const eliminarDireccion = async (req, res) => {

  try {

    await clientesDireccionModel.eliminarDireccion(req.params.id);

    res.json({

      mensaje: "Dirección eliminada correctamente"

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      mensaje: "Error al eliminar"

    });

  }

};

module.exports = {

  listarDirecciones,
  obtenerDireccion,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion

};