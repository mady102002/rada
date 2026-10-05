const pool = require("../config/db");

// Obtener todos
const obtenerObservaciones = async () => {
  const resultado = await pool.query(
    "SELECT * FROM rada.clientes_observaciones ORDER BY id ASC"
  );
  return resultado.rows;
};

// Obtener por ID
const obtenerObservacionPorId = async (id) => {
  const resultado = await pool.query(
    "SELECT * FROM rada.clientes_observaciones WHERE id = $1",
    [id]
  );
  return resultado.rows[0];
};

// Crear
const crearObservacion = async (datos) => {
  const { cliente_id, comentarios } = datos;

  const resultado = await pool.query(
    `INSERT INTO rada.clientes_observaciones
    (cliente_id, comentarios)
    VALUES ($1,$2)
    RETURNING *`,
    [cliente_id, comentarios]
  );

  return resultado.rows[0];
};

// Actualizar
const actualizarObservacion = async (id, datos) => {
  const { cliente_id, comentarios } = datos;

  const resultado = await pool.query(
    `UPDATE rada.clientes_observaciones
     SET
       cliente_id=$1,
       comentarios=$2
     WHERE id=$3
     RETURNING *`,
    [cliente_id, comentarios, id]
  );

  return resultado.rows[0];
};

// Eliminar
const eliminarObservacion = async (id) => {
  const resultado = await pool.query(
    "DELETE FROM rada.clientes_observaciones WHERE id=$1 RETURNING *",
    [id]
  );

  return resultado.rows[0];
};

module.exports = {
  obtenerObservaciones,
  obtenerObservacionPorId,
  crearObservacion,
  actualizarObservacion,
  eliminarObservacion
};