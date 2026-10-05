const pool = require("../config/db");

// ========================================
// OBTENER PERFIL DEL USUARIO
// ========================================
const obtenerPerfilUsuario = async (usuarioId) => {
    const resultado = await pool.query(
        `
        SELECT
            u.id,
            u.username,
            u.email,
            COALESCE(
                STRING_AGG(
                    DISTINCT r.nombre,
                    ', '
                ),
                'Sin rol'
            ) AS rol
        FROM rada.usuarios u

        LEFT JOIN rada.usuarios_roles ur
            ON ur.usuario_id = u.id

        LEFT JOIN rada.roles r
            ON r.id = ur.rol_id

        WHERE u.id = $1

        GROUP BY
            u.id,
            u.username,
            u.email
        `,
        [usuarioId]
    );

    return resultado.rows[0];
};

module.exports = {
    obtenerPerfilUsuario
};