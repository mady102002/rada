const pool = require("../config/db");

// Obtener todos
const obtenerUsuariosTramites = async () => {
    const resultado = await pool.query(
        "SELECT * FROM rada.tramites_usuarios ORDER BY id ASC"
    );

    return resultado.rows;
};

// Obtener por ID
const obtenerUsuarioTramitePorId = async (id) => {
    const resultado = await pool.query(
        "SELECT * FROM rada.tramites_usuarios WHERE id=$1",
        [id]
    );

    return resultado.rows[0];
};

// Crear
const crearUsuarioTramite = async (datos) => {

    const { nombre } = datos;

    const resultado = await pool.query(
        `INSERT INTO rada.tramites_usuarios
        (nombre)
        VALUES ($1)
        RETURNING *`,
        [nombre]
    );

    return resultado.rows[0];
};

// Actualizar
const actualizarUsuarioTramite = async (id, datos) => {

    const { nombre } = datos;

    const resultado = await pool.query(
        `UPDATE rada.tramites_usuarios
         SET nombre=$1
         WHERE id=$2
         RETURNING *`,
        [nombre, id]
    );

    return resultado.rows[0];
};

// Eliminar
const eliminarUsuarioTramite = async (id) => {

    const resultado = await pool.query(
        "DELETE FROM rada.tramites_usuarios WHERE id=$1 RETURNING *",
        [id]
    );

    return resultado.rows[0];
};

module.exports = {
    obtenerUsuariosTramites,
    obtenerUsuarioTramitePorId,
    crearUsuarioTramite,
    actualizarUsuarioTramite,
    eliminarUsuarioTramite
};