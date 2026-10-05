const pool = require("../config/db");

// Obtener todas las licencias
const obtenerLicencias = async () => {
  const resultado = await pool.query(
    "SELECT * FROM rada.clientes_licencias ORDER BY id ASC"
  );
  return resultado.rows;
};

// Obtener una licencia
const obtenerLicenciaPorId = async (id) => {
  const resultado = await pool.query(
    "SELECT * FROM rada.clientes_licencias WHERE id=$1",
    [id]
  );
  return resultado.rows[0];
};

// Crear
const crearLicencia = async (datos) => {

  const {
    cliente_id,
    n_licencia,
    f_licencia,
    f_max_licencia,
    f_alarma_licencia,
    status_licencia
  } = datos;

  const resultado = await pool.query(
    `INSERT INTO rada.clientes_licencias
    (
      cliente_id,
      n_licencia,
      f_licencia,
      f_max_licencia,
      f_alarma_licencia,
      status_licencia
    )
    VALUES
    ($1,$2,$3,$4,$5,$6)
    RETURNING *`,
    [
      cliente_id,
      n_licencia,
      f_licencia,
      f_max_licencia,
      f_alarma_licencia,
      status_licencia
    ]
  );

  return resultado.rows[0];
};

// Actualizar
const actualizarLicencia = async (id, datos) => {

  const {
    cliente_id,
    n_licencia,
    f_licencia,
    f_max_licencia,
    f_alarma_licencia,
    status_licencia
  } = datos;

  const resultado = await pool.query(
    `UPDATE rada.clientes_licencias
    SET
      cliente_id=$1,
      n_licencia=$2,
      f_licencia=$3,
      f_max_licencia=$4,
      f_alarma_licencia=$5,
      status_licencia=$6
    WHERE id=$7
    RETURNING *`,
    [
      cliente_id,
      n_licencia,
      f_licencia,
      f_max_licencia,
      f_alarma_licencia,
      status_licencia,
      id
    ]
  );

  return resultado.rows[0];
};

// Eliminar
const eliminarLicencia = async (id) => {

  const resultado = await pool.query(
    "DELETE FROM rada.clientes_licencias WHERE id=$1 RETURNING *",
    [id]
  );

  return resultado.rows[0];
};

module.exports = {
  obtenerLicencias,
  obtenerLicenciaPorId,
  crearLicencia,
  actualizarLicencia,
  eliminarLicencia
};