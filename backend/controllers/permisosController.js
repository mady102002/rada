const permisosModel = require("../models/permisosModel");

// Obtener todos los permisos
const listarPermisos = async (req, res) => {
  try {
    const permisos = await permisosModel.obtenerPermisos();

    res.status(200).json(permisos);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener los permisos",
    });
  }
};

// Obtener un permiso por ID
const obtenerPermiso = async (req, res) => {
  try {
    const { id } = req.params;

    const permiso = await permisosModel.obtenerPermisoPorId(id);

    if (!permiso) {
      return res.status(404).json({
        mensaje: "Permiso no encontrado",
      });
    }

    res.status(200).json(permiso);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener el permiso",
    });
  }
};

// Crear permiso
const crearPermiso = async (req, res) => {
  try {

    const nuevoPermiso = await permisosModel.crearPermiso(req.body);

    res.status(201).json({
      mensaje: "Permiso creado correctamente",
      permiso: nuevoPermiso,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear el permiso",
    });
  }
};

// Actualizar permiso
const actualizarPermiso = async (req, res) => {
  try {

    const { id } = req.params;

    const permiso = await permisosModel.obtenerPermisoPorId(id);

    if (!permiso) {
      return res.status(404).json({
        mensaje: "Permiso no encontrado",
      });
    }

    const permisoActualizado =
      await permisosModel.actualizarPermiso(id, req.body);

    res.status(200).json({
      mensaje: "Permiso actualizado correctamente",
      permiso: permisoActualizado,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar el permiso",
    });
  }
};

// Eliminar permiso
const eliminarPermiso = async (req, res) => {
  try {

    const { id } = req.params;

    const permiso = await permisosModel.obtenerPermisoPorId(id);

    if (!permiso) {
      return res.status(404).json({
        mensaje: "Permiso no encontrado",
      });
    }

    await permisosModel.eliminarPermiso(id);

    res.status(200).json({
      mensaje: "Permiso eliminado correctamente",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar el permiso",
    });
  }
};

module.exports = {
  listarPermisos,
  obtenerPermiso,
  crearPermiso,
  actualizarPermiso,
  eliminarPermiso,
};