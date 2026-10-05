import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function EditarRol() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nombre: "",
    });

    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        cargarRol();
    }, [id]);

    const cargarRol = async () => {
        try {
            const respuesta = await api.get(`/roles/${id}`);

            setFormulario({
                nombre: respuesta.data.nombre || "",
            });
        } catch (error) {
            console.error(
                "ERROR AL CARGAR ROL:",
                error.response?.data || error.message
            );

            await Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo cargar el rol.",
                "error"
            );

            navigate("/roles");
        }
    };

    const cambiarValor = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value,
        });
    };

    const actualizarRol = async (e) => {
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

            await api.put(`/roles/${id}`, {
                nombre,
            });

            await Swal.fire(
                "Correcto",
                "Rol actualizado correctamente.",
                "success"
            );

            navigate("/roles");
        } catch (error) {
            console.error(
                "ERROR AL ACTUALIZAR ROL:",
                error.response?.data || error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo actualizar el rol.",
                "error"
            );
        } finally {
            setGuardando(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="card shadow">
                <div className="card-header bg-warning text-dark">
                    <h4 className="mb-0">Editar Rol</h4>
                </div>

                <div className="card-body">
                    <form onSubmit={actualizarRol}>
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
                            className="btn btn-warning me-2"
                            type="submit"
                            disabled={guardando}
                        >
                            {guardando
                                ? "Actualizando..."
                                : "Actualizar Rol"}
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

export default EditarRol;