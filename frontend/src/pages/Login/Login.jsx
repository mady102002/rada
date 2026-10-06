import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import Swal from "sweetalert2";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cargando, setCargando] = useState(false);

    const iniciarSesion = async (e) => {
        e.preventDefault();

        if (
            !username.trim() ||
            !password.trim()
        ) {
            Swal.fire(
                "Campos obligatorios",
                "Ingrese usuario y contraseña.",
                "warning"
            );

            return;
        }

        try {
            setCargando(true);

            // ==================================
            // BORRAR DATOS DE SESIÓN ANTERIOR
            // ==================================

            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            localStorage.removeItem("username");
            localStorage.removeItem("roles");
            localStorage.removeItem("permisos");

            // ==================================
            // LOGIN
            // ==================================

            const respuesta = await api.post(
                "/auth/login",
                {
                    username: username.trim(),
                    password: password
                }
            );

            const datos = respuesta.data;

            console.log(
                "RESPUESTA LOGIN:",
                datos
            );

            // ==================================
            // TOKEN
            // ==================================

            localStorage.setItem(
                "token",
                datos.token
            );

            // ==================================
            // USUARIO
            // ==================================

            localStorage.setItem(
                "usuario",
                JSON.stringify(
                    datos.usuario || {}
                )
            );

            localStorage.setItem(
                "username",
                datos.usuario?.username ||
                    username.trim()
            );

            // ==================================
            // ROLES
            // ==================================

            const roles = Array.isArray(
                datos.usuario?.roles
            )
                ? datos.usuario.roles
                : [];

            localStorage.setItem(
                "roles",
                JSON.stringify(roles)
            );

            // ==================================
            // PERMISOS
            // ==================================

            const permisos = Array.isArray(
                datos.usuario?.permisos
            )
                ? datos.usuario.permisos
                : [];

            localStorage.setItem(
                "permisos",
                JSON.stringify(permisos)
            );

            console.log(
                "ROLES GUARDADOS:",
                roles
            );

            console.log(
                "PERMISOS GUARDADOS:",
                permisos
            );

            // ==================================
            // MENSAJE DE BIENVENIDA
            // ==================================

            await Swal.fire({
                icon: "success",
                title: "Bienvenido",
                text:
                    datos.usuario?.username ||
                    username,
                timer: 1000,
                showConfirmButton: false
            });

            // ==================================
            // IR AL DASHBOARD
            // ==================================
            // IMPORTANTE:
            // Usamos navigate() porque estamos
            // utilizando HashRouter.
            //
            // Esto llevará automáticamente a:
            // /rada/#/dashboard
            //
            // y NO a:
            // /dashboard
            // ==================================

            navigate("/dashboard", {
                replace: true
            });

        } catch (error) {
            console.error(
                "ERROR LOGIN:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "Usuario o contraseña incorrectos",
                "error"
            );

        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-header bg-primary text-white">

                            <h3 className="text-center mb-0">
                                Sistema RADA
                            </h3>

                        </div>

                        <div className="card-body">

                            <h5 className="text-center">
                                Inicio de Sesión
                            </h5>

                            <hr />

                            <form
                                onSubmit={
                                    iniciarSesion
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
                                        className="form-control"
                                        value={
                                            username
                                        }
                                        onChange={(e) =>
                                            setUsername(
                                                e.target.value
                                            )
                                        }
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
                                        className="form-control"
                                        value={
                                            password
                                        }
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                {/* BOTÓN */}

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={
                                        cargando
                                    }
                                >

                                    {cargando
                                        ? "Ingresando..."
                                        : "Ingresar"}

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;