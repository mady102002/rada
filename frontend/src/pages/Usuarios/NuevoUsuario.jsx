import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function NuevoUsuario() {
    const navigate = useNavigate();

    const [guardando, setGuardando] = useState(false);
    const [cargandoRoles, setCargandoRoles] = useState(true);

    const [roles, setRoles] = useState([]);

    const [formulario, setFormulario] = useState({
        username: "",
        email: "",
        password: "",
        rol_id: "",
    });

    useEffect(() => {
        cargarRoles();
    }, []);

    // ==========================================
    // CARGAR ROLES
    // ==========================================
    const cargarRoles = async () => {
        try {
            setCargandoRoles(true);

            const respuesta = await api.get("/roles");

            console.log(
                "ROLES RECIBIDOS:",
                respuesta.data
            );

            setRoles(
                Array.isArray(respuesta.data)
                    ? respuesta.data
                    : []
            );

        } catch (error) {
            console.error(
                "ERROR AL CARGAR ROLES:",
                error.response?.data || error.message
            );

            Swal.fire(
                "Error",
                "No se pudieron cargar los roles.",
                "error"
            );

        } finally {
            setCargandoRoles(false);
        }
    };

    // ==========================================
    // CAMBIAR CAMPOS
    // ==========================================
    const handleChange = (e) => {
        const { name, value } = e.target;

        console.log(
            "CAMBIO EN FORMULARIO:",
            name,
            value
        );

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value,
        }));
    };

    // ==========================================
    // GUARDAR USUARIO
    // ==========================================
    const guardarUsuario = async (e) => {
        e.preventDefault();

        const username =
            formulario.username.trim();

        const email =
            formulario.email.trim();

        const password =
            formulario.password;

        const rolId =
            Number(formulario.rol_id);

        // ======================================
        // VALIDACIONES
        // ======================================

        if (!username) {
            Swal.fire(
                "Campo obligatorio",
                "Ingrese el nombre de usuario.",
                "warning"
            );
            return;
        }

        if (!email) {
            Swal.fire(
                "Campo obligatorio",
                "Ingrese el correo electrónico.",
                "warning"
            );
            return;
        }

        if (!password.trim()) {
            Swal.fire(
                "Campo obligatorio",
                "Ingrese la contraseña.",
                "warning"
            );
            return;
        }

        if (!rolId) {
            Swal.fire(
                "Campo obligatorio",
                "Seleccione un rol.",
                "warning"
            );
            return;
        }

        try {
            setGuardando(true);

            // ======================================
            // COMPROBAR FORMULARIO COMPLETO
            // ======================================

            console.log(
                "FORMULARIO COMPLETO:",
                formulario
            );

            // ======================================
            // DATOS QUE SE ENVÍAN AL BACKEND
            // ======================================

            const datos = {
                username: username,
                email: email,
                password: password,
                rol_id: rolId,
            };

            console.log(
                "DATOS QUE ENVÍO:",
                datos
            );

            // ======================================
            // CREAR USUARIO + ROL
            // ======================================

            const respuesta = await api.post(
                "/usuarios",
                datos
            );

            console.log(
                "RESPUESTA DEL BACKEND:",
                respuesta.data
            );

            await Swal.fire({
                icon: "success",
                title: "Correcto",
                text:
                    respuesta.data?.mensaje ||
                    "Usuario creado y rol asignado correctamente.",
            });

            navigate("/usuarios");

        } catch (error) {
            console.error(
                "ERROR AL CREAR USUARIO:",
                error
            );

            console.error(
                "RESPUESTA DEL BACKEND:",
                error.response?.data
            );

            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error.response?.data?.mensaje ||
                    error.message ||
                    "No se pudo crear el usuario.",
            });

        } finally {
            setGuardando(false);
        }
    };

    return (
        <DashboardLayout>

            <div className="card shadow">

                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">
                        Nuevo Usuario
                    </h4>
                </div>

                <div className="card-body">

                    <form onSubmit={guardarUsuario}>

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
                                value={formulario.username}
                                onChange={handleChange}
                                placeholder="Ingrese el nombre de usuario"
                                required
                            />

                        </div>

                        {/* CORREO */}
                        <div className="mb-3">

                            <label
                                htmlFor="email"
                                className="form-label"
                            >
                                Correo electrónico
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="form-control"
                                value={formulario.email}
                                onChange={handleChange}
                                placeholder="Ingrese el correo electrónico"
                                required
                            />

                        </div>

                        {/* CONTRASEÑA */}
                        <div className="mb-3">

                            <label
                                htmlFor="password"
                                className="form-label"
                            >
                                Contraseña
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                className="form-control"
                                value={formulario.password}
                                onChange={handleChange}
                                placeholder="Ingrese la contraseña"
                                required
                            />

                        </div>

                        {/* ROL */}
                        <div className="mb-4">

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
                                value={formulario.rol_id}
                                onChange={handleChange}
                                disabled={cargandoRoles}
                                required
                            >
                                <option value="">
                                    Seleccione un rol
                                </option>

                                {roles.map((rol) => (
                                    <option
                                        key={rol.id}
                                        value={rol.id}
                                    >
                                        {rol.nombre}
                                    </option>
                                ))}

                            </select>

                            {cargandoRoles && (
                                <small className="text-muted">
                                    Cargando roles...
                                </small>
                            )}

                        </div>

                        {/* BOTONES */}
                        <button
                            type="submit"
                            className="btn btn-success me-2"
                            disabled={
                                guardando ||
                                cargandoRoles
                            }
                        >
                            {guardando
                                ? "Guardando..."
                                : "Guardar Usuario"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate("/usuarios")
                            }
                            disabled={guardando}
                        >
                            Cancelar
                        </button>

                    </form>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default NuevoUsuario;