import { NavLink } from "react-router-dom";

import {
    FaHome,
    FaUsers,
    FaUser,
    FaUserShield,
    FaKey,
    FaFileAlt,
    FaMoneyBillWave
} from "react-icons/fa";

import "../styles/sidebar.css";

function Sidebar() {

    // ==========================================
    // OBTENER PERMISOS
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

    console.log(
        "PERMISOS DEL SIDEBAR:",
        permisos
    );

    return (
        <aside className="sidebar">

            <div className="sidebar-header">

                <h2>
                    RADA
                </h2>

                <span>
                    Sistema de Gestión
                </span>

            </div>

            <nav>

                {/* DASHBOARD */}
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? "menu-link active"
                            : "menu-link"
                    }
                >
                    <FaHome />

                    <span>
                        Dashboard
                    </span>
                </NavLink>


                {/* CLIENTES */}
                {tienePermiso("CLIENTES_VER") && (
                    <NavLink
                        to="/clientes"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >
                        <FaUsers />

                        <span>
                            Clientes
                        </span>
                    </NavLink>
                )}


                {/* USUARIOS */}
                {tienePermiso("USUARIOS_VER") && (
                    <NavLink
                        to="/usuarios"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >
                        <FaUser />

                        <span>
                            Usuarios
                        </span>
                    </NavLink>
                )}


                {/* ROLES */}
                {tienePermiso("ROLES_VER") && (
                    <NavLink
                        to="/roles"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >
                        <FaUserShield />

                        <span>
                            Roles
                        </span>
                    </NavLink>
                )}


                {/* PERMISOS */}
                {tienePermiso("PERMISOS_VER") && (
                    <NavLink
                        to="/permisos"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >
                        <FaKey />

                        <span>
                            Permisos
                        </span>
                    </NavLink>
                )}


                {/* TRÁMITES */}
                {tienePermiso("TRAMITES_VER") && (
                    <NavLink
                        to="/tramites"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >
                        <FaFileAlt />

                        <span>
                            Trámites
                        </span>
                    </NavLink>
                )}


                {/* PAGOS */}
                {tienePermiso("PAGOS_VER") && (
                    <NavLink
                        to="/pagos"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-link active"
                                : "menu-link"
                        }
                    >
                        <FaMoneyBillWave />

                        <span>
                            Pagos
                        </span>
                    </NavLink>
                )}

            </nav>

        </aside>
    );
}

export default Sidebar;