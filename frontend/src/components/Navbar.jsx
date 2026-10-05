import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const [mostrarMenu, setMostrarMenu] =
        useState(false);

    let usuario = {};
    let roles = [];

    try {
        usuario =
            JSON.parse(
                localStorage.getItem("usuario")
            ) || {};
    } catch {
        usuario = {};
    }

    try {
        roles =
            JSON.parse(
                localStorage.getItem("roles")
            ) || [];
    } catch {
        roles = [];
    }

    const username =
        usuario.username ||
        localStorage.getItem("username") ||
        "Usuario";

    const rol =
        roles.length > 0
            ? roles
                  .map((item) => item.nombre)
                  .join(", ")
            : "Sin rol";

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
        localStorage.removeItem("permisos");

        navigate("/");
    };

    return (
        <header className="navbar">

            <div className="navbar-left">
                <h4>RADA</h4>
            </div>

            <div className="navbar-right">

                <div className="usuario-menu">

                    <button
                        type="button"
                        className="usuario-boton"
                        onClick={() =>
                            setMostrarMenu(
                                !mostrarMenu
                            )
                        }
                    >

                        <span className="usuario-icono">
                            👤
                        </span>

                        <div className="usuario-info">

                            <strong>
                                {username}
                            </strong>

                            <small>
                                {rol}
                            </small>

                        </div>

                        <span className="usuario-flecha">
                            ▼
                        </span>

                    </button>

                    {mostrarMenu && (

                        <div className="usuario-dropdown">

                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => {
                                    setMostrarMenu(false);
                                    navigate("/mi-perfil");
                                }}
                            >
                                Mi perfil
                            </button>

                            <button
    type="button"
    className="dropdown-item"
    onClick={() => {
        setMostrarMenu(false);

        navigate(
            "/cambiar-contrasena"
        );
    }}
>
    Cambiar contraseña
</button>

                            <hr />

                            <button
                                type="button"
                                className="dropdown-item cerrar-sesion"
                                onClick={cerrarSesion}
                            >
                                Cerrar sesión
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>
    );
}

export default Navbar;