import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function MiPerfil() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        id: "",
        username: "",
        email: "",
        rol: "",
    });

    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarPerfil();
    }, []);

    const cargarPerfil = async () => {
        try {
            setCargando(true);

            const respuesta = await api.get("/auth/perfil");

            setUsuario({
                id: respuesta.data.id || "",
                username: respuesta.data.username || "",
                email: respuesta.data.email || "",
                rol: respuesta.data.rol || "Sin rol",
            });

        } catch (error) {
            console.error(
                "ERROR AL CARGAR PERFIL:",
                error.response?.data || error.message
            );

            await Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo cargar el perfil.",
                "error"
            );

            navigate("/dashboard");

        } finally {
            setCargando(false);
        }
    };

    if (cargando) {
        return (
            <DashboardLayout>

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Cargando...
                        </span>
                    </div>

                    <p className="mt-3">
                        Cargando perfil...
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
                        Mi Perfil
                    </h2>

                    <p className="text-muted mb-0">
                        Información de la cuenta actual
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/dashboard")}
                >
                    Volver
                </button>

            </div>

            <div className="row justify-content-center">

                <div className="col-lg-8 col-xl-7">

                    <div className="card shadow">

                        <div className="card-header bg-primary text-white">

                            <h4 className="mb-0">
                                Datos del usuario
                            </h4>

                        </div>

                        <div className="card-body">

                            <div className="text-center mb-4">

                                <div
                                    className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        fontSize: "55px",
                                    }}
                                >
                                    👤
                                </div>

                                <h3 className="mb-1">
                                    {usuario.username}
                                </h3>

                                <span className="badge bg-primary fs-6">
                                    {usuario.rol}
                                </span>

                            </div>

                            <hr />

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        ID de usuario
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={usuario.id}
                                        readOnly
                                    />

                                </div>

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Nombre de usuario
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={usuario.username}
                                        readOnly
                                    />

                                </div>

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Correo electrónico
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    value={usuario.email}
                                    readOnly
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Rol
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={usuario.rol}
                                    readOnly
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default MiPerfil;