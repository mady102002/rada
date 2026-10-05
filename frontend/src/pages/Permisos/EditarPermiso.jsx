import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function EditarPermiso() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nombre: "",
        descripcion: "",
    });

    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        cargarPermiso();
    }, [id]);

    const cargarPermiso = async () => {
        try {
            const respuesta = await api.get(`/permisos/${id}`);

            setFormulario({
                nombre: respuesta.data.nombre || "",
                descripcion: respuesta.data.descripcion || "",
            });
        } catch (error) {
            console.error(
                "ERROR AL CARGAR PERMISO:",
                error.response?.data || error.message
            );

            await Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo cargar el permiso.",
                "error"
            );

            navigate("/permisos");
        }
    };

    const cambiarValor = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value,
        });
    };

    const actualizarPermiso = async (e) => {
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

            await api.put(`/permisos/${id}`, {
                nombre,
                descripcion,
            });

            await Swal.fire(
                "Correcto",
                "Permiso actualizado correctamente.",
                "success"
            );

            navigate("/permisos");
        } catch (error) {
            console.error(
                "ERROR AL ACTUALIZAR PERMISO:",
                error.response?.data || error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo actualizar el permiso.",
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
                    <h4 className="mb-0">Editar Permiso</h4>
                </div>

                <div className="card-body">
                    <form onSubmit={actualizarPermiso}>
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
                            className="btn btn-warning me-2"
                            type="submit"
                            disabled={guardando}
                        >
                            {guardando
                                ? "Actualizando..."
                                : "Actualizar Permiso"}
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

export default EditarPermiso;