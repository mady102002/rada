import { Navigate } from "react-router-dom";

function ProtectedPermissionRoute({
    permiso,
    children,
}) {

    let permisos = [];

    try {

        permisos =
            JSON.parse(
                localStorage.getItem("permisos")
            ) || [];

    } catch {

        permisos = [];

    }

    if (!permisos.includes(permiso)) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }

    return children;

}

export default ProtectedPermissionRoute;