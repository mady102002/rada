const pool = require("../config/db");

// ========================================
// OBTENER TODOS
// ========================================
const obtenerRolesPermisos = async () => {
    const resultado = await pool.query(`
        SELECT
            rp.id,
            rp.rol_id,
            r.nombre AS rol,
            rp.permiso_id,
            p.nombre AS permiso
        FROM rada.roles_permisos rp
        INNER JOIN rada.roles r
            ON rp.rol_id = r.id
        INNER JOIN rada.permisos p
            ON rp.permiso_id = p.id
        ORDER BY rp.id ASC
    `);

    return resultado.rows;
};


// ========================================
// OBTENER POR ID
// ========================================
const obtenerRolPermisoPorId = async (id) => {
    const resultado = await pool.query(
        `
        SELECT *
        FROM rada.roles_permisos
        WHERE id = $1
        `,
        [id]
    );

    return resultado.rows[0];
};


// ========================================
// OBTENER PERMISOS DE UN ROL
// ========================================
const obtenerPermisosPorRol = async (rolId) => {
    const resultado = await pool.query(
        `
        SELECT
            rp.id,
            rp.rol_id,
            rp.permiso_id,
            p.nombre AS permiso,
            p.descripcion
        FROM rada.roles_permisos rp
        INNER JOIN rada.permisos p
            ON p.id = rp.permiso_id
        WHERE rp.rol_id = $1
        ORDER BY p.nombre ASC
        `,
        [rolId]
    );

    return resultado.rows;
};


// ========================================
// CREAR
// ========================================
const crearRolPermiso = async (datos) => {
    const {
        rol_id,
        permiso_id
    } = datos;

    const resultado = await pool.query(
        `
        INSERT INTO rada.roles_permisos
        (
            rol_id,
            permiso_id
        )
        VALUES
        (
            $1,
            $2
        )
        RETURNING *
        `,
        [
            rol_id,
            permiso_id
        ]
    );

    return resultado.rows[0];
};


// ========================================
// ACTUALIZAR POR ID
// ========================================
const actualizarRolPermiso = async (id, datos) => {
    const {
        rol_id,
        permiso_id
    } = datos;

    const resultado = await pool.query(
        `
        UPDATE rada.roles_permisos
        SET
            rol_id = $1,
            permiso_id = $2
        WHERE id = $3
        RETURNING *
        `,
        [
            rol_id,
            permiso_id,
            id
        ]
    );

    return resultado.rows[0];
};


// ========================================
// ELIMINAR POR ID
// ========================================
const eliminarRolPermiso = async (id) => {
    const resultado = await pool.query(
        `
        DELETE FROM rada.roles_permisos
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return resultado.rows[0];
};


// ========================================
// REEMPLAZAR TODOS LOS PERMISOS DE UN ROL
// ========================================
const actualizarPermisosPorRol = async (
    rolId,
    permisos
) => {
    const cliente = await pool.connect();

    try {
        await cliente.query("BEGIN");

        // Eliminar permisos anteriores
        await cliente.query(
            `
            DELETE FROM rada.roles_permisos
            WHERE rol_id = $1
            `,
            [rolId]
        );

        // Insertar los nuevos permisos
        for (const permisoId of permisos) {
            await cliente.query(
                `
                INSERT INTO rada.roles_permisos
                (
                    rol_id,
                    permiso_id
                )
                VALUES ($1, $2)
                `,
                [
                    rolId,
                    permisoId
                ]
            );
        }

        await cliente.query("COMMIT");

        const resultado = await pool.query(
            `
            SELECT
                rp.id,
                rp.rol_id,
                rp.permiso_id,
                p.nombre AS permiso,
                p.descripcion
            FROM rada.roles_permisos rp
            INNER JOIN rada.permisos p
                ON p.id = rp.permiso_id
            WHERE rp.rol_id = $1
            ORDER BY p.nombre ASC
            `,
            [rolId]
        );

        return resultado.rows;

    } catch (error) {
        await cliente.query("ROLLBACK");

        throw error;

    } finally {
        cliente.release();
    }
};


module.exports = {
    obtenerRolesPermisos,
    obtenerRolPermisoPorId,
    obtenerPermisosPorRol,
    crearRolPermiso,
    actualizarRolPermiso,
    eliminarRolPermiso,
    actualizarPermisosPorRol
};