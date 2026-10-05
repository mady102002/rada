const rolesModel = require("../models/rolesModel");

// Obtener todos los roles
const listarRoles = async (req, res) => {
  try {
    const roles = await rolesModel.obtenerRoles();

    res.status(200).json(roles);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener los roles",
    });
  }
};

// Obtener un rol por ID
const obtenerRol = async (req, res) => {
  try {
    const { id } = req.params;

    const rol = await rolesModel.obtenerRolPorId(id);

    if (!rol) {
      return res.status(404).json({
        mensaje: "Rol no encontrado",
      });
    }

    res.status(200).json(rol);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener el rol",
    });
  }
};

// Crear un nuevo rol
const crearRol = async (req, res) => {
  try {
    const nuevoRol = await rolesModel.crearRol(req.body);

    res.status(201).json({
      mensaje: "Rol creado correctamente",
      rol: nuevoRol,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear el rol",
    });
  }
};

// Actualizar un rol
const actualizarRol = async (req, res) => {
  try {
    const { id } = req.params;

    const rolExistente = await rolesModel.obtenerRolPorId(id);

    if (!rolExistente) {
      return res.status(404).json({
        mensaje: "Rol no encontrado",
      });
    }

    const rolActualizado = await rolesModel.actualizarRol(id, req.body);

    res.status(200).json({
      mensaje: "Rol actualizado correctamente",
      rol: rolActualizado,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar el rol",
    });
  }
};

// Eliminar un rol
const eliminarRol = async (req, res) => {
  try {
    const { id } = req.params;

    const rolExistente = await rolesModel.obtenerRolPorId(id);

    if (!rolExistente) {
      return res.status(404).json({
        mensaje: "Rol no encontrado",
      });
    }

    await rolesModel.eliminarRol(id);

    res.status(200).json({
      mensaje: "Rol eliminado correctamente",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar el rol",
    });
  }
};

module.exports = {
  listarRoles,
  obtenerRol,
  crearRol,
  actualizarRol,
  eliminarRol,
};