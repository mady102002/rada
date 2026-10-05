const dashboardModel =
    require("../models/dashboardModel");

// ==========================================
// OBTENER RESUMEN DEL DASHBOARD
// ==========================================
const obtenerResumen = async (
    req,
    res
) => {
    try {
        console.log(
            "=================================="
        );

        console.log(
            "CARGANDO DASHBOARD..."
        );

        console.log(
            "USUARIO:",
            req.usuario
        );

        // ======================================
        // TOTALES
        // ======================================

        const [
            clientes,
            usuarios,
            tramites,
            pagos,
            pagosDc,
            pagosSu,
        ] = await Promise.all([
            dashboardModel
                .totalClientes(),

            dashboardModel
                .totalUsuarios(),

            dashboardModel
                .totalTramites(),

            dashboardModel
                .totalPagos(),

            dashboardModel
                .totalPagosDc(),

            dashboardModel
                .totalPagosSu(),
        ]);

        console.log(
            "✅ TOTALES CARGADOS"
        );

        // ======================================
        // GRÁFICOS
        // ======================================

        const [
            tramitesEstado,
            pagosEstado,
        ] = await Promise.all([
            dashboardModel
                .tramitesPorEstado(),

            dashboardModel
                .pagosPorEstado(),
        ]);

        console.log(
            "✅ GRÁFICOS CARGADOS"
        );

        // ======================================
        // ALERTAS
        // ======================================

        const [
            pagosPendientes,
            licenciasPorVencer,
            tramitesPendientes,
        ] = await Promise.all([
            dashboardModel
                .pagosPendientes(),

            dashboardModel
                .licenciasPorVencer(),

            dashboardModel
                .tramitesPendientes(),
        ]);

        console.log(
            "✅ ALERTAS CARGADAS"
        );

        // ======================================
        // RESPUESTA
        // ======================================

        const respuesta = {
            clientes,
            usuarios,
            tramites,
            pagos,

            pagosDc,
            pagosSu,

            tramitesPorEstado:
                tramitesEstado,

            pagosPorEstado:
                pagosEstado,

            alertas: {
                pagosPendientes,
                licenciasPorVencer,
                tramitesPendientes,
            },
        };

        console.log(
            "✅ DASHBOARD COMPLETADO"
        );

        console.log(
            "=================================="
        );

        return res
            .status(200)
            .json(respuesta);

    } catch (error) {
        console.error(
            "=================================="
        );

        console.error(
            "❌ ERROR DASHBOARD:"
        );

        console.error(
            error.message
        );

        console.error(
            error
        );

        console.error(
            "=================================="
        );

        return res
            .status(500)
            .json({
                mensaje:
                    "Error al obtener el Dashboard",

                error:
                    error.message,
            });
    }
};

module.exports = {
    obtenerResumen,
};