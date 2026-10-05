import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function CambiarContrasena() {
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        password_actual: "",
        password_nueva: "",
        confirmar_password: "",
    });

    const [guardando, setGuardando] =
        useState(false);

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value,
        });
    };

    const cambiarContrasena = async (e) => {
        e.preventDefault();

        if (
            !formulario.password_actual ||
            !formulario.password_nueva ||
            !formulario.confirmar_password
        ) {
            Swal.fire(
                "Campos obligatorios",
                "Complete todos los campos.",
                "warning"
            );

            return;
        }

        if (
            formulario.password_nueva !==
            formulario.confirmar_password
        ) {
            Swal.fire(
                "Error",
                "Las nuevas contraseñas no coinciden.",
                "warning"
            );

            return;
        }

        if (
            formulario.password_nueva.length < 4
        ) {
            Swal.fire(
                "Contraseña muy corta",
                "La nueva contraseña debe tener al menos 4 caracteres.",
                "warning"
            );

            return;
        }

        try {
            setGuardando(true);

            await api.put(
                "/auth/cambiar-contrasena",
                {
                    password_actual:
                        formulario.password_actual,

                    password_nueva:
                        formulario.password_nueva,
                }
            );

            await Swal.fire(
                "Correcto",
                "Contraseña actualizada correctamente.",
                "success"
            );

            navigate("/dashboard");

        } catch (error) {
            console.error(
                "ERROR AL CAMBIAR CONTRASEÑA:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo cambiar la contraseña.",
                "error"
            );

        } finally {
            setGuardando(false);
        }
    };

    return (
        <DashboardLayout>

            <div className="card shadow">

                <div className="card-header bg-primary text-white">

                    <h4 className="mb-0">
                        Cambiar contraseña
                    </h4>

                </div>

                <div className="card-body">

                    <form
                        onSubmit={
                            cambiarContrasena
                        }
                    >

                        <div className="mb-3">

                            <label
                                htmlFor="password_actual"
                                className="form-label"
                            >
                                Contraseña actual
                            </label>

                            <input
                                id="password_actual"
                                type="password"
                                name="password_actual"
                                className="form-control"
                                value={
                                    formulario.password_actual
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label
                                htmlFor="password_nueva"
                                className="form-label"
                            >
                                Nueva contraseña
                            </label>

                            <input
                                id="password_nueva"
                                type="password"
                                name="password_nueva"
                                className="form-control"
                                value={
                                    formulario.password_nueva
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label
                                htmlFor="confirmar_password"
                                className="form-label"
                            >
                                Confirmar nueva contraseña
                            </label>

                            <input
                                id="confirmar_password"
                                type="password"
                                name="confirmar_password"
                                className="form-control"
                                value={
                                    formulario.confirmar_password
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary me-2"
                            disabled={
                                guardando
                            }
                        >
                            {guardando
                                ? "Actualizando..."
                                : "Cambiar contraseña"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate(
                                    "/dashboard"
                                )
                            }
                            disabled={
                                guardando
                            }
                        >
                            Cancelar
                        </button>

                    </form>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default CambiarContrasena;