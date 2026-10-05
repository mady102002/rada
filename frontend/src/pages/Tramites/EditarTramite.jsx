import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function EditarTramite() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    // ==========================================
    // FORMULARIO
    // ==========================================
    const [formulario, setFormulario] = useState({
        num_tramite: "",
        cliente_id: "",
        status: "PENDIENTE",
        fecha_tramite: "",
        tipo_tramite: "",
        categoria: "",
        referencia: "",
        observacion: "",
    });

    // ==========================================
    // CARGAR DATOS
    // ==========================================
    useEffect(() => {
        cargarDatos();
    }, [id]);

    const cargarDatos = async () => {
        try {
            setCargando(true);

            const [
                respuestaClientes,
                respuestaTramite
            ] = await Promise.all([
                api.get("/clientes"),
                api.get(`/tramites/${id}`),
            ]);

            setClientes(
                Array.isArray(respuestaClientes.data)
                    ? respuestaClientes.data
                    : []
            );

            const tramite = respuestaTramite.data;

            console.log(
                "TRÁMITE A EDITAR:",
                tramite
            );

            setFormulario({
                num_tramite:
                    tramite.num_tramite || "",

                cliente_id:
                    tramite.cliente_id || "",

                status:
                    tramite.status || "PENDIENTE",

                fecha_tramite:
                    tramite.fecha_tramite
                        ? tramite.fecha_tramite.split("T")[0]
                        : "",

                tipo_tramite:
                    tramite.tipo_tramite || "",

                categoria:
                    tramite.categoria || "",

                referencia:
                    tramite.referencia || "",

                observacion:
                    tramite.observacion || "",
            });

        } catch (error) {
            console.error(
                "ERROR AL CARGAR EL TRÁMITE:",
                error.response?.data ||
                    error.message
            );

            await Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo cargar la información del trámite.",
                "error"
            );

            navigate("/tramites");

        } finally {
            setCargando(false);
        }
    };

    // ==========================================
    // CAMBIAR VALORES
    // ==========================================
    const cambiarValor = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value,
        });
    };

    // ==========================================
    // ACTUALIZAR TRÁMITE
    // ==========================================
    const actualizarTramite = async (e) => {
        e.preventDefault();

        // NÚMERO DE TRÁMITE
        if (!formulario.num_tramite.trim()) {
            Swal.fire(
                "Campo obligatorio",
                "Ingrese el número del trámite.",
                "warning"
            );

            return;
        }

        // CLIENTE
        if (!formulario.cliente_id) {
            Swal.fire(
                "Campo obligatorio",
                "Seleccione un cliente.",
                "warning"
            );

            return;
        }

        // ESTADO
        if (!formulario.status) {
            Swal.fire(
                "Campo obligatorio",
                "Seleccione el estado del trámite.",
                "warning"
            );

            return;
        }

        // FECHA
        if (!formulario.fecha_tramite) {
            Swal.fire(
                "Campo obligatorio",
                "Seleccione la fecha del trámite.",
                "warning"
            );

            return;
        }

        // TIPO DE TRÁMITE
        if (!formulario.tipo_tramite.trim()) {
            Swal.fire(
                "Campo obligatorio",
                "Ingrese el tipo de trámite.",
                "warning"
            );

            return;
        }

        try {
            setGuardando(true);

            const datos = {
                num_tramite:
                    formulario.num_tramite.trim(),

                cliente_id:
                    Number(formulario.cliente_id),

                status:
                    formulario.status,

                fecha_tramite:
                    formulario.fecha_tramite,

                tipo_tramite:
                    formulario.tipo_tramite.trim(),

                categoria:
                    formulario.categoria.trim(),

                referencia:
                    formulario.referencia.trim(),

                observacion:
                    formulario.observacion.trim(),
            };

            console.log(
                "DATOS A ACTUALIZAR:",
                datos
            );

            await api.put(
                `/tramites/${id}`,
                datos
            );

            await Swal.fire(
                "Correcto",
                "Trámite actualizado correctamente.",
                "success"
            );

            navigate("/tramites");

        } catch (error) {
            console.error(
                "ERROR AL ACTUALIZAR TRÁMITE:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo actualizar el trámite.",
                "error"
            );

        } finally {
            setGuardando(false);
        }
    };

    // ==========================================
    // CARGANDO
    // ==========================================
    if (cargando) {
        return (
            <DashboardLayout>

                <div className="text-center py-5">

                    <div
                        className="spinner-border"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Cargando...
                        </span>
                    </div>

                    <p className="mt-3">
                        Cargando información del trámite...
                    </p>

                </div>

            </DashboardLayout>
        );
    }

    // ==========================================
    // INTERFAZ
    // ==========================================
    return (
        <DashboardLayout>

            <div className="card shadow">

                {/* CABECERA */}
                <div className="card-header bg-warning">

                    <h4 className="mb-0">
                        Editar Trámite
                    </h4>

                </div>

                <div className="card-body">

                    <form
                        onSubmit={actualizarTramite}
                    >

                        <div className="row">

                            {/* NÚMERO DE TRÁMITE */}
                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="num_tramite"
                                    className="form-label"
                                >
                                    Número de trámite
                                </label>

                                <input
                                    id="num_tramite"
                                    type="text"
                                    className="form-control"
                                    name="num_tramite"
                                    value={
                                        formulario.num_tramite
                                    }
                                    onChange={cambiarValor}
                                    required
                                />

                            </div>

                            {/* CLIENTE */}
                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="cliente_id"
                                    className="form-label"
                                >
                                    Cliente
                                </label>

                                <select
                                    id="cliente_id"
                                    className="form-select"
                                    name="cliente_id"
                                    value={
                                        formulario.cliente_id
                                    }
                                    onChange={cambiarValor}
                                    required
                                >

                                    <option value="">
                                        Seleccione un cliente
                                    </option>

                                    {clientes.map(
                                        (cliente) => (

                                            <option
                                                key={cliente.id}
                                                value={cliente.id}
                                            >
                                                {
                                                    cliente.razon_social
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* ESTADO */}
                            <div className="col-md-4 mb-3">

                                <label
                                    htmlFor="status"
                                    className="form-label"
                                >
                                    Estado
                                </label>

                                <select
                                    id="status"
                                    className="form-select"
                                    name="status"
                                    value={
                                        formulario.status
                                    }
                                    onChange={cambiarValor}
                                    required
                                >

                                    <option value="PENDIENTE">
                                        Pendiente
                                    </option>

                                    <option value="EN PROCESO">
                                        En proceso
                                    </option>

                                    <option value="OTORGADO">
                                        Otorgado
                                    </option>

                                    <option value="RECHAZADO">
                                        Rechazado
                                    </option>

                                    <option value="ARCHIVADO">
                                        Archivado
                                    </option>

                                </select>

                            </div>

                            {/* FECHA */}
                            <div className="col-md-4 mb-3">

                                <label
                                    htmlFor="fecha_tramite"
                                    className="form-label"
                                >
                                    Fecha del trámite
                                </label>

                                <input
                                    id="fecha_tramite"
                                    type="date"
                                    className="form-control"
                                    name="fecha_tramite"
                                    value={
                                        formulario.fecha_tramite
                                    }
                                    onChange={cambiarValor}
                                    required
                                />

                            </div>

                            {/* CATEGORÍA */}
                            <div className="col-md-4 mb-3">

                                <label
                                    htmlFor="categoria"
                                    className="form-label"
                                >
                                    Categoría
                                </label>

                                <input
                                    id="categoria"
                                    type="text"
                                    className="form-control"
                                    name="categoria"
                                    value={
                                        formulario.categoria
                                    }
                                    onChange={cambiarValor}
                                    placeholder="Ingrese la categoría"
                                />

                            </div>

                            {/* TIPO DE TRÁMITE */}
                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="tipo_tramite"
                                    className="form-label"
                                >
                                    Tipo de trámite
                                </label>

                                <input
                                    id="tipo_tramite"
                                    type="text"
                                    className="form-control"
                                    name="tipo_tramite"
                                    value={
                                        formulario.tipo_tramite
                                    }
                                    onChange={cambiarValor}
                                    placeholder="Ingrese el tipo de trámite"
                                    required
                                />

                            </div>

                            {/* REFERENCIA */}
                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="referencia"
                                    className="form-label"
                                >
                                    Referencia
                                </label>

                                <input
                                    id="referencia"
                                    type="text"
                                    className="form-control"
                                    name="referencia"
                                    value={
                                        formulario.referencia
                                    }
                                    onChange={cambiarValor}
                                    placeholder="Ingrese una referencia"
                                />

                            </div>

                            {/* OBSERVACIÓN */}
                            <div className="col-12 mb-3">

                                <label
                                    htmlFor="observacion"
                                    className="form-label"
                                >
                                    Observación
                                </label>

                                <textarea
                                    id="observacion"
                                    className="form-control"
                                    rows="4"
                                    name="observacion"
                                    value={
                                        formulario.observacion
                                    }
                                    onChange={cambiarValor}
                                    placeholder="Ingrese una observación"
                                />

                            </div>

                        </div>

                        {/* ACTUALIZAR */}
                        <button
                            type="submit"
                            className="btn btn-warning me-2"
                            disabled={guardando}
                        >
                            {guardando
                                ? "Actualizando..."
                                : "Actualizar Trámite"}
                        </button>

                        {/* CANCELAR */}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate("/tramites")
                            }
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

export default EditarTramite;