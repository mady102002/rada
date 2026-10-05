const pool = require("../config/db");
const bcrypt = require("bcrypt");

// ==========================================
// OBTENER TODOS LOS USUARIOS
// ==========================================
const obtenerUsuarios = async () => {
    const resultado =
        await pool.query(`
            SELECT
                u.id,
                u.username,
                u.email,
                u.created_at,
                r.id AS rol_id,
                r.nombre AS rol
            FROM rada.usuarios u

            LEFT JOIN rada.usuarios_roles ur
                ON ur.usuario_id = u.id

            LEFT JOIN rada.roles r
                ON r.id = ur.rol_id

            ORDER BY u.id ASC
        `);

    return resultado.rows;
};

// ==========================================
// OBTENER USUARIO POR ID
// ==========================================
const obtenerUsuarioPorId = async (id) => {
    const resultado =
        await pool.query(
            `
            SELECT
                u.id,
                u.username,
                u.email,
                u.created_at,
                r.id AS rol_id,
                r.nombre AS rol
            FROM rada.usuarios u

            LEFT JOIN rada.usuarios_roles ur
                ON ur.usuario_id = u.id

            LEFT JOIN rada.roles r
                ON r.id = ur.rol_id

            WHERE u.id = $1
            `,
            [id]
        );

    return resultado.rows[0];
};

// ==========================================
// CREAR USUARIO + ASIGNAR ROL
// ==========================================
const crearUsuario = async (usuario) => {
    const {
        username,
        email,
        password,
        rol_id
    } = usuario;

    const cliente =
        await pool.connect();

    try {
        await cliente.query("BEGIN");

        const password_hash =
            await bcrypt.hash(
                password,
                10
            );

        const resultadoUsuario =
            await cliente.query(
                `
                INSERT INTO rada.usuarios
                (
                    username,
                    email,
                    password_hash
                )
                VALUES
                (
                    $1,
                    $2,
                    $3
                )
                RETURNING
                    id,
                    username,
                    email,
                    created_at
                `,
                [
                    username,
                    email,
                    password_hash
                ]
            );

        const usuarioCreado =
            resultadoUsuario.rows[0];

        await cliente.query(
            `
            INSERT INTO rada.usuarios_roles
            (
                usuario_id,
                rol_id
            )
            VALUES
            (
                $1,
                $2
            )
            `,
            [
                usuarioCreado.id,
                rol_id
            ]
        );

        await cliente.query(
            "COMMIT"
        );

        return {
            ...usuarioCreado,
            rol_id:
                Number(rol_id)
        };

    } catch (error) {
        await cliente.query(
            "ROLLBACK"
        );

        throw error;

    } finally {
        cliente.release();
    }
};

// ==========================================
// ACTUALIZAR USUARIO + ROL
// ==========================================
const actualizarUsuario = async (
    id,
    usuario
) => {
    const {
        username,
        email,
        rol_id
    } = usuario;

    const cliente =
        await pool.connect();

    try {
        await cliente.query("BEGIN");

        const resultadoUsuario =
            await cliente.query(
                `
                UPDATE rada.usuarios
                SET
                    username = $1,
                    email = $2
                WHERE id = $3
                RETURNING
                    id,
                    username,
                    email,
                    created_at
                `,
                [
                    username,
                    email,
                    id
                ]
            );

        if (
            resultadoUsuario.rows.length === 0
        ) {
            await cliente.query(
                "ROLLBACK"
            );

            return undefined;
        }

        // Eliminar rol anterior
        await cliente.query(
            `
            DELETE FROM rada.usuarios_roles
            WHERE usuario_id = $1
            `,
            [id]
        );

        // Asignar nuevo rol
        await cliente.query(
            `
            INSERT INTO rada.usuarios_roles
            (
                usuario_id,
                rol_id
            )
            VALUES
            (
                $1,
                $2
            )
            `,
            [
                id,
                rol_id
            ]
        );

        await cliente.query(
            "COMMIT"
        );

        return {
            ...resultadoUsuario.rows[0],
            rol_id:
                Number(rol_id)
        };

    } catch (error) {
        await cliente.query(
            "ROLLBACK"
        );

        throw error;

    } finally {
        cliente.release();
    }
};

// ==========================================
// ELIMINAR USUARIO
// ==========================================
const eliminarUsuario = async (id) => {
    const cliente =
        await pool.connect();

    try {
        await cliente.query(
            "BEGIN"
        );

        // Primero elimina relación usuario-rol
        await cliente.query(
            `
            DELETE FROM rada.usuarios_roles
            WHERE usuario_id = $1
            `,
            [id]
        );

        const resultado =
            await cliente.query(
                `
                DELETE FROM rada.usuarios
                WHERE id = $1
                RETURNING *
                `,
                [id]
            );

        await cliente.query(
            "COMMIT"
        );

        return resultado.rows[0];

    } catch (error) {
        await cliente.query(
            "ROLLBACK"
        );

        throw error;

    } finally {
        cliente.release();
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};

