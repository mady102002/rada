const clientesModel = require("../models/clientesModel");

// Obtener todos los clientes
const listarClientes = async (req, res) => {
  try {
    const clientes = await clientesModel.obtenerClientes();
    res.status(200).json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener los clientes",
    });
  }
};

// Obtener un cliente por ID
const obtenerCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await clientesModel.obtenerClientePorId(id);

    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    res.status(200).json(cliente);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al buscar el cliente",
    });
  }
};

// Crear cliente
const crearCliente = async (req, res) => {
  try {
    const nuevoCliente = await clientesModel.crearCliente(req.body);

    res.status(201).json({
      mensaje: "Cliente creado correctamente",
      cliente: nuevoCliente,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al crear el cliente",
    });
  }
};

// Actualizar cliente
const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const clienteExistente = await clientesModel.obtenerClientePorId(id);

    if (!clienteExistente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    const clienteActualizado = await clientesModel.actualizarCliente(id, req.body);

    res.status(200).json({
      mensaje: "Cliente actualizado correctamente",
      cliente: clienteActualizado,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al actualizar el cliente",
    });
  }
};

// Eliminar cliente
const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const clienteExistente = await clientesModel.obtenerClientePorId(id);

    if (!clienteExistente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    await clientesModel.eliminarCliente(id);

    res.status(200).json({
      mensaje: "Cliente eliminado correctamente",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al eliminar el cliente",
    });
  }
};

module.exports = {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};