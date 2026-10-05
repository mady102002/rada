const jwt = require("jsonwebtoken");

// ==========================================
// VERIFICAR TOKEN JWT
// ==========================================
const verificarToken = (req, res, next) => {
    try {
        const authorization =
            req.headers.authorization;

        // ======================================
        // VALIDAR HEADER
        // ======================================
        if (!authorization) {
            return res.status(401).json({
                mensaje:
                    "Token no proporcionado"
            });
        }

        // Debe venir:
        // Authorization: Bearer TOKEN
        const partes =
            authorization.split(" ");

        if (
            partes.length !== 2 ||
            partes[0] !== "Bearer"
        ) {
            return res.status(401).json({
                mensaje:
                    "Formato de token inválido"
            });
        }

        const token =
            partes[1];

        if (!token) {
            return res.status(401).json({
                mensaje:
                    "Token no proporcionado"
            });
        }

        // ======================================
        // VERIFICAR TOKEN
        // ======================================
        const usuarioDecodificado =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        // ======================================
        // GUARDAR USUARIO EN REQUEST
        // ======================================
        req.usuario = {
            id:
                usuarioDecodificado.id,

            username:
                usuarioDecodificado.username
        };

        console.log(
            "TOKEN VERIFICADO:",
            req.usuario
        );

        // MUY IMPORTANTE
        next();

    } catch (error) {
        console.error(
            "ERROR AL VERIFICAR TOKEN:",
            error.message
        );

        if (
            error.name ===
            "TokenExpiredError"
        ) {
            return res.status(401).json({
                mensaje:
                    "Token expirado"
            });
        }

        if (
            error.name ===
            "JsonWebTokenError"
        ) {
            return res.status(401).json({
                mensaje:
                    "Token inválido"
            });
        }

        return res.status(500).json({
            mensaje:
                "Error al verificar token",
            error:
                error.message
        });
    }
};

module.exports =
    verificarToken;