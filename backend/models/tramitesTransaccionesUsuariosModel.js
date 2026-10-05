const pool = require("../config/db");

// Obtener todos
const obtenerTransacciones = async () => {

    const resultado = await pool.query(`
        SELECT
            ttu.id,
            t.num_tramite,
            u.nombre,
            ttu.servidor,
            ttu.tramite_id,
            ttu.usuario_id
        FROM rada.tramites_transacciones_usuarios ttu
        INNER JOIN rada.tramites t
            ON ttu.tramite_id=t.id
        INNER JOIN rada.tramites_usuarios u
            ON ttu.usuario_id=u.id
        ORDER BY ttu.id
    `);

    return resultado.rows;
};

// Obtener por ID
const obtenerTransaccionPorId = async (id) => {

    const resultado = await pool.query(
        "SELECT * FROM rada.tramites_transacciones_usuarios WHERE id=$1",
        [id]
    );

    return resultado.rows[0];
};

// Crear
const crearTransaccion = async (datos) => {

    const {
        tramite_id,
        usuario_id,
        servidor
    } = datos;

    const resultado = await pool.query(
        `INSERT INTO rada.tramites_transacciones_usuarios
        (
            tramite_id,
            usuario_id,
            servidor
        )
        VALUES
        ($1,$2,$3)
        RETURNING *`,
        [
            tramite_id,
            usuario_id,
            servidor
        ]
    );

    return resultado.rows[0];

};

// Actualizar
const actualizarTransaccion = async (id, datos) => {

    const {
        tramite_id,
        usuario_id,
        servidor
    } = datos;

    const resultado = await pool.query(
        `UPDATE rada.tramites_transacciones_usuarios
         SET
            tramite_id=$1,
            usuario_id=$2,
            servidor=$3
         WHERE id=$4
         RETURNING *`,
        [
            tramite_id,
            usuario_id,
            servidor,
            id
        ]
    );

    return resultado.rows[0];

};

// Eliminar
const eliminarTransaccion = async (id) => {

    const resultado = await pool.query(
        "DELETE FROM rada.tramites_transacciones_usuarios WHERE id=$1 RETURNING *",
        [id]
    );

    return resultado.rows[0];

};

module.exports = {
    obtenerTransacciones,
    obtenerTransaccionPorId,
    crearTransaccion,
    actualizarTransaccion,
    eliminarTransaccion
};