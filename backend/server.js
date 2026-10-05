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
const dashboardRoutes =require("./routes/dashboardRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/clientes", clientesRoutes);
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/roles", rolesRoutes);
app.use("/permisos", permisosRoutes);
app.use("/roles-permisos", rolesPermisosRoutes);
app.use("/clientes-contacto", clientesContactoRoutes);
app.use("/clientes-direccion", clientesDireccionRoutes);
app.use("/clientes-estados", clientesEstadosRoutes);
app.use("/clientes-financieros", clientesFinancierosRoutes);
app.use("/clientes-licencias", clientesLicenciasRoutes);
app.use("/clientes-observaciones", clientesObservacionesRoutes);
app.use("/contactos", contactosRoutes);
app.use("/tramites", tramitesRoutes);
app.use("/tramites-usuarios", tramitesUsuariosRoutes);
app.use("/tramites-transacciones", tramitesTransaccionesUsuariosRoutes);
app.use("/pagos-dc", pagosDcRoutes);
app.use("/pagos-su", pagosSuRoutes);
app.use("/usuarios-clientes", usuariosClientesRoutes);
app.use("/usuarios-roles", usuariosRolesRoutes);
app.use("/dashboard", dashboardRoutes);

console.log("✅ Ruta /auth cargada correctamente");
console.log("✅ Ruta /clientes cargada correctamente");

// Ruta principal
app.get("/", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");

    res.json({
      mensaje: "Backend RADA funcionando correctamente",
      fechaServidor: resultado.rows[0].now,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "No se pudo conectar a la base de datos",
    });
  }
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});