const pool = require("../config/db");

// Obtener todos
const obtenerRelaciones = async () => {

    const resultado = await pool.query(`
        SELECT
            uc.id,
            u.username,
            c.razon_social,
            uc.usuario_id,
            uc.cliente_id
        FROM rada.usuarios_clientes uc
        INNER JOIN rada.usuarios u
            ON uc.usuario_id=u.id
        INNER JOIN rada.clientes c
            ON uc.cliente_id=c.id
        ORDER BY uc.id
    `);

    return resultado.rows;
};

// Obtener por ID
const obtenerRelacionPorId = async (id) => {

    const resultado = await pool.query(
        "SELECT * FROM rada.usuarios_clientes WHERE id=$1",
        [id]
    );

    return resultado.rows[0];
};

// Crear
const crearRelacion = async (datos) => {

    const {
        usuario_id,
        cliente_id
    } = datos;

    const resultado = await pool.query(
        `INSERT INTO rada.usuarios_clientes
        (
            usuario_id,
            cliente_id
        )
        VALUES
        ($1,$2)
        RETURNING *`,
        [
            usuario_id,
            cliente_id
        ]
    );

    return resultado.rows[0];
};

// Actualizar
const actualizarRelacion = async (id, datos) => {

    const {
        usuario_id,
        cliente_id
    } = datos;

    const resultado = await pool.query(
        `UPDATE rada.usuarios_clientes
         SET
            usuario_id=$1,
            cliente_id=$2
         WHERE id=$3
         RETURNING *`,
        [
            usuario_id,
            cliente_id,
            id
        ]
    );

    return resultado.rows[0];
};

// Eliminar
const eliminarRelacion = async (id) => {

    const resultado = await pool.query(
        "DELETE FROM rada.usuarios_clientes WHERE id=$1 RETURNING *",
        [id]
    );

    return resultado.rows[0];
};

module.exports = {
    obtenerRelaciones,
    obtenerRelacionPorId,
    crearRelacion,
    actualizarRelacion,
    eliminarRelacion
};