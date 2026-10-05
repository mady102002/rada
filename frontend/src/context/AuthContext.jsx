import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [usuario, setUsuario] = useState(null);

    const login = (datosUsuario) => {
        setUsuario(datosUsuario);
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);