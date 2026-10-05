const pool = require("../config/db");

// Obtener todos
const obtenerFinancieros = async () => {
  const resultado = await pool.query(
    "SELECT * FROM rada.clientes_financieros ORDER BY id ASC"
  );

  return resultado.rows;
};

// Obtener por ID
const obtenerFinancieroPorId = async (id) => {
  const resultado = await pool.query(
    "SELECT * FROM rada.clientes_financieros WHERE id=$1",
    [id]
  );

  return resultado.rows[0];
};

// Crear
const crearFinanciero = async (datos) => {

  const {
    cliente_id,
    gfc_entidad,
    gfc_monto,
    gfc_anios,
    tarifa,
    f_ini_ser
  } = datos;

  const resultado = await pool.query(
    `INSERT INTO rada.clientes_financieros
    (
      cliente_id,
      gfc_entidad,
      gfc_monto,
      gfc_anios,
      tarifa,
      f_ini_ser
    )
    VALUES
    ($1,$2,$3,$4,$5,$6)
    RETURNING *`,
    [
      cliente_id,
      gfc_entidad,
      gfc_monto,
      gfc_anios,
      tarifa,
      f_ini_ser
    ]
  );

  return resultado.rows[0];
};

// Actualizar
const actualizarFinanciero = async (id, datos) => {

  const {
    cliente_id,
    gfc_entidad,
    gfc_monto,
    gfc_anios,
    tarifa,
    f_ini_ser
  } = datos;

  const resultado = await pool.query(
    `UPDATE rada.clientes_financieros
     SET
        cliente_id=$1,
        gfc_entidad=$2,
        gfc_monto=$3,
        gfc_anios=$4,
        tarifa=$5,
        f_ini_ser=$6
     WHERE id=$7
     RETURNING *`,
    [
      cliente_id,
      gfc_entidad,
      gfc_monto,
      gfc_anios,
      tarifa,
      f_ini_ser,
      id
    ]
  );

  return resultado.rows[0];
};

// Eliminar
const eliminarFinanciero = async (id) => {

  const resultado = await pool.query(
    "DELETE FROM rada.clientes_financieros WHERE id=$1 RETURNING *",
    [id]
  );

  return resultado.rows[0];
};

module.exports = {
  obtenerFinancieros,
  obtenerFinancieroPorId,
  crearFinanciero,
  actualizarFinanciero,
  eliminarFinanciero
};