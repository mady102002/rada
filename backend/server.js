require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const clientesRoutes = require("./routes/clientesRoutes");
const authRoutes = require("./routes/authRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");
const rolesRoutes = require("./routes/rolesRoutes");
const permisosRoutes = require("./routes/permisosRoutes");
const rolesPermisosRoutes = require("./routes/rolesPermisosRoutes");
const clientesContactoRoutes = require("./routes/clientesContactoRoutes");
const clientesDireccionRoutes = require("./routes/clientesDireccionRoutes");
const clientesEstadosRoutes = require("./routes/clientesEstadosRoutes");
const clientesFinancierosRoutes = require("./routes/clientesFinancierosRoutes");
const clientesLicenciasRoutes = require("./routes/clientesLicenciasRoutes");
const clientesObservacionesRoutes = require("./routes/clientesObservacionesRoutes");
const contactosRoutes = require("./routes/contactosRoutes");
const tramitesRoutes = require("./routes/tramitesRoutes");
const tramitesUsuariosRoutes = require("./routes/tramitesUsuariosRoutes");
const tramitesTransaccionesUsuariosRoutes = require("./routes/tramitesTransaccionesUsuariosRoutes");
const pagosDcRoutes = require("./routes/pagosDcRoutes");
const pagosSuRoutes = require("./routes/pagosSuRoutes");
const usuariosClientesRoutes = require("./routes/usuariosClientesRoutes");
const usuariosRolesRoutes = require("./routes/usuariosRolesRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ==========================================
// CORS
// ==========================================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://mady102002.github.io"
        ],
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "PATCH",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ],
        credentials: true
    })
);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

// ==========================================
// RUTAS
// ==========================================

app.use("/clientes", clientesRoutes);

app.use("/auth", authRoutes);

app.use("/usuarios", usuariosRoutes);

app.use("/roles", rolesRoutes);

app.use("/permisos", permisosRoutes);

app.use(
    "/roles-permisos",
    rolesPermisosRoutes
);

app.use(
    "/clientes-contacto",
    clientesContactoRoutes
);

app.use(
    "/clientes-direccion",
    clientesDireccionRoutes
);

app.use(
    "/clientes-estados",
    clientesEstadosRoutes
);

app.use(
    "/clientes-financieros",
    clientesFinancierosRoutes
);

app.use(
    "/clientes-licencias",
    clientesLicenciasRoutes
);

app.use(
    "/clientes-observaciones",
    clientesObservacionesRoutes
);

app.use(
    "/contactos",
    contactosRoutes
);

app.use(
    "/tramites",
    tramitesRoutes
);

app.use(
    "/tramites-usuarios",
    tramitesUsuariosRoutes
);

app.use(
    "/tramites-transacciones",
    tramitesTransaccionesUsuariosRoutes
);

app.use(
    "/pagos-dc",
    pagosDcRoutes
);

app.use(
    "/pagos-su",
    pagosSuRoutes
);

app.use(
    "/usuarios-clientes",
    usuariosClientesRoutes
);

app.use(
    "/usuarios-roles",
    usuariosRolesRoutes
);

app.use(
    "/dashboard",
    dashboardRoutes
);

// ==========================================
// MENSAJES
// ==========================================

console.log("=================================");
console.log("🚀 INICIANDO BACKEND RADA");
console.log("=================================");

console.log("✅ Ruta /auth cargada");
console.log("✅ Ruta /clientes cargada");
console.log("✅ Ruta /usuarios cargada");
console.log("✅ Ruta /roles cargada");
console.log("✅ Ruta /dashboard cargada");

// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get("/", async (req, res) => {
    try {
        const resultado =
            await pool.query("SELECT NOW()");

        res.json({
            mensaje:
                "Backend RADA funcionando correctamente",

            fechaServidor:
                resultado.rows[0].now
        });

    } catch (error) {

        console.error(
            "❌ Error PostgreSQL:",
            error
        );

        res.status(500).json({
            error:
                "No se pudo conectar a la base de datos"
        });
    }
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", async (req, res) => {

    try {

        await pool.query("SELECT 1");

        res.json({
            estado: "OK",
            mensaje:
                "Backend RADA funcionando correctamente"
        });

    } catch (error) {

        console.error(
            "❌ Error health:",
            error
        );

        res.status(500).json({
            estado: "ERROR",
            mensaje:
                "Base de datos no disponible"
        });
    }
});

// ==========================================
// RUTA NO ENCONTRADA
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        error: "Ruta no encontrada",
        ruta: req.originalUrl
    });

});

// ==========================================
// MANEJO DE ERRORES
// ==========================================

app.use(
    (error, req, res, next) => {

        console.error(
            "❌ ERROR DEL SERVIDOR:",
            error
        );

        res.status(500).json({
            error:
                "Error interno del servidor"
        });

    }
);

// ==========================================
// SERVIDOR
// ==========================================

const PORT =
    process.env.PORT || 3000;

console.log(
    `🔌 Intentando iniciar servidor en puerto ${PORT}...`
);

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "================================="
        );

        console.log(
            `🚀 SERVIDOR RADA ACTIVO`
        );

        console.log(
            `🌐 Puerto: ${PORT}`
        );

        console.log(
            `📡 http://localhost:${PORT}`
        );

        console.log(
            "================================="
        );

    }
);