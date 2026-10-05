const pool = require("../config/db");

// Obtener todos los roles
const obtenerRoles = async () => {
  const resultado = await pool.query(
    "SELECT * FROM rada.roles ORDER BY id ASC"
  );

  return resultado.rows;
};

// Obtener un rol por ID
const obtenerRolPorId = async (id) => {
  const resultado = await pool.query(
    "SELECT * FROM rada.roles WHERE id = $1",
    [id]
  );

  return resultado.rows[0];
};

// Crear un rol
const crearRol = async (rol) => {
  const { nombre } = rol;

  const resultado = await pool.query(
    `INSERT INTO rada.roles (nombre)
     VALUES ($1)
     RETURNING *`,
    [nombre]
  );

  return resultado.rows[0];
};

// Actualizar un rol
const actualizarRol = async (id, rol) => {
  const { nombre } = rol;

  const resultado = await pool.query(
    `UPDATE rada.roles
     SET nombre = $1
     WHERE id = $2
     RETURNING *`,
    [nombre, id]
  );

  return resultado.rows[0];
};

// Eliminar un rol
const eliminarRol = async (id) => {
  const resultado = await pool.query(
    "DELETE FROM rada.roles WHERE id = $1 RETURNING *",
    [id]
  );

  return resultado.rows[0];
};

module.exports = {
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
};