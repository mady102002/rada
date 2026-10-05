import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function NuevoTramite() {
    const navigate = useNavigate();

    const [clientes, setClientes] = useState([]);

    const [guardando, setGuardando] =
        useState(false);

    const [cargandoClientes, setCargandoClientes] =
        useState(true);

    // ==========================================
    // FORMULARIO
    // ==========================================

    const [formulario, setFormulario] = useState({
        num_tramite: "",
        cliente_id: "",

        // IMPORTANTE:
        // debe coincidir exactamente con el ENUM de PostgreSQL
        status: "PENDIENTE",

        fecha_tramite: "",
        tipo_tramite: "",
        categoria: "",
        referencia: "",
        observacion: "",
    });

    // ==========================================
    // CARGAR CLIENTES
    // ==========================================

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = async () => {
        try {
            setCargandoClientes(true);

            const respuesta =
                await api.get("/clientes");

            setClientes(
                Array.isArray(respuesta.data)
                    ? respuesta.data
                    : []
            );

        } catch (error) {
            console.error(
                "ERROR AL CARGAR CLIENTES:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudieron cargar los clientes.",
                "error"
            );

        } finally {
            setCargandoClientes(false);
        }
    };

    // ==========================================
    // CAMBIAR VALOR DEL FORMULARIO
    // ==========================================

    const cambiarValor = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]:
                e.target.value,
        });
    };

    // ==========================================
    // GUARDAR TRÁMITE
    // ==========================================

    const guardarTramite = async (e) => {
        e.preventDefault();

        // Número de trámite
        if (
            !formulario.num_tramite.trim()
        ) {
            Swal.fire(
                "Campo obligatorio",
                "Ingrese el número del trámite.",
                "warning"
            );

            return;
        }

        // Cliente
        if (!formulario.cliente_id) {
            Swal.fire(
                "Campo obligatorio",
                "Seleccione un cliente.",
                "warning"
            );

            return;
        }

        // Estado
        if (!formulario.status) {
            Swal.fire(
                "Campo obligatorio",
                "Seleccione el estado del trámite.",
                "warning"
            );

            return;
        }

        // Fecha
        if (!formulario.fecha_tramite) {
            Swal.fire(
                "Campo obligatorio",
                "Seleccione la fecha del trámite.",
                "warning"
            );

            return;
        }

        // Tipo
        if (
            !formulario.tipo_tramite.trim()
        ) {
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
                    Number(
                        formulario.cliente_id
                    ),

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
                "DATOS TRÁMITE:",
                datos
            );

            await api.post(
                "/tramites",
                datos
            );

            await Swal.fire(
                "Correcto",
                "Trámite registrado correctamente.",
                "success"
            );

            navigate("/tramites");

        } catch (error) {
            console.error(
                "ERROR AL CREAR TRÁMITE:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo registrar el trámite.",
                "error"
            );

        } finally {
            setGuardando(false);
        }
    };

    // ==========================================
    // INTERFAZ
    // ==========================================

    return (
        <DashboardLayout>

            <div className="card shadow">

                {/* CABECERA */}
                <div className="card-header bg-primary text-white">

                    <h4 className="mb-0">
                        Nuevo Trámite
                    </h4>

                </div>

                <div className="card-body">

                    <form onSubmit={guardarTramite}>

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
                                    onChange={
                                        cambiarValor
                                    }
                                    placeholder="Ejemplo: TRM-2026-001"
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
                                    onChange={
                                        cambiarValor
                                    }
                                    disabled={
                                        cargandoClientes
                                    }
                                    required
                                >

                                    <option value="">
                                        {cargandoClientes
                                            ? "Cargando clientes..."
                                            : "Seleccione un cliente"}
                                    </option>

                                    {clientes.map(
                                        (cliente) => (

                                            <option
                                                key={
                                                    cliente.id
                                                }
                                                value={
                                                    cliente.id
                                                }
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
                                    onChange={
                                        cambiarValor
                                    }
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
                                    onChange={
                                        cambiarValor
                                    }
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
                                    onChange={
                                        cambiarValor
                                    }
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
                                    onChange={
                                        cambiarValor
                                    }
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
                                    onChange={
                                        cambiarValor
                                    }
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
                                    onChange={
                                        cambiarValor
                                    }
                                    placeholder="Ingrese una observación"
                                />

                            </div>

                        </div>

                        {/* BOTÓN GUARDAR */}
                        <button
                            type="submit"
                            className="btn btn-success me-2"
                            disabled={
                                guardando
                            }
                        >
                            {guardando
                                ? "Guardando..."
                                : "Guardar Trámite"}
                        </button>

                        {/* BOTÓN CANCELAR */}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate(
                                    "/tramites"
                                )
                            }
                            disabled={
                                guardando
                            }
                        >
                            Cancelar
                        </button>

                    </form>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default NuevoTramite;