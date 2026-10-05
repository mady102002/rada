const pool = require("../config/db");

// Obtener todos
const obtenerRelaciones = async () => {

    const resultado = await pool.query(`
        SELECT
            ur.id,
            ur.usuario_id,
            ur.rol_id,
            u.username,
            r.nombre AS rol
        FROM rada.usuarios_roles ur
        INNER JOIN rada.usuarios u
            ON ur.usuario_id = u.id
        INNER JOIN rada.roles r
            ON ur.rol_id = r.id
        ORDER BY ur.id ASC
    `);

    return resultado.rows;
};

// Obtener por ID
const obtenerRelacionPorId = async (id) => {

    const resultado = await pool.query(
        "SELECT * FROM rada.usuarios_roles WHERE id=$1",
        [id]
    );

    return resultado.rows[0];
};

// Crear
const crearRelacion = async (datos) => {

    const { usuario_id, rol_id } = datos;

    const resultado = await pool.query(
        `INSERT INTO rada.usuarios_roles
        (usuario_id, rol_id)
        VALUES ($1,$2)
        RETURNING *`,
        [usuario_id, rol_id]
    );

    return resultado.rows[0];
};

// Actualizar
const actualizarRelacion = async (id, datos) => {

    const { usuario_id, rol_id } = datos;

    const resultado = await pool.query(
        `UPDATE rada.usuarios_roles
        SET
            usuario_id=$1,
            rol_id=$2
        WHERE id=$3
        RETURNING *`,
        [usuario_id, rol_id, id]
    );

    return resultado.rows[0];
};

// Eliminar
const eliminarRelacion = async (id) => {

    const resultado = await pool.query(
        "DELETE FROM rada.usuarios_roles WHERE id=$1 RETURNING *",
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