import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function NuevoRol() {
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nombre: "",
    });

    const [guardando, setGuardando] = useState(false);

    const cambiarValor = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value,
        });
    };

    const guardarRol = async (e) => {
        e.preventDefault();

        const nombre = formulario.nombre.trim();

        if (!nombre) {
            Swal.fire(
                "Campo obligatorio",
                "Debe ingresar el nombre del rol.",
                "warning"
            );

            return;
        }

        try {
            setGuardando(true);

            await api.post("/roles", {
                nombre,
            });

            await Swal.fire(
                "Correcto",
                "Rol registrado correctamente.",
                "success"
            );

            navigate("/roles");
        } catch (error) {
            console.error(
                "ERROR AL CREAR ROL:",
                error.response?.data || error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo registrar el rol.",
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
                    <h4 className="mb-0">Nuevo Rol</h4>
                </div>

                <div className="card-body">
                    <form onSubmit={guardarRol}>
                        <div className="mb-3">
                            <label
                                htmlFor="nombre"
                                className="form-label"
                            >
                                Nombre del Rol
                            </label>

                            <input
                                id="nombre"
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={formulario.nombre}
                                onChange={cambiarValor}
                                required
                            />
                        </div>

                        <button
                            className="btn btn-success me-2"
                            type="submit"
                            disabled={guardando}
                        >
                            {guardando
                                ? "Guardando..."
                                : "Guardar Rol"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/roles")}
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

export default NuevoRol;