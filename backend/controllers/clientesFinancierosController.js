const clientesFinancierosModel = require("../models/clientesFinancierosModel");

// Listar
const listarFinancieros = async (req, res) => {
  try {

    const datos = await clientesFinancierosModel.obtenerFinancieros();

    res.json(datos);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener datos financieros"
    });

  }
};

// Obtener por ID
const obtenerFinanciero = async (req, res) => {
  try {

    const dato = await clientesFinancierosModel.obtenerFinancieroPorId(req.params.id);

    if (!dato) {
      return res.status(404).json({
        mensaje: "Registro no encontrado"
      });
    }

    res.json(dato);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener registro"
    });

  }
};

// Crear
const crearFinanciero = async (req, res) => {
  try {

    const dato = await clientesFinancierosModel.crearFinanciero(req.body);

    res.status(201).json({
      mensaje: "Registro creado correctamente",
      dato
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear registro"
    });

  }
};

// Actualizar
const actualizarFinanciero = async (req, res) => {
  try {

    const dato = await clientesFinancierosModel.actualizarFinanciero(
      req.params.id,
      req.body
    );

    res.json({
      mensaje: "Registro actualizado correctamente",
      dato
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar registro"
    });

  }
};

// Eliminar
const eliminarFinanciero = async (req, res) => {
  try {

    await clientesFinancierosModel.eliminarFinanciero(req.params.id);

    res.json({
      mensaje: "Registro eliminado correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar registro"
    });

  }
};

module.exports = {
  listarFinancieros,
  obtenerFinanciero,
  crearFinanciero,
  actualizarFinanciero,
  eliminarFinanciero
};