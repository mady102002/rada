import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function EditarCliente() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState(false);

    const [formulario, setFormulario] = useState({
        razon_social: "",
        iniciales: "",
        nombre_comercial: "",
        ruc: "",
        representante_legal: "",
        correo: "",
        telefono: "",
        estado: "Activo",
    });

    // ==========================================
    // CARGAR CLIENTE
    // ==========================================
    useEffect(() => {
        cargarCliente();
    }, [id]);

    const cargarCliente = async () => {
        try {
            setCargando(true);

            const respuesta =
                await api.get(`/clientes/${id}`);

            const cliente = respuesta.data;

            console.log(
                "CLIENTE CARGADO:",
                cliente
            );

            setFormulario({
                razon_social:
                    cliente.razon_social || "",

                iniciales:
                    cliente.iniciales || "",

                nombre_comercial:
                    cliente.nombre_comercial || "",

                ruc:
                    cliente.ruc_ced || "",

                representante_legal:
                    cliente.representante_legal || "",

                correo:
                    cliente.email || "",

                telefono:
                    cliente.telefono || "",

                estado:
                    cliente.estado || "Activo",
            });

        } catch (error) {
            console.error(
                "ERROR AL CARGAR CLIENTE:",
                error.response?.data ||
                    error.message
            );

            await Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo cargar el cliente.",
                "error"
            );

            navigate("/clientes");

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
    // ACTUALIZAR CLIENTE
    // ==========================================
    const actualizarCliente = async (e) => {
        e.preventDefault();

        if (!formulario.razon_social.trim()) {
            Swal.fire(
                "Campo obligatorio",
                "Ingrese la razón social.",
                "warning"
            );

            return;
        }

        if (!formulario.ruc.trim()) {
            Swal.fire(
                "Campo obligatorio",
                "Ingrese el RUC.",
                "warning"
            );

            return;
        }

        try {
            setActualizando(true);

            const datos = {
                razon_social:
                    formulario.razon_social.trim(),

                iniciales:
                    formulario.iniciales.trim(),

                nombre_comercial:
                    formulario.nombre_comercial.trim(),

                ruc_ced:
                    formulario.ruc.trim(),

                representante_legal:
                    formulario.representante_legal.trim(),

                correo:
                    formulario.correo.trim(),

                telefono:
                    formulario.telefono.trim(),

                estado:
                    formulario.estado,
            };

            console.log(
                "CLIENTE ACTUALIZADO:",
                datos
            );

            await api.put(
                `/clientes/${id}`,
                datos
            );

            await Swal.fire(
                "Correcto",
                "Cliente actualizado correctamente.",
                "success"
            );

            navigate("/clientes");

        } catch (error) {
            console.error(
                "ERROR AL ACTUALIZAR CLIENTE:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo actualizar el cliente.",
                "error"
            );

        } finally {
            setActualizando(false);
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
                        Cargando cliente...
                    </p>

                </div>

            </DashboardLayout>
        );
    }

    // ==========================================
    // FORMULARIO
    // ==========================================
    return (
        <DashboardLayout>

            <div className="card shadow">

                <div className="card-header bg-warning text-dark">

                    <h4 className="mb-0">
                        Editar Cliente
                    </h4>

                </div>

                <div className="card-body">

                    <form
                        onSubmit={actualizarCliente}
                    >

                        <div className="row">

                            {/* RAZÓN SOCIAL */}
                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="razon_social"
                                    className="form-label"
                                >
                                    Razón social
                                </label>

                                <input
                                    id="razon_social"
                                    type="text"
                                    className="form-control"
                                    name="razon_social"
                                    value={
                                        formulario.razon_social
                                    }
                                    onChange={cambiarValor}
                                    required
                                />

                            </div>

                            {/* INICIALES */}
                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="iniciales"
                                    className="form-label"
                                >
                                    Iniciales
                                </label>

                                <input
                                    id="iniciales"
                                    type="text"
                                    className="form-control"
                                    name="iniciales"
                                    value={
                                        formulario.iniciales
                                    }
                                    onChange={cambiarValor}
                                />

                            </div>

                            {/* NOMBRE COMERCIAL */}
                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="nombre_comercial"
                                    className="form-label"
                                >
                                    Nombre comercial
                                </label>

                                <input
                                    id="nombre_comercial"
                                    type="text"
                                    className="form-control"
                                    name="nombre_comercial"
                                    value={
                                        formulario.nombre_comercial
                                    }
                                    onChange={cambiarValor}
                                />

                            </div>

                            {/* RUC */}
                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="ruc"
                                    className="form-label"
                                >
                                    RUC
                                </label>

                                <input
                                    id="ruc"
                                    type="text"
                                    className="form-control"
                                    name="ruc"
                                    value={formulario.ruc}
                                    onChange={cambiarValor}
                                    required
                                />

                            </div>

                            {/* REPRESENTANTE LEGAL */}
                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="representante_legal"
                                    className="form-label"
                                >
                                    Representante legal
                                </label>

                                <input
                                    id="representante_legal"
                                    type="text"
                                    className="form-control"
                                    name="representante_legal"
                                    value={
                                        formulario.representante_legal
                                    }
                                    onChange={cambiarValor}
                                />

                            </div>

                            {/* CORREO */}
                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="correo"
                                    className="form-label"
                                >
                                    Correo
                                </label>

                                <input
                                    id="correo"
                                    type="email"
                                    className="form-control"
                                    name="correo"
                                    value={
                                        formulario.correo
                                    }
                                    onChange={cambiarValor}
                                />

                            </div>

                            {/* TELÉFONO */}
                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="telefono"
                                    className="form-label"
                                >
                                    Teléfono
                                </label>

                                <input
                                    id="telefono"
                                    type="text"
                                    className="form-control"
                                    name="telefono"
                                    value={
                                        formulario.telefono
                                    }
                                    onChange={cambiarValor}
                                />

                            </div>

                            {/* ESTADO */}
                            <div className="col-md-6 mb-3">

                                <label
                                    htmlFor="estado"
                                    className="form-label"
                                >
                                    Estado
                                </label>

                                <select
                                    id="estado"
                                    className="form-select"
                                    name="estado"
                                    value={
                                        formulario.estado
                                    }
                                    onChange={cambiarValor}
                                >

                                    <option value="Activo">
                                        Activo
                                    </option>

                                    <option value="Inactivo">
                                        Inactivo
                                    </option>

                                </select>

                            </div>

                        </div>

                        {/* ACTUALIZAR */}
                        <button
                            type="submit"
                            className="btn btn-warning me-2"
                            disabled={actualizando}
                        >
                            {actualizando
                                ? "Actualizando..."
                                : "Actualizar Cliente"}
                        </button>

                        {/* CANCELAR */}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate("/clientes")
                            }
                            disabled={actualizando}
                        >
                            Cancelar
                        </button>

                    </form>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default EditarCliente;