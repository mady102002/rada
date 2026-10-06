import {
    HashRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";

import Clientes from "../pages/Clientes/Clientes";
import NuevoCliente from "../pages/Clientes/NuevoCliente";
import EditarCliente from "../pages/Clientes/EditarCliente";

import Usuarios from "../pages/Usuarios/Usuarios";
import NuevoUsuario from "../pages/Usuarios/NuevoUsuario";
import EditarUsuario from "../pages/Usuarios/EditarUsuario";

import Roles from "../pages/Roles/Roles";
import NuevoRol from "../pages/Roles/NuevoRol";
import EditarRol from "../pages/Roles/EditarRol";
import PermisosRol from "../pages/Roles/PermisosRol";

import Permisos from "../pages/Permisos/Permisos";
import NuevoPermiso from "../pages/Permisos/NuevoPermiso";
import EditarPermiso from "../pages/Permisos/EditarPermiso";

import Tramites from "../pages/Tramites/Tramites";
import NuevoTramite from "../pages/Tramites/NuevoTramite";
import EditarTramite from "../pages/Tramites/EditarTramite";

import Pagos from "../pages/Pagos/Pagos";
import NuevoPago from "../pages/Pagos/NuevoPago";
import EditarPago from "../pages/Pagos/EditarPago";

import MiPerfil from "../pages/Perfil/MiPerfil";
import CambiarContrasena from "../pages/Perfil/CambiarContrasena";

import ProtectedPermissionRoute from "../components/ProtectedPermissionRoute";

function AppRoutes() {
    return (
        <HashRouter>
            <Routes>

                {/* =========================
                    LOGIN
                ========================== */}
                <Route
                    path="/"
                    element={<Login />}
                />

                {/* =========================
                    DASHBOARD
                ========================== */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* =========================
                    CLIENTES
                ========================== */}
                <Route
                    path="/clientes"
                    element={
                        <ProtectedPermissionRoute permiso="CLIENTES_VER">
                            <Clientes />
                        </ProtectedPermissionRoute>
                    }
                />

                <Route
                    path="/clientes/nuevo"
                    element={
                        <ProtectedPermissionRoute permiso="CLIENTES_CREAR">
                            <NuevoCliente />
                        </ProtectedPermissionRoute>
                    }
                />

                <Route
                    path="/clientes/editar/:id"
                    element={
                        <ProtectedPermissionRoute permiso="CLIENTES_EDITAR">
                            <EditarCliente />
                        </ProtectedPermissionRoute>
                    }
                />

                {/* =========================
                    USUARIOS
                ========================== */}
                <Route
                    path="/usuarios"
                    element={
                        <ProtectedPermissionRoute permiso="USUARIOS_VER">
                            <Usuarios />
                        </ProtectedPermissionRoute>
                    }
                />

                <Route
                    path="/usuarios/nuevo"
                    element={
                        <ProtectedPermissionRoute permiso="USUARIOS_CREAR">
                            <NuevoUsuario />
                        </ProtectedPermissionRoute>
                    }
                />

                <Route
                    path="/usuarios/editar/:id"
                    element={
                        <ProtectedPermissionRoute permiso="USUARIOS_EDITAR">
                            <EditarUsuario />
                        </ProtectedPermissionRoute>
                    }
                />

                {/* =========================
                    ROLES
                ========================== */}
                <Route
                    path="/roles"
                    element={
                        <ProtectedPermissionRoute permiso="ROLES_VER">
                            <Roles />
                        </ProtectedPermissionRoute>
                    }
                />

                <Route
                    path="/roles/nuevo"
                    element={
                        <ProtectedPermissionRoute permiso="ROLES_CREAR">
                            <NuevoRol />
                        </ProtectedPermissionRoute>
                    }
                />

                <Route
                    path="/roles/editar/:id"
                    element={
                        <ProtectedPermissionRoute permiso="ROLES_EDITAR">
                            <EditarRol />
                        </ProtectedPermissionRoute>
                    }
                />

                <Route
                    path="/roles/:id/permisos"
                    element={
                        <ProtectedPermissionRoute permiso="ROLES_ASIGNAR_PERMISOS">
                            <PermisosRol />
                        </ProtectedPermissionRoute>
                    }
                />

                {/* =========================
                    PERMISOS
                ========================== */}
                <Route
                    path="/permisos"
                    element={
                        <ProtectedPermissionRoute permiso="PERMISOS_VER">
                            <Permisos />
                        </ProtectedPermissionRoute>
                    }
                />

                <Route
                    path="/permisos/nuevo"
                    element={
                        <ProtectedPermissionRoute permiso="PERMISOS_CREAR">
                            <NuevoPermiso />
                        </ProtectedPermissionRoute>
                    }
                />

                <Route
                    path="/permisos/editar/:id"
                    element={
                        <ProtectedPermissionRoute permiso="PERMISOS_EDITAR">
                            <EditarPermiso />
                        </ProtectedPermissionRoute>
                    }
                />

                {/* =========================
                    TRÁMITES
                ========================== */}
                <Route
                    path="/tramites"
                    element={
                        <ProtectedPermissionRoute permiso="TRAMITES_VER">
                            <Tramites />
                        </ProtectedPermissionRoute>
                    }
                />

                <Route
                    path="/tramites/nuevo"
                    element={
                        <ProtectedPermissionRoute permiso="TRAMITES_CREAR">
                            <NuevoTramite />
                        </ProtectedPermissionRoute>
                    }
                />

                <Route
                    path="/tramites/editar/:id"
                    element={
                        <ProtectedPermissionRoute permiso="TRAMITES_EDITAR">
                            <EditarTramite />
                        </ProtectedPermissionRoute>
                    }
                />

                {/* =========================
                    PAGOS
                ========================== */}
                <Route
                    path="/pagos"
                    element={
                        <ProtectedPermissionRoute permiso="PAGOS_VER">
                            <Pagos />
                        </ProtectedPermissionRoute>
                    }
                />

                <Route
                    path="/pagos/nuevo"
                    element={
                        <ProtectedPermissionRoute permiso="PAGOS_CREAR">
                            <NuevoPago />
                        </ProtectedPermissionRoute>
                    }
                />

                <Route
                    path="/pagos/editar/:tipo/:id"
                    element={
                        <ProtectedPermissionRoute permiso="PAGOS_EDITAR">
                            <EditarPago />
                        </ProtectedPermissionRoute>
                    }
                />

                {/* =========================
                    PERFIL
                ========================== */}
                <Route
                    path="/mi-perfil"
                    element={<MiPerfil />}
                />

                <Route
                    path="/cambiar-contrasena"
                    element={<CambiarContrasena />}
                />

            </Routes>
        </HashRouter>
    );
}

export default AppRoutes;