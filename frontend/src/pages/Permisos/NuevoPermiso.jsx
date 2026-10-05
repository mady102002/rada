import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function NuevoPermiso() {
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nombre: "",
        descripcion: "",
    });

    const [guardando, setGuardando] = useState(false);

    const cambiarValor = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value,
        });
    };

    const guardarPermiso = async (e) => {
        e.preventDefault();

        const nombre = formulario.nombre.trim();
        const descripcion = formulario.descripcion.trim();

        if (!nombre) {
            Swal.fire(
                "Campo obligatorio",
                "Debe ingresar el nombre del permiso.",
                "warning"
            );

            return;
        }

        try {
            setGuardando(true);

            await api.post("/permisos", {
                nombre,
                descripcion,
            });

            await Swal.fire(
                "Correcto",
                "Permiso registrado correctamente.",
                "success"
            );

            navigate("/permisos");
        } catch (error) {
            console.error(
                "ERROR AL CREAR PERMISO:",
                error.response?.data || error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo registrar el permiso.",
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
                    <h4 className="mb-0">Nuevo Permiso</h4>
                </div>

                <div className="card-body">
                    <form onSubmit={guardarPermiso}>
                        <div className="mb-3">
                            <label
                                htmlFor="nombre"
                                className="form-label"
                            >
                                Nombre
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

                        <div className="mb-3">
                            <label
                                htmlFor="descripcion"
                                className="form-label"
                            >
                                Descripción
                            </label>

                            <textarea
                                id="descripcion"
                                className="form-control"
                                rows="4"
                                name="descripcion"
                                value={formulario.descripcion}
                                onChange={cambiarValor}
                            />
                        </div>

                        <button
                            className="btn btn-success me-2"
                            type="submit"
                            disabled={guardando}
                        >
                            {guardando
                                ? "Guardando..."
                                : "Guardar Permiso"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/permisos")}
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

export default NuevoPermiso;