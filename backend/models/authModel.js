const pool = require("../config/db");

// ========================================
// BUSCAR USUARIO PARA LOGIN
// ========================================
const buscarUsuario = async (username) => {
    const resultado = await pool.query(
        `
        SELECT
            id,
            username,
            email,
            password_hash
        FROM rada.usuarios
        WHERE username = $1
        `,
        [username]
    );

    return resultado.rows[0];
};

// ========================================
// BUSCAR USUARIO POR ID
// ========================================
const buscarUsuarioPorId = async (id) => {
    const resultado = await pool.query(
        `
        SELECT
            id,
            username,
            email,
            password_hash
        FROM rada.usuarios
        WHERE id = $1
        `,
        [id]
    );

    return resultado.rows[0];
};

// ========================================
// ACTUALIZAR CONTRASEÑA
// ========================================
const actualizarContrasena = async (
    usuarioId,
    passwordHash
) => {
    const resultado = await pool.query(
        `
        UPDATE rada.usuarios
        SET password_hash = $1
        WHERE id = $2
        RETURNING
            id,
            username,
            email
        `,
        [
            passwordHash,
            usuarioId
        ]
    );

    return resultado.rows[0];
};

// ========================================
// OBTENER PERMISOS DEL USUARIO
// ========================================
const obtenerPermisosUsuario = async (
    usuarioId
) => {
    const resultado = await pool.query(
        `
        SELECT DISTINCT
            p.nombre
        FROM rada.usuarios_roles ur

        INNER JOIN rada.roles r
            ON r.id = ur.rol_id

        INNER JOIN rada.roles_permisos rp
            ON rp.rol_id = r.id

        INNER JOIN rada.permisos p
            ON p.id = rp.permiso_id

        WHERE ur.usuario_id = $1

        ORDER BY p.nombre ASC
        `,
        [usuarioId]
    );

    return resultado.rows.map(
        (fila) => fila.nombre
    );
};

// ========================================
// OBTENER ROLES DEL USUARIO
// ========================================
const obtenerRolesUsuario = async (
    usuarioId
) => {
    const resultado = await pool.query(
        `
        SELECT DISTINCT
            r.id,
            r.nombre
        FROM rada.usuarios_roles ur

        INNER JOIN rada.roles r
            ON r.id = ur.rol_id

        WHERE ur.usuario_id = $1

        ORDER BY r.nombre ASC
        `,
        [usuarioId]
    );

    return resultado.rows;
};

module.exports = {
    buscarUsuario,
    buscarUsuarioPorId,
    actualizarContrasena,
    obtenerPermisosUsuario,
    obtenerRolesUsuario
};