import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function EditarUsuario() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        username: "",
        email: "",
        rol_id: "",
    });

    const [roles, setRoles] = useState([]);

    const [cargando, setCargando] =
        useState(true);

    const [actualizando, setActualizando] =
        useState(false);

    // ==========================================
    // CARGAR DATOS
    // ==========================================

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setCargando(true);

            // Cargar usuario y roles
            const [
                respuestaUsuario,
                respuestaRoles
            ] = await Promise.all([
                api.get(`/usuarios/${id}`),
                api.get("/roles"),
            ]);

            console.log(
                "USUARIO A EDITAR:",
                respuestaUsuario.data
            );

            console.log(
                "ROLES:",
                respuestaRoles.data
            );

            setRoles(
                Array.isArray(respuestaRoles.data)
                    ? respuestaRoles.data
                    : []
            );

            setFormulario({
                username:
                    respuestaUsuario.data.username ||
                    "",

                email:
                    respuestaUsuario.data.email ||
                    "",

                rol_id:
                    respuestaUsuario.data.rol_id
                        ? String(
                              respuestaUsuario.data.rol_id
                          )
                        : "",
            });

        } catch (error) {
            console.error(
                "ERROR AL CARGAR USUARIO:",
                error.response?.data ||
                    error.message
            );

            await Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo cargar la información del usuario.",
                "error"
            );

            navigate("/usuarios");

        } finally {
            setCargando(false);
        }
    };

    // ==========================================
    // CAMBIOS EN FORMULARIO
    // ==========================================

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]:
                e.target.value,
        });
    };

    // ==========================================
    // ACTUALIZAR
    // ==========================================

    const actualizarUsuario = async (e) => {
        e.preventDefault();

        const username =
            formulario.username.trim();

        const email =
            formulario.email.trim();

        const rolId =
            Number(formulario.rol_id);

        if (
            !username ||
            !email ||
            !rolId
        ) {
            Swal.fire(
                "Campos obligatorios",
                "Debe completar usuario, correo y rol.",
                "warning"
            );

            return;
        }

        try {
            setActualizando(true);

            const datos = {
                username,
                email,
                rol_id: rolId,
            };

            console.log(
                "DATOS A ACTUALIZAR:",
                datos
            );

            await api.put(
                `/usuarios/${id}`,
                datos
            );

            await Swal.fire(
                "Correcto",
                "Usuario y rol actualizados correctamente.",
                "success"
            );

            navigate("/usuarios");

        } catch (error) {
            console.error(
                "ERROR AL ACTUALIZAR USUARIO:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo actualizar el usuario.",
                "error"
            );

        } finally {
            setActualizando(false);
        }
    };

    // ==========================================
    // CARGANDO
    // ==========================================

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
                        Cargando usuario...
                    </p>

                </div>

            </DashboardLayout>
        );
    }

    // ==========================================
    // INTERFAZ
    // ==========================================

    return (
        <DashboardLayout>

            <div className="card shadow">

                <div className="card-header bg-warning text-dark">

                    <h4 className="mb-0">
                        Editar Usuario
                    </h4>

                </div>

                <div className="card-body">

                    <form
                        onSubmit={
                            actualizarUsuario
                        }
                    >

                        {/* USUARIO */}
                        <div className="mb-3">

                            <label
                                htmlFor="username"
                                className="form-label"
                            >
                                Usuario
                            </label>

                            <input
                                id="username"
                                type="text"
                                name="username"
                                className="form-control"
                                value={
                                    formulario.username
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                        {/* EMAIL */}
                        <div className="mb-3">

                            <label
                                htmlFor="email"
                                className="form-label"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="form-control"
                                value={
                                    formulario.email
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                        {/* ROL */}
                        <div className="mb-3">

                            <label
                                htmlFor="rol_id"
                                className="form-label"
                            >
                                Rol
                            </label>

                            <select
                                id="rol_id"
                                name="rol_id"
                                className="form-select"
                                value={
                                    formulario.rol_id
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >
                                <option value="">
                                    Seleccione un rol
                                </option>

                                {roles.map(
                                    (rol) => (

                                        <option
                                            key={
                                                rol.id
                                            }
                                            value={
                                                rol.id
                                            }
                                        >
                                            {
                                                rol.nombre
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        {/* BOTONES */}
                        <button
                            className="btn btn-warning me-2"
                            type="submit"
                            disabled={
                                actualizando
                            }
                        >
                            {actualizando
                                ? "Actualizando..."
                                : "Actualizar Usuario"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate(
                                    "/usuarios"
                                )
                            }
                            disabled={
                                actualizando
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

export default EditarUsuario;