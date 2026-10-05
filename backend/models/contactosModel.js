const pool = require("../config/db");

// Obtener todos
const obtenerContactos = async () => {
  const resultado = await pool.query(
    "SELECT * FROM rada.contactos ORDER BY id ASC"
  );
  return resultado.rows;
};

// Obtener por ID
const obtenerContactoPorId = async (id) => {
  const resultado = await pool.query(
    "SELECT * FROM rada.contactos WHERE id=$1",
    [id]
  );
  return resultado.rows[0];
};

// Crear
const crearContacto = async (datos) => {

  const {
    cliente_id,
    nombre_completo,
    telefono,
    nombre_corto,
    genero,
    bloqueo,
    financiero
  } = datos;

  const resultado = await pool.query(
    `INSERT INTO rada.contactos
    (
      cliente_id,
      nombre_completo,
      telefono,
      nombre_corto,
      genero,
      bloqueo,
      financiero
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [
      cliente_id,
      nombre_completo,
      telefono,
      nombre_corto,
      genero,
      bloqueo,
      financiero
    ]
  );

  return resultado.rows[0];
};

// Actualizar
const actualizarContacto = async (id, datos) => {

  const {
    cliente_id,
    nombre_completo,
    telefono,
    nombre_corto,
    genero,
    bloqueo,
    financiero
  } = datos;

  const resultado = await pool.query(
    `UPDATE rada.contactos
     SET
       cliente_id=$1,
       nombre_completo=$2,
       telefono=$3,
       nombre_corto=$4,
       genero=$5,
       bloqueo=$6,
       financiero=$7
     WHERE id=$8
     RETURNING *`,
    [
      cliente_id,
      nombre_completo,
      telefono,
      nombre_corto,
      genero,
      bloqueo,
      financiero,
      id
    ]
  );

  return resultado.rows[0];
};

// Eliminar
const eliminarContacto = async (id) => {

  const resultado = await pool.query(
    "DELETE FROM rada.contactos WHERE id=$1 RETURNING *",
    [id]
  );

  return resultado.rows[0];
};

module.exports = {
  obtenerContactos,
  obtenerContactoPorId,
  crearContacto,
  actualizarContacto,
  eliminarContacto
};