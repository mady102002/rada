const clientesEstadosModel = require("../models/clientesEstadosModel");

// Listar
const listarEstados = async (req, res) => {
  try {
    const estados = await clientesEstadosModel.obtenerEstados();
    res.json(estados);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener estados"
    });
  }
};

// Obtener por ID
const obtenerEstado = async (req, res) => {
  try {
    const estado = await clientesEstadosModel.obtenerEstadoPorId(req.params.id);

    if (!estado) {
      return res.status(404).json({
        mensaje: "Estado no encontrado"
      });
    }

    res.json(estado);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener estado"
    });
  }
};

// Crear
const crearEstado = async (req, res) => {
  try {
    const estado = await clientesEstadosModel.crearEstado(req.body);

    res.status(201).json({
      mensaje: "Estado creado correctamente",
      estado
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear estado"
    });
  }
};

// Actualizar
const actualizarEstado = async (req, res) => {
  try {

    const estado = await clientesEstadosModel.actualizarEstado(
      req.params.id,
      req.body
    );

    res.json({
      mensaje: "Estado actualizado correctamente",
      estado
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar estado"
    });
  }
};

// Eliminar
const eliminarEstado = async (req, res) => {
  try {

    await clientesEstadosModel.eliminarEstado(req.params.id);

    res.json({
      mensaje: "Estado eliminado correctamente"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar estado"
    });
  }
};

module.exports = {
  listarEstados,
  obtenerEstado,
  crearEstado,
  actualizarEstado,
  eliminarEstado
};