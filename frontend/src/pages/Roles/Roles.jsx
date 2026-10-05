import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Roles() {
    const [roles, setRoles] = useState([]);
    const [busqueda, setBusqueda] = useState("");

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
        tienePermiso("ROLES_CREAR");

    const puedeEditar =
        tienePermiso("ROLES_EDITAR");

    const puedeEliminar =
        tienePermiso("ROLES_ELIMINAR");

    const puedeExportar =
        tienePermiso("ROLES_EXPORTAR");

    const puedeAsignarPermisos =
        tienePermiso(
            "ROLES_ASIGNAR_PERMISOS"
        );

    // ==========================================
    // CARGAR ROLES
    // ==========================================

    useEffect(() => {
        cargarRoles();
    }, []);

    const cargarRoles = async () => {
        try {
            const respuesta =
                await api.get("/roles");

            setRoles(
                Array.isArray(respuesta.data)
                    ? respuesta.data
                    : []
            );

        } catch (error) {
            console.error(
                "ERROR AL CARGAR ROLES:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudieron cargar los roles.",
                "error"
            );
        }
    };

    // ==========================================
    // ELIMINAR ROL
    // ==========================================

    const eliminarRol = async (id) => {

        if (!puedeEliminar) {
            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para eliminar roles.",
                "warning"
            );

            return;
        }

        const resultado =
            await Swal.fire({
                title:
                    "¿Eliminar rol?",

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
                `/roles/${id}`
            );

            await Swal.fire(
                "Eliminado",
                "Rol eliminado correctamente.",
                "success"
            );

            cargarRoles();

        } catch (error) {
            console.error(
                "ERROR AL ELIMINAR ROL:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo eliminar el rol.",
                "error"
            );
        }
    };

    // ==========================================
    // FILTRAR
    // ==========================================

    const rolesFiltrados =
        roles.filter((rol) => {

            const texto =
                busqueda
                    .toLowerCase()
                    .trim();

            if (!texto) {
                return true;
            }

            return (
                String(rol.id || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                String(rol.nombre || "")
                    .toLowerCase()
                    .includes(texto)
            );
        });

    // ==========================================
    // EXCEL
    // ==========================================

    const exportarExcel = () => {

        if (!puedeExportar) {
            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para exportar roles.",
                "warning"
            );

            return;
        }

        const datos =
            rolesFiltrados.map(
                (rol) => ({
                    ID:
                        rol.id,

                    Nombre:
                        rol.nombre,
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
            "Roles"
        );

        XLSX.writeFile(
            libro,
            "Roles.xlsx"
        );
    };

    // ==========================================
    // PDF
    // ==========================================

    const exportarPDF = () => {

        if (!puedeExportar) {
            Swal.fire(
                "Acceso denegado",
                "No tiene permiso para exportar roles.",
                "warning"
            );

            return;
        }

        const doc =
            new jsPDF();

        doc.setFontSize(16);

        doc.text(
            "Reporte de Roles - RADA",
            14,
            15
        );

        autoTable(doc, {
            startY: 22,

            head: [[
                "ID",
                "Nombre"
            ]],

            body:
                rolesFiltrados.map(
                    (rol) => [
                        rol.id,
                        rol.nombre || "",
                    ]
                ),
        });

        doc.save(
            "Roles.pdf"
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
                        Roles
                    </h2>

                    <p className="text-muted mb-0">
                        Gestión de roles del sistema
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
                                    rolesFiltrados.length ===
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
                                    rolesFiltrados.length ===
                                    0
                                }
                            >
                                PDF
                            </button>
                        </>
                    )}

                    {/* NUEVO ROL */}
                    {puedeCrear && (

                        <Link
                            to="/roles/nuevo"
                            className="btn btn-primary"
                        >
                            Nuevo Rol
                        </Link>

                    )}

                </div>

            </div>

            {/* BUSCADOR */}
            <div className="card shadow mb-4">

                <div className="card-body">

                    <label className="form-label">
                        Buscar rol
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por ID o nombre..."
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

                        <table className="table table-striped table-hover align-middle">

                            <thead className="table-dark">

                                <tr>
                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Nombre
                                    </th>

                                    <th>
                                        Acciones
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {rolesFiltrados.length >
                                0 ? (

                                    rolesFiltrados.map(
                                        (rol) => (

                                            <tr
                                                key={
                                                    rol.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        rol.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        rol.nombre
                                                    }
                                                </td>

                                                <td className="text-nowrap">

                                                    {/* EDITAR */}
                                                    {puedeEditar && (

                                                        <Link
                                                            to={`/roles/editar/${rol.id}`}
                                                            className="btn btn-warning btn-sm me-2"
                                                        >
                                                            Editar
                                                        </Link>

                                                    )}

                                                    {/* ASIGNAR PERMISOS */}
                                                    {puedeAsignarPermisos && (

                                                        <Link
                                                            to={`/roles/${rol.id}/permisos`}
                                                            className="btn btn-info btn-sm me-2"
                                                        >
                                                            Permisos
                                                        </Link>

                                                    )}

                                                    {/* ELIMINAR */}
                                                    {puedeEliminar && (

                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() =>
                                                                eliminarRol(
                                                                    rol.id
                                                                )
                                                            }
                                                        >
                                                            Eliminar
                                                        </button>

                                                    )}

                                                    {/* SOLO LECTURA */}
                                                    {!puedeEditar &&
                                                        !puedeAsignarPermisos &&
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
                                            colSpan="3"
                                            className="text-center"
                                        >
                                            No se encontraron roles.
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

export default Roles;