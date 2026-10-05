import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function NuevoCliente() {
    const navigate = useNavigate();

    const [guardando, setGuardando] = useState(false);

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
    // CAMBIAR VALORES DEL FORMULARIO
    // ==========================================
    const cambiarValor = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value,
        });
    };

    // ==========================================
    // GUARDAR CLIENTE
    // ==========================================
    const guardarCliente = async (e) => {
        e.preventDefault();

        // Validar razón social
        if (!formulario.razon_social.trim()) {
            Swal.fire(
                "Campo obligatorio",
                "Ingrese la razón social.",
                "warning"
            );
            return;
        }

        // Validar RUC
        if (!formulario.ruc.trim()) {
            Swal.fire(
                "Campo obligatorio",
                "Ingrese el RUC.",
                "warning"
            );
            return;
        }

        try {
            setGuardando(true);

            const datos = {
                razon_social:
                    formulario.razon_social.trim(),

                iniciales:
                    formulario.iniciales.trim(),

                nombre_comercial:
                    formulario.nombre_comercial.trim(),

                // En PostgreSQL la columna se llama ruc_ced
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
                "CLIENTE ENVIADO:",
                datos
            );

            await api.post(
                "/clientes",
                datos
            );

            await Swal.fire(
                "Correcto",
                "Cliente registrado correctamente.",
                "success"
            );

            navigate("/clientes");

        } catch (error) {
            console.error(
                "ERROR AL CREAR CLIENTE:",
                error.response?.data ||
                    error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.mensaje ||
                    "No se pudo registrar el cliente.",
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
                    <h4 className="mb-0">
                        Nuevo Cliente
                    </h4>
                </div>

                <div className="card-body">

                    <form onSubmit={guardarCliente}>

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
                                    placeholder="Ingrese la razón social"
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
                                    placeholder="Ingrese las iniciales"
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
                                    placeholder="Ingrese el nombre comercial"
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
                                    value={
                                        formulario.ruc
                                    }
                                    onChange={cambiarValor}
                                    placeholder="Ingrese el RUC"
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
                                    placeholder="Ingrese el representante legal"
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
                                    placeholder="Ingrese el correo"
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
                                    placeholder="Ingrese el teléfono"
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

                        {/* BOTÓN GUARDAR */}
                        <button
                            type="submit"
                            className="btn btn-success me-2"
                            disabled={guardando}
                        >
                            {guardando
                                ? "Guardando..."
                                : "Guardar Cliente"}
                        </button>

                        {/* BOTÓN CANCELAR */}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate("/clientes")
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

export default NuevoCliente;