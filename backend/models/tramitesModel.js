const pool = require("../config/db");

// Obtener todos
const obtenerTramites = async () => {
  const resultado = await pool.query(
    `SELECT t.*, c.razon_social
     FROM rada.tramites t
     INNER JOIN rada.clientes c
     ON t.cliente_id = c.id
     ORDER BY t.id ASC`
  );

  return resultado.rows;
};

// Obtener por ID
const obtenerTramitePorId = async (id) => {
  const resultado = await pool.query(
    "SELECT * FROM rada.tramites WHERE id=$1",
    [id]
  );

  return resultado.rows[0];
};

// Crear
const crearTramite = async (datos) => {

  const {
    num_tramite,
    cliente_id,
    status,
    fecha_tramite,
    tipo_tramite,
    categoria,
    referencia,
    observacion
  } = datos;

  const resultado = await pool.query(
    `INSERT INTO rada.tramites
    (
      num_tramite,
      cliente_id,
      status,
      fecha_tramite,
      tipo_tramite,
      categoria,
      referencia,
      observacion
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      num_tramite,
      cliente_id,
      status,
      fecha_tramite,
      tipo_tramite,
      categoria,
      referencia,
      observacion
    ]
  );

  return resultado.rows[0];
};

// Actualizar
const actualizarTramite = async (id, datos) => {

  const {
    num_tramite,
    cliente_id,
    status,
    fecha_tramite,
    tipo_tramite,
    categoria,
    referencia,
    observacion
  } = datos;

  const resultado = await pool.query(
    `UPDATE rada.tramites
     SET
      num_tramite=$1,
      cliente_id=$2,
      status=$3,
      fecha_tramite=$4,
      tipo_tramite=$5,
      categoria=$6,
      referencia=$7,
      observacion=$8
     WHERE id=$9
     RETURNING *`,
    [
      num_tramite,
      cliente_id,
      status,
      fecha_tramite,
      tipo_tramite,
      categoria,
      referencia,
      observacion,
      id
    ]
  );

  return resultado.rows[0];
};

// Eliminar
const eliminarTramite = async (id) => {

  const resultado = await pool.query(
    "DELETE FROM rada.tramites WHERE id=$1 RETURNING *",
    [id]
  );

  return resultado.rows[0];
};

module.exports = {
  obtenerTramites,
  obtenerTramitePorId,
  crearTramite,
  actualizarTramite,
  eliminarTramite
};