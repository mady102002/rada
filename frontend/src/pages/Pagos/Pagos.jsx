import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Pagos() {
    const navigate = useNavigate();

    const [pagosDc, setPagosDc] = useState([]);
    const [pagosSu, setPagosSu] = useState([]);

    const [tipoSeleccionado, setTipoSeleccionado] =
        useState("DC");

    const [busqueda, setBusqueda] = useState("");

    const [cargando, setCargando] =
        useState(true);

    // ==========================================
    // PERMISOS
    // ==========================================

    let permisos = [];

    try {
        permisos =
            JSON.parse(
                localStorage.getItem("permisos")
            ) || [];
    } catch {
        permisos = [];
    }

    const tienePermiso = (permiso) => {
        return permisos.includes(permiso);
    };

    const puedeCrear =
        tienePermiso("PAGOS_CREAR");

    const puedeEditar =
        tienePermiso("PAGOS_EDITAR");

    const puedeEliminar =
        tienePermiso("PAGOS_ELIMINAR");

    const puedeExportar =
        tienePermiso("PAGOS_EXPORTAR");

    // ==========================================
    // CARGAR PAGOS
    // ==========================================

    useEffect(() => {
        cargarPagos();
    }, []);

    const cargarPagos = async () => {
        try {
            setCargando(true);

            const [
                respuestaDc,
                respuestaSu
            ] = await Promise.all([
                api.get("/pagos-dc"),
                api.get("/pagos-su"),
            ]);

            setPagosDc(
                Array.isArray(
                    respuestaDc.data
                )
                    ? respuestaDc.data
                    : []
            );

            setPagosSu(
                Array.isArray(
                    respuestaSu.data
                )
                    ? respuestaSu.data
                    : []
            );

        } catch (error) {
            console.error(
                "ERROR AL CARGAR PAGOS:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudieron cargar los pagos.",
                "error"
            );

        } finally {
            setCargando(false);
        }
    };

    // ==========================================
    // ELIMINAR
    // ==========================================

    const eliminarPago = async (
        tipo,
        id
    ) => {
        if (!puedeEliminar) {
            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para eliminar pagos.",
                "warning"
            );

            return;
        }

        const resultado =
            await Swal.fire({
                title:
                    "¿Eliminar pago?",

                text:
                    "Esta acción no se puede deshacer.",

                icon:
                    "warning",

                showCancelButton:
                    true,

                confirmButtonColor:
                    "#d33",

                cancelButtonColor:
                    "#3085d6",

                confirmButtonText:
                    "Sí, eliminar",

                cancelButtonText:
                    "Cancelar",
            });

        if (
            !resultado.isConfirmed
        ) {
            return;
        }

        try {
            const endpoint =
                tipo === "DC"
                    ? `/pagos-dc/${id}`
                    : `/pagos-su/${id}`;

            await api.delete(
                endpoint
            );

            await Swal.fire(
                "Eliminado",
                "Pago eliminado correctamente.",
                "success"
            );

            cargarPagos();

        } catch (error) {
            console.error(
                "ERROR AL ELIMINAR PAGO:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo eliminar el pago.",
                "error"
            );
        }
    };

    // ==========================================
    // MES
    // ==========================================

    const obtenerNombreMes = (mes) => {
        const meses = [
            "",
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];

        return (
            meses[Number(mes)] ||
            mes ||
            "Sin mes"
        );
    };

    // ==========================================
    // FECHA
    // ==========================================

    const formatearFecha = (fecha) => {
        if (!fecha) {
            return "Sin fecha";
        }

        const fechaLimpia =
            String(fecha).split("T")[0];

        const partes =
            fechaLimpia.split("-");

        if (partes.length !== 3) {
            return fecha;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    };

    // ==========================================
    // VALOR
    // ==========================================

    const formatearValor = (valor) => {
        const numero =
            Number(valor);

        if (
            Number.isNaN(numero)
        ) {
            return "$0.00";
        }

        return numero.toLocaleString(
            "es-EC",
            {
                style:
                    "currency",

                currency:
                    "USD",
            }
        );
    };

    // ==========================================
    // FILTRAR
    // ==========================================

    const pagosActuales =
        tipoSeleccionado === "DC"
            ? pagosDc
            : pagosSu;

    const pagosFiltrados =
        pagosActuales.filter(
            (pago) => {

                const texto =
                    busqueda
                        .toLowerCase()
                        .trim();

                if (!texto) {
                    return true;
                }

                const estadoTexto =
                    String(
                        pago.estado
                    ).toUpperCase() ===
                    "SI"
                        ? "pagado"
                        : "pendiente";

                const periodo =
                    tipoSeleccionado ===
                    "DC"
                        ? pago.semestre
                        : pago.trimestre;

                return (
                    String(
                        pago.id || ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        pago.razon_social ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        pago.anio || ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        periodo || ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        pago.mes || ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    obtenerNombreMes(
                        pago.mes
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        pago.estado || ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    estadoTexto.includes(
                        texto
                    )

                    ||

                    String(
                        pago.valor || ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        pago.observacion ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)
                );
            }
        );

    // ==========================================
    // EXCEL
    // ==========================================

    const exportarExcel = () => {
        if (!puedeExportar) {
            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para exportar pagos.",
                "warning"
            );

            return;
        }

        const datos =
            pagosFiltrados.map(
                (pago) => ({
                    ID:
                        pago.id,

                    Cliente:
                        pago.razon_social ||
                        `Cliente ${pago.cliente_id}`,

                    Tipo:
                        tipoSeleccionado,

                    Año:
                        pago.anio,

                    Periodo:
                        tipoSeleccionado ===
                        "DC"
                            ? pago.semestre
                            : pago.trimestre,

                    Mes:
                        obtenerNombreMes(
                            pago.mes
                        ),

                    Estado:
                        pago.estado ===
                        "SI"
                            ? "Pagado"
                            : "Pendiente",

                    Valor:
                        Number(
                            pago.valor ||
                                0
                        ),

                    "Fecha de pago":
                        formatearFecha(
                            pago.fecha_pago
                        ),

                    Observacion:
                        pago.observacion ||
                        "",
                })
            );

        const hoja =
            XLSX.utils
                .json_to_sheet(
                    datos
                );

        const libro =
            XLSX.utils
                .book_new();

        XLSX.utils
            .book_append_sheet(
                libro,
                hoja,
                `Pagos ${tipoSeleccionado}`
            );

        XLSX.writeFile(
            libro,
            `Pagos_${tipoSeleccionado}.xlsx`
        );
    };

    // ==========================================
    // PDF
    // ==========================================

    const exportarPDF = () => {
        if (!puedeExportar) {
            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para exportar pagos.",
                "warning"
            );

            return;
        }

        const doc =
            new jsPDF({
                orientation:
                    "landscape",
            });

        doc.setFontSize(16);

        doc.text(
            `Reporte de Pagos ${tipoSeleccionado} - RADA`,
            14,
            15
        );

        autoTable(
            doc,
            {
                startY: 22,

                head: [[
                    "ID",
                    "Cliente",
                    "Año",

                    tipoSeleccionado ===
                    "DC"
                        ? "Semestre"
                        : "Trimestre",

                    "Mes",
                    "Estado",
                    "Valor",
                    "Fecha",
                    "Observación",
                ]],

                body:
                    pagosFiltrados.map(
                        (pago) => [
                            pago.id,

                            pago.razon_social ||
                                `Cliente ${pago.cliente_id}`,

                            pago.anio,

                            tipoSeleccionado ===
                            "DC"
                                ? pago.semestre
                                : pago.trimestre,

                            obtenerNombreMes(
                                pago.mes
                            ),

                            pago.estado ===
                            "SI"
                                ? "Pagado"
                                : "Pendiente",

                            formatearValor(
                                pago.valor
                            ),

                            formatearFecha(
                                pago.fecha_pago
                            ),

                            pago.observacion ||
                                "",
                        ]
                    ),

                styles: {
                    fontSize:
                        7,
                },

                headStyles: {
                    fontSize:
                        8,
                },
            }
        );

        doc.save(
            `Pagos_${tipoSeleccionado}.pdf`
        );
    };

    return (
        <DashboardLayout>

            {/* CABECERA */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">
                        Pagos
                    </h2>

                    <p className="text-muted mb-0">
                        Gestión de pagos DC y SU
                    </p>

                </div>

                <div className="d-flex gap-2 flex-wrap">

                    {/* EXPORTAR */}
                    {puedeExportar && (
                        <>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={
                                    exportarExcel
                                }
                                disabled={
                                    pagosFiltrados.length ===
                                    0
                                }
                            >
                                Excel
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={
                                    exportarPDF
                                }
                                disabled={
                                    pagosFiltrados.length ===
                                    0
                                }
                            >
                                PDF
                            </button>
                        </>
                    )}

                    {/* CREAR */}
                    {puedeCrear && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                                navigate(
                                    "/pagos/nuevo"
                                )
                            }
                        >
                            Nuevo Pago
                        </button>
                    )}

                </div>

            </div>

            {/* FILTROS */}
            <div className="card shadow mb-4">

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-4 mb-3 mb-md-0">

                            <label className="form-label">
                                Tipo de pago
                            </label>

                            <select
                                className="form-select"
                                value={
                                    tipoSeleccionado
                                }
                                onChange={(e) => {

                                    setTipoSeleccionado(
                                        e.target.value
                                    );

                                    setBusqueda("");

                                }}
                            >
                                <option value="DC">
                                    Pagos DC
                                </option>

                                <option value="SU">
                                    Pagos SU
                                </option>
                            </select>

                        </div>

                        <div className="col-md-8">

                            <label className="form-label">
                                Buscar pago
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por cliente, año, mes, estado, período, valor u observación..."
                                value={
                                    busqueda
                                }
                                onChange={(e) =>
                                    setBusqueda(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* RESUMEN */}
            <div className="row mb-4">

                <div className="col-md-6 mb-3 mb-md-0">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Pagos DC
                            </h6>

                            <h3>
                                {
                                    pagosDc.length
                                }
                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-md-6">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Pagos SU
                            </h6>

                            <h3>
                                {
                                    pagosSu.length
                                }
                            </h3>

                        </div>

                    </div>

                </div>

            </div>

            {/* TABLA */}
            <div className="card shadow">

                <div className="card-body">

                    {cargando ? (

                        <div className="text-center py-4">

                            <div
                                className="spinner-border"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Cargando...
                                </span>
                            </div>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-striped table-hover align-middle">

                                <thead className="table-dark">

                                    <tr>
                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Cliente
                                        </th>

                                        <th>
                                            Año
                                        </th>

                                        <th>
                                            {tipoSeleccionado ===
                                            "DC"
                                                ? "Semestre"
                                                : "Trimestre"}
                                        </th>

                                        <th>
                                            Mes
                                        </th>

                                        <th>
                                            Estado
                                        </th>

                                        <th>
                                            Valor
                                        </th>

                                        <th>
                                            Fecha
                                        </th>

                                        <th>
                                            Observación
                                        </th>

                                        <th>
                                            Acciones
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {pagosFiltrados.length >
                                    0 ? (

                                        pagosFiltrados.map(
                                            (pago) => (

                                                <tr
                                                    key={
                                                        pago.id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            pago.id
                                                        }
                                                    </td>

                                                    <td>
                                                        {pago.razon_social ||
                                                            `Cliente ${pago.cliente_id}`}
                                                    </td>

                                                    <td>
                                                        {
                                                            pago.anio
                                                        }
                                                    </td>

                                                    <td>
                                                        {tipoSeleccionado ===
                                                        "DC"
                                                            ? pago.semestre
                                                            : pago.trimestre}
                                                    </td>

                                                    <td>
                                                        {obtenerNombreMes(
                                                            pago.mes
                                                        )}
                                                    </td>

                                                    <td>

                                                        {pago.estado ===
                                                        "SI" ? (

                                                            <span className="badge bg-success">
                                                                Pagado
                                                            </span>

                                                        ) : (

                                                            <span className="badge bg-warning text-dark">
                                                                Pendiente
                                                            </span>

                                                        )}

                                                    </td>

                                                    <td>
                                                        {formatearValor(
                                                            pago.valor
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatearFecha(
                                                            pago.fecha_pago
                                                        )}
                                                    </td>

                                                    <td>
                                                        {pago.observacion ||
                                                            "Sin observación"}
                                                    </td>

                                                    <td className="text-nowrap">

                                                        {/* EDITAR */}
                                                        {puedeEditar && (

                                                            <button
                                                                type="button"
                                                                className="btn btn-warning btn-sm me-2"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/pagos/editar/${tipoSeleccionado.toLowerCase()}/${pago.id}`
                                                                    )
                                                                }
                                                            >
                                                                Editar
                                                            </button>

                                                        )}

                                                        {/* ELIMINAR */}
                                                        {puedeEliminar && (

                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() =>
                                                                    eliminarPago(
                                                                        tipoSeleccionado,
                                                                        pago.id
                                                                    )
                                                                }
                                                            >
                                                                Eliminar
                                                            </button>

                                                        )}

                                                        {/* SOLO LECTURA */}
                                                        {!puedeEditar &&
                                                            !puedeEliminar && (

                                                            <span className="badge bg-secondary">
                                                                Solo lectura
                                                            </span>

                                                        )}

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="10"
                                                className="text-center"
                                            >
                                                No se encontraron pagos.
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </DashboardLayout>
    );
}

export default Pagos;