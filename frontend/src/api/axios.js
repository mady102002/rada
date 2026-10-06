import axios from "axios";

// ==========================================
// URL DEL BACKEND
// ==========================================
//
// En desarrollo:
// VITE_API_URL=http://localhost:3000
//
// En producción:
// VITE_API_URL=https://TU-BACKEND.onrender.com
//
// ==========================================

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

// ==========================================
// CONFIGURACIÓN AXIOS
// ==========================================

const api = axios.create({

    baseURL: API_URL,

    headers: {
        "Content-Type":
            "application/json",
    },

    timeout: 15000
});

// ==========================================
// AGREGAR TOKEN AUTOMÁTICAMENTE
// ==========================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem(
                "token"
            );

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;
    },

    (error) => {

        return Promise.reject(error);

    }
);

// ==========================================
// MANEJAR ERRORES DE RESPUESTA
// ==========================================

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        // Token inválido o expirado

        if (
            error.response?.status === 401
        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "usuario"
            );

            localStorage.removeItem(
                "username"
            );

            localStorage.removeItem(
                "roles"
            );

            localStorage.removeItem(
                "permisos"
            );

            // Con HashRouter debemos usar hash

            if (
                !window.location.hash.includes(
                    "/login"
                )
            ) {

                window.location.hash =
                    "#/login";

            }

        }

        return Promise.reject(
            error
        );

    }
);

// ==========================================
// EXPORTAR
// ==========================================

export default api;