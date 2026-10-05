import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import CardResumen from "../../components/CardResumen";
import api from "../../api/axios";
import Swal from "sweetalert2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import {
    Bar,
    Doughnut,
} from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {

    // ==========================================
    // DATOS DEL DASHBOARD
    // ==========================================

    const [datos, setDatos] = useState({
        clientes: 0,
        usuarios: 0,
        tramites: 0,
        pagos: 0,

        pagosDc: 0,
        pagosSu: 0,

        tramitesPorEstado: [],
        pagosPorEstado: [],

        alertas: {
            pagosPendientes: [],
            licenciasPorVencer: [],
            tramitesPendientes: [],
        },
    });

    const [cargando, setCargando] =
        useState(true);

    // ==========================================
    // PERMISOS DEL USUARIO
    // ==========================================

    let permisosUsuario = [];

    try {
        permisosUsuario =
            JSON.parse(
                localStorage.getItem("permisos")
            ) || [];
    } catch (error) {
        console.error(
            "ERROR AL LEER PERMISOS:",
            error
        );

        permisosUsuario = [];
    }

    const tienePermiso = (permiso) => {
        return permisosUsuario.includes(
            permiso
        );
    };

    const puedeVerClientes =
        tienePermiso("CLIENTES_VER");

    const puedeVerUsuarios =
        tienePermiso("USUARIOS_VER");

    const puedeVerTramites =
        tienePermiso("TRAMITES_VER");

    const puedeVerPagos =
        tienePermiso("PAGOS_VER");

    console.log(
        "PERMISOS DASHBOARD:",
        permisosUsuario
    );

    // ==========================================
    // CARGAR DASHBOARD
    // ==========================================

    useEffect(() => {
        cargarDashboard();
    }, []);

    const cargarDashboard = async () => {
        try {
            setCargando(true);

            const respuesta =
                await api.get("/dashboard");

            setDatos({
                clientes:
                    Number(
                        respuesta.data.clientes
                    ) || 0,

                usuarios:
                    Number(
                        respuesta.data.usuarios
                    ) || 0,

                tramites:
                    Number(
                        respuesta.data.tramites
                    ) || 0,

                pagos:
                    Number(
                        respuesta.data.pagos
                    ) || 0,

                pagosDc:
                    Number(
                        respuesta.data.pagosDc
                    ) || 0,

                pagosSu:
                    Number(
                        respuesta.data.pagosSu
                    ) || 0,

                tramitesPorEstado:
                    Array.isArray(
                        respuesta.data
                            .tramitesPorEstado
                    )
                        ? respuesta.data
                              .tramitesPorEstado
                        : [],

                pagosPorEstado:
                    Array.isArray(
                        respuesta.data
                            .pagosPorEstado
                    )
                        ? respuesta.data
                              .pagosPorEstado
                        : [],

                alertas: {
                    pagosPendientes:
                        respuesta.data
                            .alertas
                            ?.pagosPendientes ||
                        [],

                    licenciasPorVencer:
                        respuesta.data
                            .alertas
                            ?.licenciasPorVencer ||
                        [],

                    tramitesPendientes:
                        respuesta.data
                            .alertas
                            ?.tramitesPendientes ||
                        [],
                },
            });

        } catch (error) {
            console.error(
                "ERROR AL CARGAR DASHBOARD:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo cargar el Dashboard.",
                "error"
            );

        } finally {
            setCargando(false);
        }
    };

    // ==========================================
    // GRÁFICO GENERAL DINÁMICO
    // ==========================================

    const labelsGeneral = [];
    const valoresGeneral = [];

    if (puedeVerClientes) {
        labelsGeneral.push(
            "Clientes"
        );

        valoresGeneral.push(
            datos.clientes
        );
    }

    if (puedeVerUsuarios) {
        labelsGeneral.push(
            "Usuarios"
        );

        valoresGeneral.push(
            datos.usuarios
        );
    }

    if (puedeVerTramites) {
        labelsGeneral.push(
            "Trámites"
        );

        valoresGeneral.push(
            datos.tramites
        );
    }

    if (puedeVerPagos) {
        labelsGeneral.push(
            "Pagos"
        );

        valoresGeneral.push(
            datos.pagos
        );
    }

    const datosGeneral = {
        labels:
            labelsGeneral,

        datasets: [
            {
                label:
                    "Registros",

                data:
                    valoresGeneral,
            },
        ],
    };

    // ==========================================
    // GRÁFICO PAGOS DC VS SU
    // ==========================================

    const datosPagosTipo = {
        labels: [
            "Pagos DC",
            "Pagos SU",
        ],

        datasets: [
            {
                label:
                    "Pagos",

                data: [
                    datos.pagosDc,
                    datos.pagosSu,
                ],
            },
        ],
    };

    // ==========================================
    // GRÁFICO TRÁMITES POR ESTADO
    // ==========================================

    const datosTramitesEstado = {
        labels:
            datos.tramitesPorEstado.map(
                (item) =>
                    item.estado
            ),

        datasets: [
            {
                label:
                    "Trámites",

                data:
                    datos.tramitesPorEstado.map(
                        (item) =>
                            item.total
                    ),
            },
        ],
    };

    // ==========================================
    // PAGOS PAGADOS / PENDIENTES
    // ==========================================

    const obtenerNombreEstadoPago = (
        estado
    ) => {
        return estado === "SI"
            ? "Pagados"
            : "Pendientes";
    };

    const datosPagosEstado = {
        labels:
            datos.pagosPorEstado.map(
                (item) =>
                    obtenerNombreEstadoPago(
                        item.estado
                    )
            ),

        datasets: [
            {
                label:
                    "Pagos",

                data:
                    datos.pagosPorEstado.map(
                        (item) =>
                            item.total
                    ),
            },
        ],
    };

    // ==========================================
    // OPCIONES DE GRÁFICOS
    // ==========================================

    const opciones = {
        responsive:
            true,

        maintainAspectRatio:
            false,

        plugins: {
            legend: {
                position:
                    "top",
            },
        },
    };

    // ==========================================
    // INTERFAZ
    // ==========================================

    return (
        <DashboardLayout>

            {/* ================================= */}
            {/* CABECERA */}
            {/* ================================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">
                        Dashboard
                    </h2>

                    <p className="text-muted mb-0">
                        Resumen general del sistema RADA
                    </p>

                </div>

                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={
                        cargarDashboard
                    }
                    disabled={
                        cargando
                    }
                >
                    {cargando
                        ? "Actualizando..."
                        : "Actualizar"}
                </button>

            </div>

            {/* ================================= */}
            {/* CARGANDO */}
            {/* ================================= */}

            {cargando ? (

                <div className="text-center py-5">

                    <div
                        className="spinner-border"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Cargando...
                        </span>
                    </div>

                    <p className="mt-3">
                        Cargando Dashboard...
                    </p>

                </div>

            ) : (

                <>

                    {/* ================================= */}
                    {/* TARJETAS SEGÚN PERMISOS */}
                    {/* ================================= */}

                    <div className="row">

                        {puedeVerClientes && (

                            <div className="col-lg-3 col-md-6 mb-4">

                                <CardResumen
                                    titulo="Clientes"
                                    total={
                                        datos.clientes
                                    }
                                    color="#0d6efd"
                                />

                            </div>

                        )}

                        {puedeVerUsuarios && (

                            <div className="col-lg-3 col-md-6 mb-4">

                                <CardResumen
                                    titulo="Usuarios"
                                    total={
                                        datos.usuarios
                                    }
                                    color="#198754"
                                />

                            </div>

                        )}

                        {puedeVerTramites && (

                            <div className="col-lg-3 col-md-6 mb-4">

                                <CardResumen
                                    titulo="Trámites"
                                    total={
                                        datos.tramites
                                    }
                                    color="#ffc107"
                                />

                            </div>

                        )}

                        {puedeVerPagos && (

                            <div className="col-lg-3 col-md-6 mb-4">

                                <CardResumen
                                    titulo="Pagos"
                                    total={
                                        datos.pagos
                                    }
                                    color="#dc3545"
                                />

                            </div>

                        )}

                    </div>

                    {/* ================================= */}
                    {/* GRÁFICO GENERAL */}
                    {/* ================================= */}

                    {labelsGeneral.length >
                        0 && (

                        <div className="row">

                            <div className="col-lg-12 mb-4">

                                <div className="card shadow h-100">

                                    <div className="card-header bg-white">

                                        <h5 className="mb-0">
                                            Resumen del sistema
                                        </h5>

                                    </div>

                                    <div className="card-body">

                                        <div
                                            style={{
                                                height:
                                                    "320px",
                                            }}
                                        >

                                            <Bar
                                                data={
                                                    datosGeneral
                                                }
                                                options={
                                                    opciones
                                                }
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                    {/* ================================= */}
                    {/* GRÁFICOS DE PAGOS Y TRÁMITES */}
                    {/* ================================= */}

                    {(puedeVerPagos ||
                        puedeVerTramites) && (

                        <div className="row">

                            {/* PAGOS DC VS SU */}
                            {puedeVerPagos && (

                                <div className="col-lg-6 mb-4">

                                    <div className="card shadow h-100">

                                        <div className="card-header bg-white">

                                            <h5 className="mb-0">
                                                Pagos DC vs SU
                                            </h5>

                                        </div>

                                        <div className="card-body">

                                            <div
                                                style={{
                                                    height:
                                                        "320px",
                                                }}
                                            >

                                                <Doughnut
                                                    data={
                                                        datosPagosTipo
                                                    }
                                                    options={
                                                        opciones
                                                    }
                                                />

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )}

                            {/* TRÁMITES POR ESTADO */}
                            {puedeVerTramites && (

                                <div className="col-lg-6 mb-4">

                                    <div className="card shadow h-100">

                                        <div className="card-header bg-white">

                                            <h5 className="mb-0">
                                                Trámites por estado
                                            </h5>

                                        </div>

                                        <div className="card-body">

                                            {datos
                                                .tramitesPorEstado
                                                .length >
                                            0 ? (

                                                <div
                                                    style={{
                                                        height:
                                                            "320px",
                                                    }}
                                                >

                                                    <Bar
                                                        data={
                                                            datosTramitesEstado
                                                        }
                                                        options={
                                                            opciones
                                                        }
                                                    />

                                                </div>

                                            ) : (

                                                <div className="text-center text-muted py-5">
                                                    No existen trámites para graficar.
                                                </div>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            )}

                        </div>

                    )}

                    {/* ================================= */}
                    {/* ESTADO DE PAGOS */}
                    {/* ================================= */}

                    {puedeVerPagos && (

                        <div className="row">

                            <div className="col-lg-12 mb-4">

                                <div className="card shadow h-100">

                                    <div className="card-header bg-white">

                                        <h5 className="mb-0">
                                            Estado de pagos
                                        </h5>

                                    </div>

                                    <div className="card-body">

                                        {datos
                                            .pagosPorEstado
                                            .length >
                                        0 ? (

                                            <div
                                                style={{
                                                    height:
                                                        "320px",
                                                }}
                                            >

                                                <Doughnut
                                                    data={
                                                        datosPagosEstado
                                                    }
                                                    options={
                                                        opciones
                                                    }
                                                />

                                            </div>

                                        ) : (

                                            <div className="text-center text-muted py-5">
                                                No existen pagos para graficar.
                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                    {/* ================================= */}
                    {/* ALERTAS */}
                    {/* ================================= */}

                    {(puedeVerPagos ||
                        puedeVerClientes ||
                        puedeVerTramites) && (

                        <div className="row">

                            {/* ================================= */}
                            {/* PAGOS PENDIENTES */}
                            {/* ================================= */}

                            {puedeVerPagos && (

                                <div className="col-lg-4 mb-4">

                                    <div className="card shadow h-100">

                                        <div className="card-header bg-warning text-dark">

                                            <h5 className="mb-0">
                                                Pagos pendientes
                                            </h5>

                                        </div>

                                        <div className="card-body">

                                            {datos
                                                .alertas
                                                .pagosPendientes
                                                .length >
                                            0 ? (

                                                datos.alertas.pagosPendientes.map(
                                                    (
                                                        pago
                                                    ) => (

                                                        <div
                                                            key={`${pago.tipo}-${pago.id}`}
                                                            className="border-bottom pb-2 mb-2"
                                                        >

                                                            <strong>
                                                                {
                                                                    pago.razon_social
                                                                }
                                                            </strong>

                                                            <div className="small text-muted">
                                                                Tipo:{" "}
                                                                {
                                                                    pago.tipo
                                                                }
                                                            </div>

                                                            <div className="small">
                                                                Año:{" "}
                                                                {
                                                                    pago.anio
                                                                }
                                                            </div>

                                                            <div className="small">
                                                                Mes:{" "}
                                                                {
                                                                    pago.mes
                                                                }
                                                            </div>

                                                            <div className="small">
                                                                Valor: $
                                                                {Number(
                                                                    pago.valor ||
                                                                        0
                                                                ).toFixed(
                                                                    2
                                                                )}
                                                            </div>

                                                        </div>

                                                    )
                                                )

                                            ) : (

                                                <p className="text-muted mb-0">
                                                    No hay pagos pendientes.
                                                </p>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            )}

                            {/* ================================= */}
                            {/* LICENCIAS POR VENCER */}
                            {/* ================================= */}

                            {puedeVerClientes && (

                                <div className="col-lg-4 mb-4">

                                    <div className="card shadow h-100">

                                        <div className="card-header bg-danger text-white">

                                            <h5 className="mb-0">
                                                Licencias por vencer
                                            </h5>

                                        </div>

                                        <div className="card-body">

                                            {datos
                                                .alertas
                                                .licenciasPorVencer
                                                .length >
                                            0 ? (

                                                datos.alertas.licenciasPorVencer.map(
                                                    (
                                                        licencia
                                                    ) => (

                                                        <div
                                                            key={
                                                                licencia.id
                                                            }
                                                            className="border-bottom pb-2 mb-2"
                                                        >

                                                            <strong>
                                                                {
                                                                    licencia.razon_social
                                                                }
                                                            </strong>

                                                            <div className="small">

                                                                Licencia:{" "}

                                                                {
                                                                    licencia.n_licencia
                                                                }

                                                            </div>

                                                            <div className="small">

                                                                Días restantes:{" "}

                                                                <strong>
                                                                    {
                                                                        licencia.dias_restantes
                                                                    }
                                                                </strong>

                                                            </div>

                                                        </div>

                                                    )
                                                )

                                            ) : (

                                                <p className="text-muted mb-0">
                                                    No hay licencias próximas a vencer.
                                                </p>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            )}

                            {/* ================================= */}
                            {/* TRÁMITES PENDIENTES */}
                            {/* ================================= */}

                            {puedeVerTramites && (

                                <div className="col-lg-4 mb-4">

                                    <div className="card shadow h-100">

                                        <div className="card-header bg-info text-dark">

                                            <h5 className="mb-0">
                                                Trámites pendientes
                                            </h5>

                                        </div>

                                        <div className="card-body">

                                            {datos
                                                .alertas
                                                .tramitesPendientes
                                                .length >
                                            0 ? (

                                                datos.alertas.tramitesPendientes.map(
                                                    (
                                                        tramite
                                                    ) => (

                                                        <div
                                                            key={
                                                                tramite.id
                                                            }
                                                            className="border-bottom pb-2 mb-2"
                                                        >

                                                            <strong>
                                                                {
                                                                    tramite.num_tramite
                                                                }
                                                            </strong>

                                                            <div className="small">

                                                                {
                                                                    tramite.razon_social
                                                                }

                                                            </div>

                                                            <div className="small">

                                                                Estado:{" "}

                                                                <strong>
                                                                    {
                                                                        tramite.status
                                                                    }
                                                                </strong>

                                                            </div>

                                                            <div className="small text-muted">

                                                                {
                                                                    tramite.tipo_tramite
                                                                }

                                                            </div>

                                                        </div>

                                                    )
                                                )

                                            ) : (

                                                <p className="text-muted mb-0">
                                                    No hay trámites pendientes.
                                                </p>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            )}

                        </div>

                    )}

                    {/* ================================= */}
                    {/* SIN MÓDULOS AUTORIZADOS */}
                    {/* ================================= */}

                    {!puedeVerClientes &&
                        !puedeVerUsuarios &&
                        !puedeVerTramites &&
                        !puedeVerPagos && (

                        <div className="alert alert-info">

                            Su usuario no tiene módulos de consulta asignados.

                        </div>

                    )}

                </>

            )}

        </DashboardLayout>
    );
}

export default Dashboard;