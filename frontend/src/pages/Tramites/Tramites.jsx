import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Tramites() {
    const [tramites, setTramites] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

    const [paginaActual, setPaginaActual] = useState(1);

    const [registrosPorPagina, setRegistrosPorPagina] =
        useState(10);

    // ==========================================
    // PERMISOS
    // ==========================================

    let permisos = [];

    try {
        permisos =
            JSON.parse(
                localStorage.getItem("permisos")
            ) || [];
    } catch (error) {
        console.error(
            "ERROR AL LEER PERMISOS:",
            error
        );

        permisos = [];
    }

    const tienePermiso = (permiso) => {
        return permisos.includes(permiso);
    };

    const puedeCrear =
        tienePermiso("TRAMITES_CREAR");

    const puedeEditar =
        tienePermiso("TRAMITES_EDITAR");

    const puedeEliminar =
        tienePermiso("TRAMITES_ELIMINAR");

    const puedeExportar =
        tienePermiso("TRAMITES_EXPORTAR");

    // ==========================================
    // CARGAR TRÁMITES
    // ==========================================

    useEffect(() => {
        cargarTramites();
    }, []);

    useEffect(() => {
        setPaginaActual(1);
    }, [
        busqueda,
        registrosPorPagina
    ]);

    const cargarTramites = async () => {
        try {
            setCargando(true);

            const respuesta =
                await api.get("/tramites");

            console.log(
                "TRÁMITES RECIBIDOS:",
                respuesta.data
            );

            setTramites(
                Array.isArray(respuesta.data)
                    ? respuesta.data
                    : []
            );

        } catch (error) {
            console.error(
                "ERROR AL CARGAR TRÁMITES:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudieron cargar los trámites.",
                "error"
            );

        } finally {
            setCargando(false);
        }
    };

    // ==========================================
    // ELIMINAR TRÁMITE
    // ==========================================

    const eliminarTramite = async (id) => {

        if (!puedeEliminar) {
            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para eliminar trámites.",
                "warning"
            );

            return;
        }

        const resultado =
            await Swal.fire({
                title:
                    "¿Eliminar trámite?",

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

        if (!resultado.isConfirmed) {
            return;
        }

        try {
            await api.delete(
                `/tramites/${id}`
            );

            await Swal.fire(
                "Eliminado",
                "Trámite eliminado correctamente.",
                "success"
            );

            cargarTramites();

        } catch (error) {
            console.error(
                "ERROR AL ELIMINAR TRÁMITE:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo eliminar el trámite.",
                "error"
            );
        }
    };

    // ==========================================
    // FORMATEAR FECHA
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
    // FILTRAR
    // ==========================================

    const tramitesFiltrados =
        tramites.filter(
            (tramite) => {

                const texto =
                    busqueda
                        .toLowerCase()
                        .trim();

                if (!texto) {
                    return true;
                }

                return (
                    String(
                        tramite.id || ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        tramite.num_tramite ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        tramite.tipo_tramite ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        tramite.status ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        tramite.razon_social ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        tramite.categoria ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        tramite.referencia ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        tramite.observacion ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)
                );
            }
        );

    // ==========================================
    // PAGINACIÓN
    // ==========================================

    const indiceUltimoRegistro =
        paginaActual *
        registrosPorPagina;

    const indicePrimerRegistro =
        indiceUltimoRegistro -
        registrosPorPagina;

    const tramitesPagina =
        tramitesFiltrados.slice(
            indicePrimerRegistro,
            indiceUltimoRegistro
        );

    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                tramitesFiltrados.length /
                    registrosPorPagina
            )
        );

    const cambiarPagina = (pagina) => {

        if (
            pagina >= 1 &&
            pagina <= totalPaginas
        ) {
            setPaginaActual(pagina);
        }
    };

    const obtenerPaginasVisibles = () => {

        const paginas = [];

        const inicio =
            Math.max(
                1,
                paginaActual - 2
            );

        const fin =
            Math.min(
                totalPaginas,
                paginaActual + 2
            );

        for (
            let numero = inicio;
            numero <= fin;
            numero++
        ) {
            paginas.push(numero);
        }

        return paginas;
    };

    const desde =
        tramitesFiltrados.length === 0
            ? 0
            : indicePrimerRegistro + 1;

    const hasta =
        Math.min(
            indiceUltimoRegistro,
            tramitesFiltrados.length
        );

    // ==========================================
    // EXPORTAR EXCEL
    // ==========================================

    const exportarExcel = () => {

        if (!puedeExportar) {
            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para exportar trámites.",
                "warning"
            );

            return;
        }

        const datos =
            tramitesFiltrados.map(
                (tramite) => ({
                    ID:
                        tramite.id,

                    "N° Trámite":
                        tramite.num_tramite,

                    Cliente:
                        tramite.razon_social ||
                        tramite.cliente_id,

                    Fecha:
                        formatearFecha(
                            tramite.fecha_tramite
                        ),

                    Tipo:
                        tramite.tipo_tramite ||
                        "",

                    Estado:
                        tramite.status ||
                        "",

                    Categoría:
                        tramite.categoria ||
                        "",

                    Referencia:
                        tramite.referencia ||
                        "",

                    Observación:
                        tramite.observacion ||
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
                "Tramites"
            );

        XLSX.writeFile(
            libro,
            "Tramites.xlsx"
        );
    };

    // ==========================================
    // EXPORTAR PDF
    // ==========================================

    const exportarPDF = () => {

        if (!puedeExportar) {
            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para exportar trámites.",
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
            "Reporte de Trámites - RADA",
            14,
            15
        );

        autoTable(
            doc,
            {
                startY: 22,

                head: [[
                    "ID",
                    "N° Trámite",
                    "Cliente",
                    "Fecha",
                    "Tipo",
                    "Estado",
                    "Categoría",
                    "Referencia",
                    "Observación",
                ]],

                body:
                    tramitesFiltrados.map(
                        (tramite) => [
                            tramite.id,

                            tramite.num_tramite ||
                                "",

                            tramite.razon_social ||
                                tramite.cliente_id ||
                                "",

                            formatearFecha(
                                tramite.fecha_tramite
                            ),

                            tramite.tipo_tramite ||
                                "",

                            tramite.status ||
                                "",

                            tramite.categoria ||
                                "",

                            tramite.referencia ||
                                "",

                            tramite.observacion ||
                                "",
                        ]
                    ),

                styles: {
                    fontSize:
                        7,
                },
            }
        );

        doc.save(
            "Tramites.pdf"
        );
    };

    // ==========================================
    // COLOR DEL ESTADO
    // ==========================================

    const obtenerClaseEstado = (status) => {

        switch (status) {

            case "PENDIENTE":
                return "bg-warning text-dark";

            case "EN PROCESO":
                return "bg-primary";

            case "OTORGADO":
                return "bg-success";

            case "RECHAZADO":
                return "bg-danger";

            case "ARCHIVADO":
                return "bg-secondary";

            default:
                return "bg-secondary";
        }
    };

    // ==========================================
    // INTERFAZ
    // ==========================================

    return (
        <DashboardLayout>

            {/* CABECERA */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">
                        Trámites
                    </h2>

                    <p className="text-muted mb-0">
                        Gestión de trámites registrados
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
                                    tramitesFiltrados.length ===
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
                                    tramitesFiltrados.length ===
                                    0
                                }
                            >
                                PDF
                            </button>
                        </>
                    )}

                    {/* NUEVO TRÁMITE */}
                    {puedeCrear && (

                        <Link
                            to="/tramites/nuevo"
                            className="btn btn-primary"
                        >
                            Nuevo Trámite
                        </Link>

                    )}

                </div>

            </div>

            {/* BUSCADOR */}
            <div className="card shadow mb-4">

                <div className="card-body">

                    <div className="row align-items-end">

                        <div className="col-md-9 mb-3 mb-md-0">

                            <label className="form-label">
                                Buscar trámite
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por número, cliente, tipo, estado, categoría, referencia, observación o ID..."
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

                        <div className="col-md-3">

                            <label className="form-label">
                                Registros por página
                            </label>

                            <select
                                className="form-select"
                                value={
                                    registrosPorPagina
                                }
                                onChange={(e) =>
                                    setRegistrosPorPagina(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            >

                                <option value={5}>
                                    5
                                </option>

                                <option value={10}>
                                    10
                                </option>

                                <option value={20}>
                                    20
                                </option>

                                <option value={50}>
                                    50
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>

            {/* TABLA */}
            <div className="card shadow">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <span className="text-muted">

                            Mostrando{" "}
                            {desde} - {hasta}
                            {" "}de{" "}
                            {
                                tramitesFiltrados.length
                            }
                            {" "}registro(s)

                        </span>

                        {busqueda && (

                            <span className="badge bg-primary">
                                Filtro activo
                            </span>

                        )}

                    </div>

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
                                            N° Trámite
                                        </th>

                                        <th>
                                            Cliente
                                        </th>

                                        <th>
                                            Fecha
                                        </th>

                                        <th>
                                            Tipo
                                        </th>

                                        <th>
                                            Estado
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

                                    {tramitesPagina.length >
                                    0 ? (

                                        tramitesPagina.map(
                                            (tramite) => (

                                                <tr
                                                    key={
                                                        tramite.id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            tramite.id
                                                        }
                                                    </td>

                                                    <td>
                                                        {tramite.num_tramite ||
                                                            "-"}
                                                    </td>

                                                    <td>
                                                        {tramite.razon_social ||
                                                            `Cliente ${tramite.cliente_id}`}
                                                    </td>

                                                    <td>
                                                        {formatearFecha(
                                                            tramite.fecha_tramite
                                                        )}
                                                    </td>

                                                    <td>
                                                        {tramite.tipo_tramite ||
                                                            "-"}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`badge ${obtenerClaseEstado(
                                                                tramite.status
                                                            )}`}
                                                        >
                                                            {tramite.status ||
                                                                "-"}
                                                        </span>

                                                    </td>

                                                    <td>
                                                        {tramite.observacion ||
                                                            "Sin observación"}
                                                    </td>

                                                    <td className="text-nowrap">

                                                        {/* EDITAR */}
                                                        {puedeEditar && (

                                                            <Link
                                                                to={`/tramites/editar/${tramite.id}`}
                                                                className="btn btn-warning btn-sm me-2"
                                                            >
                                                                Editar
                                                            </Link>

                                                        )}

                                                        {/* ELIMINAR */}
                                                        {puedeEliminar && (

                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() =>
                                                                    eliminarTramite(
                                                                        tramite.id
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
                                                colSpan="8"
                                                className="text-center"
                                            >
                                                No se encontraron trámites.
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                    {/* PAGINACIÓN */}
                    {tramitesFiltrados.length >
                        0 && (

                        <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">

                            <div className="text-muted">

                                Página{" "}
                                {paginaActual}
                                {" "}de{" "}
                                {totalPaginas}

                            </div>

                            <nav>

                                <ul className="pagination mb-0">

                                    <li
                                        className={`page-item ${
                                            paginaActual === 1
                                                ? "disabled"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            className="page-link"
                                            onClick={() =>
                                                cambiarPagina(
                                                    paginaActual - 1
                                                )
                                            }
                                        >
                                            Anterior
                                        </button>
                                    </li>

                                    {obtenerPaginasVisibles().map(
                                        (numero) => (

                                            <li
                                                key={
                                                    numero
                                                }
                                                className={`page-item ${
                                                    paginaActual ===
                                                    numero
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    className="page-link"
                                                    onClick={() =>
                                                        cambiarPagina(
                                                            numero
                                                        )
                                                    }
                                                >
                                                    {
                                                        numero
                                                    }
                                                </button>
                                            </li>

                                        )
                                    )}

                                    <li
                                        className={`page-item ${
                                            paginaActual ===
                                            totalPaginas
                                                ? "disabled"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            className="page-link"
                                            onClick={() =>
                                                cambiarPagina(
                                                    paginaActual + 1
                                                )
                                            }
                                        >
                                            Siguiente
                                        </button>
                                    </li>

                                </ul>

                            </nav>

                        </div>

                    )}

                </div>

            </div>

        </DashboardLayout>
    );
}

export default Tramites;