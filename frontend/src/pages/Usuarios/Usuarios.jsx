import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");

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
        tienePermiso("USUARIOS_CREAR");

    const puedeEditar =
        tienePermiso("USUARIOS_EDITAR");

    const puedeEliminar =
        tienePermiso("USUARIOS_ELIMINAR");

    const puedeExportar =
        tienePermiso("USUARIOS_EXPORTAR");

    // ==========================================
    // CARGAR USUARIOS
    // ==========================================

    useEffect(() => {
        cargarUsuarios();
    }, []);

    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda, registrosPorPagina]);

    const cargarUsuarios = async () => {
        try {
            const respuesta =
                await api.get("/usuarios");

            setUsuarios(
                Array.isArray(respuesta.data)
                    ? respuesta.data
                    : []
            );

        } catch (error) {
            console.error(
                "ERROR AL CARGAR USUARIOS:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudieron cargar los usuarios.",
                "error"
            );
        }
    };

    // ==========================================
    // ELIMINAR USUARIO
    // ==========================================

    const eliminarUsuario = async (id) => {

        if (!puedeEliminar) {
            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para eliminar usuarios.",
                "warning"
            );

            return;
        }

        const resultado =
            await Swal.fire({
                title: "¿Eliminar usuario?",
                text:
                    "Esta acción no se puede deshacer.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
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
                `/usuarios/${id}`
            );

            await Swal.fire(
                "Eliminado",
                "Usuario eliminado correctamente.",
                "success"
            );

            cargarUsuarios();

        } catch (error) {
            console.error(
                "ERROR AL ELIMINAR USUARIO:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo eliminar el usuario.",
                "error"
            );
        }
    };

    // ==========================================
    // FILTRAR
    // ==========================================

    const usuariosFiltrados =
        usuarios.filter((usuario) => {

            const texto =
                busqueda
                    .toLowerCase()
                    .trim();

            if (!texto) {
                return true;
            }

            return (
                String(usuario.id || "")
                    .toLowerCase()
                    .includes(texto) ||

                String(usuario.username || "")
                    .toLowerCase()
                    .includes(texto) ||

                String(usuario.email || "")
                    .toLowerCase()
                    .includes(texto) ||

                String(usuario.rol || "")
                    .toLowerCase()
                    .includes(texto)
            );
        });

    // ==========================================
    // PAGINACIÓN
    // ==========================================

    const indiceUltimoRegistro =
        paginaActual *
        registrosPorPagina;

    const indicePrimerRegistro =
        indiceUltimoRegistro -
        registrosPorPagina;

    const usuariosPagina =
        usuariosFiltrados.slice(
            indicePrimerRegistro,
            indiceUltimoRegistro
        );

    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                usuariosFiltrados.length /
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

    // ==========================================
    // FECHA
    // ==========================================

    const formatearFecha = (fecha) => {

        if (!fecha) {
            return "Sin fecha";
        }

        const fechaObjeto =
            new Date(fecha);

        if (
            Number.isNaN(
                fechaObjeto.getTime()
            )
        ) {
            return fecha;
        }

        return fechaObjeto.toLocaleString(
            "es-EC"
        );
    };

    const desde =
        usuariosFiltrados.length === 0
            ? 0
            : indicePrimerRegistro + 1;

    const hasta =
        Math.min(
            indiceUltimoRegistro,
            usuariosFiltrados.length
        );

    // ==========================================
    // EXCEL
    // ==========================================

    const exportarExcel = () => {

        if (!puedeExportar) {

            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para exportar usuarios.",
                "warning"
            );

            return;
        }

        const datos =
            usuariosFiltrados.map(
                (usuario) => ({
                    ID: usuario.id,

                    Usuario:
                        usuario.username,

                    Email:
                        usuario.email,

                    Rol:
                        usuario.rol ||
                        "Sin rol",

                    "Fecha Registro":
                        usuario.created_at ||
                        "",
                })
            );

        const hoja =
            XLSX.utils.json_to_sheet(
                datos
            );

        const libro =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            libro,
            hoja,
            "Usuarios"
        );

        XLSX.writeFile(
            libro,
            "Usuarios.xlsx"
        );
    };

    // ==========================================
    // PDF
    // ==========================================

    const exportarPDF = () => {

        if (!puedeExportar) {

            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para exportar usuarios.",
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
            "Reporte de Usuarios - RADA",
            14,
            15
        );

        autoTable(doc, {

            startY: 22,

            head: [[
                "ID",
                "Usuario",
                "Email",
                "Rol",
                "Fecha Registro",
            ]],

            body:
                usuariosFiltrados.map(
                    (usuario) => [

                        usuario.id,

                        usuario.username ||
                            "",

                        usuario.email ||
                            "",

                        usuario.rol ||
                            "Sin rol",

                        usuario.created_at
                            ? formatearFecha(
                                  usuario.created_at
                              )
                            : "",
                    ]
                ),

            styles: {
                fontSize: 9,
            },
        });

        doc.save(
            "Usuarios.pdf"
        );
    };

    // ==========================================
    // INTERFAZ
    // ==========================================

    return (
        <DashboardLayout>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">
                        Usuarios
                    </h2>

                    <p className="text-muted mb-0">
                        Gestión de usuarios del sistema
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
                                    usuariosFiltrados.length ===
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
                                    usuariosFiltrados.length ===
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
                            to="/usuarios/nuevo"
                            className="btn btn-primary"
                        >
                            Nuevo Usuario
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
                                Buscar usuario
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por usuario, correo, rol o ID..."
                                value={busqueda}
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

                            Mostrando {desde} - {hasta} de{" "}
                            {usuariosFiltrados.length} registro(s)

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
                                        Usuario
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Rol
                                    </th>

                                    <th>
                                        Fecha Registro
                                    </th>

                                    <th>
                                        Acciones
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {usuariosPagina.length >
                                0 ? (

                                    usuariosPagina.map(
                                        (usuario) => (

                                            <tr
                                                key={
                                                    usuario.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        usuario.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        usuario.username
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        usuario.email
                                                    }
                                                </td>

                                                <td>

                                                    <span className="badge bg-primary">

                                                        {usuario.rol ||
                                                            "Sin rol"}

                                                    </span>

                                                </td>

                                                <td>

                                                    {formatearFecha(
                                                        usuario.created_at
                                                    )}

                                                </td>

                                                <td className="text-nowrap">

                                                    {/* EDITAR */}
                                                    {puedeEditar && (

                                                        <Link
                                                            to={`/usuarios/editar/${usuario.id}`}
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
                                                                eliminarUsuario(
                                                                    usuario.id
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
                                            colSpan="6"
                                            className="text-center"
                                        >
                                            No se encontraron usuarios.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* PAGINACIÓN */}
                    {usuariosFiltrados.length >
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

export default Usuarios;