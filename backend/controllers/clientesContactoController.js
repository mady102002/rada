const clientesContactoModel = require("../models/clientesContactoModel");

// Obtener todos
const listarContactos = async (req, res) => {
  try {
    const contactos = await clientesContactoModel.obtenerContactos();
    res.json(contactos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener contactos" });
  }
};

// Obtener uno
const obtenerContacto = async (req, res) => {
  try {
    const contacto = await clientesContactoModel.obtenerContactoPorId(req.params.id);

    if (!contacto) {
      return res.status(404).json({
        mensaje: "Contacto no encontrado",
      });
    }

    res.json(contacto);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener contacto",
    });
  }
};

// Crear
const crearContacto = async (req, res) => {
  try {
    const contacto = await clientesContactoModel.crearContacto(req.body);

    res.status(201).json({
      mensaje: "Contacto creado correctamente",
      contacto,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear contacto",
    });
  }
};

// Actualizar
const actualizarContacto = async (req, res) => {
  try {

    const contacto = await clientesContactoModel.actualizarContacto(
      req.params.id,
      req.body
    );

    res.json({
      mensaje: "Contacto actualizado correctamente",
      contacto,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar contacto",
    });

  }
};

// Eliminar
const eliminarContacto = async (req, res) => {

  try {

    await clientesContactoModel.eliminarContacto(req.params.id);

    res.json({
      mensaje: "Contacto eliminado correctamente",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar contacto",
    });

  }
};

module.exports = {
  listarContactos,
  obtenerContacto,
  crearContacto,
  actualizarContacto,
  eliminarContacto,
};