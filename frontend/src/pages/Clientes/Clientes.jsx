import {
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

import DashboardLayout
    from "../../layouts/DashboardLayout";

import api
    from "../../api/axios";

import Swal
    from "sweetalert2";

import * as XLSX
    from "xlsx";

import jsPDF
    from "jspdf";

import autoTable
    from "jspdf-autotable";


function Clientes() {

    const [clientes, setClientes] =
        useState([]);

    const [busqueda, setBusqueda] =
        useState("");

    const [paginaActual, setPaginaActual] =
        useState(1);

    const [
        registrosPorPagina,
        setRegistrosPorPagina
    ] = useState(10);


    // ==========================================
    // PERMISOS
    // ==========================================

    let permisos = [];

    try {

        permisos =
            JSON.parse(
                localStorage.getItem(
                    "permisos"
                )
            ) || [];

    } catch {

        permisos = [];

    }


    const tienePermiso = (permiso) => {
        return permisos.includes(permiso);
    };


    const puedeCrear =
        tienePermiso(
            "CLIENTES_CREAR"
        );

    const puedeEditar =
        tienePermiso(
            "CLIENTES_EDITAR"
        );

    const puedeEliminar =
        tienePermiso(
            "CLIENTES_ELIMINAR"
        );

    const puedeExportar =
        tienePermiso(
            "CLIENTES_EXPORTAR"
        );


    // ==========================================
    // CARGAR CLIENTES
    // ==========================================

    useEffect(() => {
        cargarClientes();
    }, []);


    useEffect(() => {

        setPaginaActual(1);

    }, [
        busqueda,
        registrosPorPagina
    ]);


    const cargarClientes = async () => {

        try {

            const respuesta =
                await api.get(
                    "/clientes"
                );


            setClientes(
                Array.isArray(
                    respuesta.data
                )
                    ? respuesta.data
                    : []
            );

        } catch (error) {

            console.error(
                "ERROR AL CARGAR CLIENTES:",
                error.response?.data ||
                    error.message
            );


            Swal.fire(
                "Error",
                error.response?.data
                    ?.mensaje ||
                    "No se pudieron cargar los clientes.",
                "error"
            );

        }

    };


    // ==========================================
    // ELIMINAR
    // ==========================================

    const eliminarCliente = async (id) => {

        if (!puedeEliminar) {

            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para eliminar clientes.",
                "warning"
            );

            return;

        }


        const resultado =
            await Swal.fire({

                title:
                    "¿Eliminar cliente?",

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

            await api.delete(
                `/clientes/${id}`
            );


            await Swal.fire(
                "Eliminado",
                "Cliente eliminado correctamente.",
                "success"
            );


            cargarClientes();

        } catch (error) {

            console.error(
                "ERROR AL ELIMINAR CLIENTE:",
                error.response?.data ||
                    error.message
            );


            Swal.fire(
                "Error",
                error.response?.data
                    ?.mensaje ||
                    "No se pudo eliminar el cliente.",
                "error"
            );

        }

    };


    // ==========================================
    // BUSCADOR
    // ==========================================

    const clientesFiltrados =
        clientes.filter(
            (cliente) => {

                const texto =
                    busqueda
                        .toLowerCase()
                        .trim();


                if (!texto) {
                    return true;
                }


                return (

                    String(
                        cliente.id || ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        cliente.razon_social ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        cliente.iniciales ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        cliente.nombre_comercial ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        cliente.ruc_ced ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        cliente.representante_legal ||
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


    const clientesPagina =
        clientesFiltrados.slice(
            indicePrimerRegistro,
            indiceUltimoRegistro
        );


    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                clientesFiltrados.length /
                    registrosPorPagina
            )
        );


    const cambiarPagina = (
        numeroPagina
    ) => {

        if (
            numeroPagina >= 1 &&
            numeroPagina <=
                totalPaginas
        ) {

            setPaginaActual(
                numeroPagina
            );

        }

    };


    const obtenerPaginasVisibles =
        () => {

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

                paginas.push(
                    numero
                );

            }


            return paginas;

        };


    const desde =
        clientesFiltrados.length === 0

            ? 0

            : indicePrimerRegistro +
                1;


    const hasta =
        Math.min(
            indiceUltimoRegistro,
            clientesFiltrados.length
        );


    // ==========================================
    // EXCEL
    // ==========================================

    const exportarExcel = () => {

        if (!puedeExportar) {

            return;

        }


        const datos =
            clientesFiltrados.map(
                (cliente) => ({

                    ID:
                        cliente.id,

                    "Razón Social":
                        cliente.razon_social,

                    Iniciales:
                        cliente.iniciales,

                    "Nombre Comercial":
                        cliente.nombre_comercial,

                    "RUC/Cédula":
                        cliente.ruc_ced,

                    Representante:
                        cliente.representante_legal,

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
                "Clientes"
            );


        XLSX.writeFile(
            libro,
            "Clientes.xlsx"
        );

    };


    // ==========================================
    // PDF
    // ==========================================

    const exportarPDF = () => {

        if (!puedeExportar) {

            return;

        }


        const doc =
            new jsPDF({
                orientation:
                    "landscape",
            });


        doc.setFontSize(16);


        doc.text(
            "Reporte de Clientes",
            14,
            15
        );


        autoTable(
            doc,
            {

                startY: 22,

                head: [[
                    "ID",
                    "Razón Social",
                    "Iniciales",
                    "Nombre Comercial",
                    "RUC",
                    "Representante",
                ]],

                body:
                    clientesFiltrados.map(
                        (cliente) => [

                            cliente.id,

                            cliente.razon_social ||
                                "",

                            cliente.iniciales ||
                                "",

                            cliente.nombre_comercial ||
                                "",

                            cliente.ruc_ced ||
                                "",

                            cliente.representante_legal ||
                                "",

                        ]
                    ),

            }
        );


        doc.save(
            "Clientes.pdf"
        );

    };


    return (

        <DashboardLayout>


            {/* ================================= */}
            {/* CABECERA */}
            {/* ================================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">
                        Clientes
                    </h2>

                    <p className="text-muted mb-0">
                        Gestión de clientes registrados
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
                                    clientesFiltrados.length ===
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
                                    clientesFiltrados.length ===
                                    0
                                }
                            >
                                PDF
                            </button>

                        </>

                    )}


                    {/* CREAR */}
                    {puedeCrear && (

                        <Link
                            to="/clientes/nuevo"
                            className="btn btn-primary"
                        >
                            Nuevo Cliente
                        </Link>

                    )}

                </div>

            </div>


            {/* ================================= */}
            {/* BUSCADOR */}
            {/* ================================= */}

            <div className="card shadow mb-4">

                <div className="card-body">

                    <div className="row align-items-end">


                        <div className="col-md-9 mb-3 mb-md-0">

                            <label className="form-label">
                                Buscar cliente
                            </label>


                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por razón social, RUC, nombre comercial, representante o ID..."
                                value={
                                    busqueda
                                }
                                onChange={(e) =>
                                    setBusqueda(
                                        e.target
                                            .value
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
                                            e.target
                                                .value
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


            {/* ================================= */}
            {/* TABLA */}
            {/* ================================= */}

            <div className="card shadow">

                <div className="card-body">


                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <span className="text-muted">

                            Mostrando{" "}
                            {desde} - {hasta}
                            {" "}de{" "}
                            {
                                clientesFiltrados.length
                            }
                            {" "}registro(s)

                        </span>


                        {busqueda && (

                            <span className="badge bg-primary">
                                Filtro activo
                            </span>

                        )}

                    </div>


                    <div className="table-responsive">

                        <table className="table table-striped table-hover align-middle">

                            <thead className="table-dark">

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Razón Social
                                    </th>

                                    <th>
                                        Iniciales
                                    </th>

                                    <th>
                                        Nombre Comercial
                                    </th>

                                    <th>
                                        RUC / Cédula
                                    </th>

                                    <th>
                                        Representante
                                    </th>

                                    <th>
                                        Acciones
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {clientesPagina.length >
                                0 ? (

                                    clientesPagina.map(
                                        (cliente) => (

                                            <tr
                                                key={
                                                    cliente.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        cliente.id
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        cliente.razon_social
                                                    }
                                                </td>


                                                <td>

                                                    {cliente.iniciales ||
                                                        "-"}

                                                </td>


                                                <td>

                                                    {cliente.nombre_comercial ||
                                                        "-"}

                                                </td>


                                                <td>
                                                    {
                                                        cliente.ruc_ced
                                                    }
                                                </td>


                                                <td>

                                                    {cliente.representante_legal ||
                                                        "-"}

                                                </td>


                                                <td className="text-nowrap">


                                                    {/* EDITAR */}
                                                    {puedeEditar && (

                                                        <Link
                                                            to={`/clientes/editar/${cliente.id}`}
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
                                                                eliminarCliente(
                                                                    cliente.id
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
                                            colSpan="7"
                                            className="text-center"
                                        >
                                            No se encontraron clientes.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* ================================= */}
                    {/* PAGINACIÓN */}
                    {/* ================================= */}

                    {clientesFiltrados.length >
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
                                            paginaActual ===
                                            1
                                                ? "disabled"
                                                : ""
                                        }`}
                                    >

                                        <button
                                            type="button"
                                            className="page-link"
                                            onClick={() =>
                                                cambiarPagina(
                                                    paginaActual -
                                                        1
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
                                                    paginaActual +
                                                        1
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

export default Clientes;