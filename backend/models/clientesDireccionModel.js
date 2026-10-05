const pool = require("../config/db");

// Obtener todos
const obtenerDirecciones = async () => {
  const resultado = await pool.query(
    "SELECT * FROM rada.clientes_direccion ORDER BY id ASC"
  );

  return resultado.rows;
};

// Obtener por ID
const obtenerDireccionPorId = async (id) => {
  const resultado = await pool.query(
    "SELECT * FROM rada.clientes_direccion WHERE id=$1",
    [id]
  );

  return resultado.rows[0];
};

// Crear
const crearDireccion = async (datos) => {

  const {
    cliente_id,
    provincia,
    canton,
    parroquia,
    direccion
  } = datos;

  const resultado = await pool.query(
    `INSERT INTO rada.clientes_direccion
    (
        cliente_id,
        provincia,
        canton,
        parroquia,
        direccion
    )
    VALUES
    (
        $1,$2,$3,$4,$5
    )
    RETURNING *`,
    [
      cliente_id,
      provincia,
      canton,
      parroquia,
      direccion
    ]
  );

  return resultado.rows[0];
};

// Actualizar
const actualizarDireccion = async (id, datos) => {

  const {
    cliente_id,
    provincia,
    canton,
    parroquia,
    direccion
  } = datos;

  const resultado = await pool.query(
    `UPDATE rada.clientes_direccion
    SET
      cliente_id=$1,
      provincia=$2,
      canton=$3,
      parroquia=$4,
      direccion=$5
    WHERE id=$6
    RETURNING *`,
    [
      cliente_id,
      provincia,
      canton,
      parroquia,
      direccion,
      id
    ]
  );

  return resultado.rows[0];
};

// Eliminar
const eliminarDireccion = async (id) => {

  const resultado = await pool.query(
    "DELETE FROM rada.clientes_direccion WHERE id=$1 RETURNING *",
    [id]
  );

  return resultado.rows[0];
};

module.exports = {
  obtenerDirecciones,
  obtenerDireccionPorId,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion
};