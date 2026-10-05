const pool = require("../config/db");

// Obtener todos
const obtenerEstados = async () => {
  const resultado = await pool.query(
    "SELECT * FROM rada.clientes_estados ORDER BY id ASC"
  );
  return resultado.rows;
};

// Obtener por ID
const obtenerEstadoPorId = async (id) => {
  const resultado = await pool.query(
    "SELECT * FROM rada.clientes_estados WHERE id = $1",
    [id]
  );
  return resultado.rows[0];
};

// Crear
const crearEstado = async (datos) => {
  const {
    cliente_id,
    status_gfc,
    f_gfc_vig,
    f_gfc_max,
    f_gfc_alarma
  } = datos;

  const resultado = await pool.query(
    `INSERT INTO rada.clientes_estados
    (
      cliente_id,
      status_gfc,
      f_gfc_vig,
      f_gfc_max,
      f_gfc_alarma
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *`,
    [
      cliente_id,
      status_gfc,
      f_gfc_vig,
      f_gfc_max,
      f_gfc_alarma
    ]
  );

  return resultado.rows[0];
};

// Actualizar
const actualizarEstado = async (id, datos) => {
  const {
    cliente_id,
    status_gfc,
    f_gfc_vig,
    f_gfc_max,
    f_gfc_alarma
  } = datos;

  const resultado = await pool.query(
    `UPDATE rada.clientes_estados
    SET
      cliente_id=$1,
      status_gfc=$2,
      f_gfc_vig=$3,
      f_gfc_max=$4,
      f_gfc_alarma=$5
    WHERE id=$6
    RETURNING *`,
    [
      cliente_id,
      status_gfc,
      f_gfc_vig,
      f_gfc_max,
      f_gfc_alarma,
      id
    ]
  );

  return resultado.rows[0];
};

// Eliminar
const eliminarEstado = async (id) => {
  const resultado = await pool.query(
    "DELETE FROM rada.clientes_estados WHERE id=$1 RETURNING *",
    [id]
  );

  return resultado.rows[0];
};

module.exports = {
  obtenerEstados,
  obtenerEstadoPorId,
  crearEstado,
  actualizarEstado,
  eliminarEstado
};