const pool = require("../config/db");

// Obtener todos
const obtenerContactos = async () => {
  const resultado = await pool.query(
    "SELECT * FROM rada.clientes_contacto ORDER BY id ASC"
  );
  return resultado.rows;
};

// Obtener por ID
const obtenerContactoPorId = async (id) => {
  const resultado = await pool.query(
    "SELECT * FROM rada.clientes_contacto WHERE id = $1",
    [id]
  );
  return resultado.rows[0];
};

// Crear
const crearContacto = async (contacto) => {
  const {
    cliente_id,
    telefono,
    celular,
    email
  } = contacto;

  const resultado = await pool.query(
    `INSERT INTO rada.clientes_contacto
    (cliente_id, telefono, celular, email)
    VALUES ($1,$2,$3,$4)
    RETURNING *`,
    [
      cliente_id,
      telefono,
      celular,
      email
    ]
  );

  return resultado.rows[0];
};

// Actualizar
const actualizarContacto = async (id, contacto) => {

  const {
    cliente_id,
    telefono,
    celular,
    email
  } = contacto;

  const resultado = await pool.query(
    `UPDATE rada.clientes_contacto
    SET
      cliente_id=$1,
      telefono=$2,
      celular=$3,
      email=$4
    WHERE id=$5
    RETURNING *`,
    [
      cliente_id,
      telefono,
      celular,
      email,
      id
    ]
  );

  return resultado.rows[0];
};

// Eliminar
const eliminarContacto = async (id) => {

  const resultado = await pool.query(
    "DELETE FROM rada.clientes_contacto WHERE id=$1 RETURNING *",
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