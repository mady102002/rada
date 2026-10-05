import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function PermisosRol() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [rol, setRol] = useState(null);
    const [permisos, setPermisos] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setCargando(true);

            const [
                respuestaRol,
                respuestaPermisos,
                respuestaAsignados,
            ] = await Promise.all([
                api.get(`/roles/${id}`),
                api.get("/permisos"),
                api.get(`/roles-permisos/rol/${id}`),
            ]);

            setRol(respuestaRol.data);

            setPermisos(
                Array.isArray(respuestaPermisos.data)
                    ? respuestaPermisos.data
                    : []
            );

            const idsAsignados = Array.isArray(
                respuestaAsignados.data
            )
                ? respuestaAsignados.data.map(
                      (item) => item.permiso_id
                  )
                : [];

            setSeleccionados(idsAsignados);

        } catch (error) {
            console.error(
                "ERROR AL CARGAR PERMISOS DEL ROL:",
                error.response?.data || error.message
            );

            await Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudieron cargar los permisos del rol.",
                "error"
            );

            navigate("/roles");

        } finally {
            setCargando(false);
        }
    };

    const cambiarPermiso = (permisoId) => {
        setSeleccionados((actuales) => {
            if (actuales.includes(permisoId)) {
                return actuales.filter(
                    (idPermiso) =>
                        idPermiso !== permisoId
                );
            }

            return [
                ...actuales,
                permisoId,
            ];
        });
    };

    const seleccionarTodos = () => {
        setSeleccionados(
            permisos.map((permiso) => permiso.id)
        );
    };

    const quitarTodos = () => {
        setSeleccionados([]);
    };

    const guardarPermisos = async () => {
        try {
            setGuardando(true);

            await api.put(
                `/roles-permisos/rol/${id}`,
                {
                    permisos: seleccionados,
                }
            );

            await Swal.fire(
                "Correcto",
                "Permisos del rol actualizados correctamente.",
                "success"
            );

            navigate("/roles");

        } catch (error) {
            console.error(
                "ERROR AL GUARDAR PERMISOS:",
                error.response?.data || error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudieron guardar los permisos.",
                "error"
            );

        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return (
            <DashboardLayout>
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
                        Cargando permisos...
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="mb-1">
                        Permisos del Rol
                    </h2>

                    <p className="text-muted mb-0">
                        Rol:{" "}
                        <strong>
                            {rol?.nombre}
                        </strong>
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate("/roles")
                    }
                >
                    Volver
                </button>

            </div>

            <div className="card shadow">

                <div className="card-header bg-dark text-white">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="mb-0">
                            Seleccionar permisos
                        </h5>

                        <div className="d-flex gap-2">

                            <button
                                type="button"
                                className="btn btn-sm btn-light"
                                onClick={seleccionarTodos}
                            >
                                Seleccionar todos
                            </button>

                            <button
                                type="button"
                                className="btn btn-sm btn-outline-light"
                                onClick={quitarTodos}
                            >
                                Quitar todos
                            </button>

                        </div>

                    </div>

                </div>

                <div className="card-body">

                    {permisos.length > 0 ? (

                        <div className="row">

                            {permisos.map((permiso) => (

                                <div
                                    key={permiso.id}
                                    className="col-md-6 col-lg-4 mb-3"
                                >

                                    <div className="form-check border rounded p-3">

                                        <input
                                            className="form-check-input ms-0 me-2"
                                            type="checkbox"
                                            id={`permiso-${permiso.id}`}
                                            checked={
                                                seleccionados.includes(
                                                    permiso.id
                                                )
                                            }
                                            onChange={() =>
                                                cambiarPermiso(
                                                    permiso.id
                                                )
                                            }
                                        />

                                        <label
                                            className="form-check-label"
                                            htmlFor={`permiso-${permiso.id}`}
                                        >
                                            <strong>
                                                {permiso.nombre}
                                            </strong>

                                            {permiso.descripcion && (
                                                <div className="small text-muted mt-1">
                                                    {
                                                        permiso.descripcion
                                                    }
                                                </div>
                                            )}

                                        </label>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="text-center text-muted py-4">
                            No existen permisos registrados.
                        </div>

                    )}

                    <hr />

                    <div className="d-flex justify-content-end">

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={guardarPermisos}
                            disabled={guardando}
                        >
                            {guardando
                                ? "Guardando..."
                                : "Guardar permisos"}
                        </button>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default PermisosRol;