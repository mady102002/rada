const pool = require("../config/db");

// Obtener todos los permisos
const obtenerPermisos = async () => {
  const resultado = await pool.query(
    "SELECT * FROM rada.permisos ORDER BY id ASC"
  );

  return resultado.rows;
};

// Obtener un permiso por ID
const obtenerPermisoPorId = async (id) => {
  const resultado = await pool.query(
    "SELECT * FROM rada.permisos WHERE id = $1",
    [id]
  );

  return resultado.rows[0];
};

// Crear permiso
const crearPermiso = async (permiso) => {
  const { nombre, descripcion } = permiso;

  const resultado = await pool.query(
    `INSERT INTO rada.permisos (nombre, descripcion)
     VALUES ($1,$2)
     RETURNING *`,
    [nombre, descripcion]
  );

  return resultado.rows[0];
};

// Actualizar permiso
const actualizarPermiso = async (id, permiso) => {
  const { nombre, descripcion } = permiso;

  const resultado = await pool.query(
    `UPDATE rada.permisos
     SET nombre=$1,
         descripcion=$2
     WHERE id=$3
     RETURNING *`,
    [nombre, descripcion, id]
  );

  return resultado.rows[0];
};

// Eliminar permiso
const eliminarPermiso = async (id) => {
  const resultado = await pool.query(
    "DELETE FROM rada.permisos WHERE id=$1 RETURNING *",
    [id]
  );

  return resultado.rows[0];
};

module.exports = {
  obtenerPermisos,
  obtenerPermisoPorId,
  crearPermiso,
  actualizarPermiso,
  eliminarPermiso,
};