import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Permisos() {
    const [permisos, setPermisos] = useState([]);
    const [busqueda, setBusqueda] = useState("");

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
        return permisosUsuario.includes(permiso);
    };

    const puedeCrear =
        tienePermiso("PERMISOS_CREAR");

    const puedeEditar =
        tienePermiso("PERMISOS_EDITAR");

    const puedeEliminar =
        tienePermiso("PERMISOS_ELIMINAR");

    const puedeExportar =
        tienePermiso("PERMISOS_EXPORTAR");

    // ==========================================
    // CARGAR PERMISOS
    // ==========================================

    useEffect(() => {
        cargarPermisos();
    }, []);

    const cargarPermisos = async () => {
        try {
            const respuesta =
                await api.get("/permisos");

            setPermisos(
                Array.isArray(respuesta.data)
                    ? respuesta.data
                    : []
            );

        } catch (error) {
            console.error(
                "ERROR AL CARGAR PERMISOS:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudieron cargar los permisos.",
                "error"
            );
        }
    };

    // ==========================================
    // ELIMINAR PERMISO
    // ==========================================

    const eliminarPermiso = async (id) => {

        if (!puedeEliminar) {
            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para eliminar permisos.",
                "warning"
            );

            return;
        }

        const confirmar =
            await Swal.fire({
                title:
                    "¿Eliminar permiso?",

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

        if (!confirmar.isConfirmed) {
            return;
        }

        try {
            await api.delete(
                `/permisos/${id}`
            );

            await Swal.fire(
                "Correcto",
                "Permiso eliminado correctamente.",
                "success"
            );

            cargarPermisos();

        } catch (error) {
            console.error(
                "ERROR AL ELIMINAR PERMISO:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo eliminar el permiso.",
                "error"
            );
        }
    };

    // ==========================================
    // BUSCADOR
    // ==========================================

    const permisosFiltrados =
        permisos.filter(
            (permiso) => {

                const texto =
                    busqueda
                        .toLowerCase()
                        .trim();

                if (!texto) {
                    return true;
                }

                return (
                    String(
                        permiso.id || ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        permiso.nombre || ""
                    )
                        .toLowerCase()
                        .includes(texto)

                    ||

                    String(
                        permiso.descripcion ||
                            ""
                    )
                        .toLowerCase()
                        .includes(texto)
                );
            }
        );

    // ==========================================
    // EXPORTAR EXCEL
    // ==========================================

    const exportarExcel = () => {

        if (!puedeExportar) {
            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para exportar permisos.",
                "warning"
            );

            return;
        }

        const datos =
            permisosFiltrados.map(
                (permiso) => ({
                    ID:
                        permiso.id,

                    Nombre:
                        permiso.nombre,

                    Descripcion:
                        permiso.descripcion ||
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
                "Permisos"
            );

        XLSX.writeFile(
            libro,
            "Permisos.xlsx"
        );
    };

    // ==========================================
    // EXPORTAR PDF
    // ==========================================

    const exportarPDF = () => {

        if (!puedeExportar) {
            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para exportar permisos.",
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
            "Reporte de Permisos - RADA",
            14,
            15
        );

        autoTable(doc, {
            startY: 22,

            head: [[
                "ID",
                "Nombre",
                "Descripción",
            ]],

            body:
                permisosFiltrados.map(
                    (permiso) => [
                        permiso.id,
                        permiso.nombre ||
                            "",
                        permiso.descripcion ||
                            "",
                    ]
                ),
        });

        doc.save(
            "Permisos.pdf"
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
                        Permisos
                    </h2>

                    <p className="text-muted mb-0">
                        Gestión de permisos del sistema
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
                                    permisosFiltrados.length ===
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
                                    permisosFiltrados.length ===
                                    0
                                }
                            >
                                PDF
                            </button>
                        </>
                    )}

                    {/* NUEVO PERMISO */}
                    {puedeCrear && (
                        <Link
                            to="/permisos/nuevo"
                            className="btn btn-primary"
                        >
                            Nuevo Permiso
                        </Link>
                    )}

                </div>

            </div>

            {/* BUSCADOR */}
            <div className="card shadow mb-4">

                <div className="card-body">

                    <label className="form-label">
                        Buscar permiso
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por ID, nombre o descripción..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>

            {/* TABLA */}
            <div className="card shadow">

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-striped table-hover">

                            <thead className="table-dark">

                                <tr>
                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Nombre
                                    </th>

                                    <th>
                                        Descripción
                                    </th>

                                    <th>
                                        Acciones
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {permisosFiltrados.length >
                                0 ? (

                                    permisosFiltrados.map(
                                        (permiso) => (

                                            <tr
                                                key={
                                                    permiso.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        permiso.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        permiso.nombre
                                                    }
                                                </td>

                                                <td>
                                                    {permiso.descripcion ||
                                                        "Sin descripción"}
                                                </td>

                                                <td className="text-nowrap">

                                                    {/* EDITAR */}
                                                    {puedeEditar && (
                                                        <Link
                                                            to={`/permisos/editar/${permiso.id}`}
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
                                                                eliminarPermiso(
                                                                    permiso.id
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
                                            colSpan="4"
                                            className="text-center"
                                        >
                                            No se encontraron permisos.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default Permisos;