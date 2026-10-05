const pool = require("../config/db");

// ==========================================
// MIDDLEWARE PARA VERIFICAR PERMISOS
// ==========================================

const verificarPermiso = (permisoRequerido) => {
    return async (req, res, next) => {
        try {
            const usuarioId =
                req.usuario?.id;

            // ==================================
            // VALIDAR USUARIO AUTENTICADO
            // ==================================

            if (!usuarioId) {
                return res.status(401).json({
                    mensaje:
                        "Usuario no autenticado"
                });
            }

            // ==================================
            // BUSCAR EL PERMISO DEL USUARIO
            // ==================================

            const resultado =
                await pool.query(
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
                    AND p.nombre = $2
                    `,
                    [
                        usuarioId,
                        permisoRequerido
                    ]
                );

            // ==================================
            // SI NO TIENE EL PERMISO
            // ==================================

            if (
                resultado.rows.length === 0
            ) {
                return res.status(403).json({
                    mensaje:
                        `No tiene permiso: ${permisoRequerido}`
                });
            }

            // ==================================
            // TIENE PERMISO
            // ==================================

            next();

        } catch (error) {
            console.error(
                "ERROR AL VERIFICAR PERMISO:",
                error
            );

            return res.status(500).json({
                mensaje:
                    "Error al verificar permisos",
                error:
                    error.message
            });
        }
    };
};

module.exports =
    verificarPermiso;