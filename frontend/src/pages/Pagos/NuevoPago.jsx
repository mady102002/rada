import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import Swal from "sweetalert2";

function NuevoPago() {
    const navigate = useNavigate();

    const [clientes, setClientes] = useState([]);
    const [cargandoClientes, setCargandoClientes] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [tipoPago, setTipoPago] = useState("DC");

    const [formulario, setFormulario] = useState({
        cliente_id: "",
        anio: new Date().getFullYear(),
        semestre: "S1",
        trimestre: "T1",
        mes: "",
        estado: "NO",
        valor: "",
        fecha_pago: "",
        observacion: "",
    });

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = async () => {
        try {
            setCargandoClientes(true);

            const respuesta = await api.get("/clientes");

            setClientes(
                Array.isArray(respuesta.data)
                    ? respuesta.data
                    : []
            );
        } catch (error) {
            console.error(
                "ERROR AL CARGAR CLIENTES:",
                error.response?.data || error.message
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value,
        });
    };

    const cambiarTipoPago = (e) => {
        const nuevoTipo = e.target.value;

        setTipoPago(nuevoTipo);

        setFormulario((anterior) => ({
            ...anterior,
            semestre: "S1",
            trimestre: "T1",
        }));
    };

    const guardarPago = async (e) => {
        e.preventDefault();

        if (!formulario.cliente_id) {
            Swal.fire(
                "Campo obligatorio",
                "Seleccione un cliente.",
                "warning"
            );
            return;
        }

        if (!formulario.anio) {
            Swal.fire(
                "Campo obligatorio",
                "Ingrese el año.",
                "warning"
            );
            return;
        }

        if (!formulario.mes) {
            Swal.fire(
                "Campo obligatorio",
                "Seleccione el mes.",
                "warning"
            );
            return;
        }

        if (
            formulario.valor === "" ||
            Number(formulario.valor) < 0
        ) {
            Swal.fire(
                "Valor incorrecto",
                "Ingrese un valor válido.",
                "warning"
            );
            return;
        }

        if (
            formulario.estado === "SI" &&
            !formulario.fecha_pago
        ) {
            Swal.fire(
                "Fecha obligatoria",
                "Si el pago está marcado como pagado, debe ingresar la fecha de pago.",
                "warning"
            );
            return;
        }

        try {
            setGuardando(true);

            let endpoint;
            let datos;

            if (tipoPago === "DC") {
                endpoint = "/pagos-dc";

                datos = {
                    cliente_id: Number(formulario.cliente_id),
                    anio: Number(formulario.anio),
                    semestre: formulario.semestre,
                    mes: Number(formulario.mes),
                    estado: formulario.estado,
                    valor: Number(formulario.valor),
                    fecha_pago:
                        formulario.estado === "SI"
                            ? formulario.fecha_pago
                            : null,
                    observacion:
                        formulario.observacion.trim() || null,
                };
            } else {
                endpoint = "/pagos-su";

                datos = {
                    cliente_id: Number(formulario.cliente_id),
                    anio: Number(formulario.anio),
                    trimestre: formulario.trimestre,
                    mes: Number(formulario.mes),
                    estado: formulario.estado,
                    valor: Number(formulario.valor),
                    fecha_pago:
                        formulario.estado === "SI"
                            ? formulario.fecha_pago
                            : null,
                    observacion:
                        formulario.observacion.trim() || null,
                };
            }

            console.log("DATOS ENVIADOS:", datos);

            await api.post(endpoint, datos);

            await Swal.fire(
                "Correcto",
                `Pago ${tipoPago} registrado correctamente.`,
                "success"
            );

            navigate("/pagos");
        } catch (error) {
            console.error(
                "ERROR AL CREAR PAGO:",
                error.response?.data || error.message
            );

            Swal.fire(
                "Error",
                error.response?.data?.error ||
                    error.response?.data?.mensaje ||
                    "No se pudo registrar el pago.",
                "error"
            );
        } finally {
            setGuardando(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="container-fluid">

                <div className="card shadow-sm">

                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0">
                            Registrar nuevo pago
                        </h4>
                    </div>

                    <div className="card-body">

                        <form onSubmit={guardarPago}>

                            <div className="row">

                                {/* TIPO DE PAGO */}
                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Tipo de pago
                                    </label>

                                    <select
                                        className="form-select"
                                        value={tipoPago}
                                        onChange={cambiarTipoPago}
                                    >
                                        <option value="DC">
                                            Pago DC
                                        </option>

                                        <option value="SU">
                                            Pago SU
                                        </option>
                                    </select>

                                </div>

                                {/* CLIENTE */}
                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Cliente
                                    </label>

                                    <select
                                        name="cliente_id"
                                        className="form-select"
                                        value={formulario.cliente_id}
                                        onChange={handleChange}
                                        disabled={cargandoClientes}
                                        required
                                    >
                                        <option value="">
                                            {cargandoClientes
                                                ? "Cargando clientes..."
                                                : "Seleccione un cliente"}
                                        </option>

                                        {clientes.map((cliente) => (
                                            <option
                                                key={cliente.id}
                                                value={cliente.id}
                                            >
                                                {cliente.razon_social ||
                                                    cliente.nombre_comercial ||
                                                    `Cliente ${cliente.id}`}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                {/* AÑO */}
                                <div className="col-md-4 mb-3">

                                    <label className="form-label">
                                        Año
                                    </label>

                                    <input
                                        type="number"
                                        name="anio"
                                        className="form-control"
                                        value={formulario.anio}
                                        onChange={handleChange}
                                        min="2000"
                                        max="2100"
                                        required
                                    />

                                </div>

                                {/* SEMESTRE */}
                                {tipoPago === "DC" ? (

                                    <div className="col-md-4 mb-3">

                                        <label className="form-label">
                                            Semestre
                                        </label>

                                        <select
                                            name="semestre"
                                            className="form-select"
                                            value={formulario.semestre}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="S1">
                                                Primer semestre
                                            </option>

                                            <option value="S2">
                                                Segundo semestre
                                            </option>
                                        </select>

                                    </div>

                                ) : (

                                    /* TRIMESTRE */
                                    <div className="col-md-4 mb-3">

                                        <label className="form-label">
                                            Trimestre
                                        </label>

                                        <select
                                            name="trimestre"
                                            className="form-select"
                                            value={formulario.trimestre}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="T1">
                                                Primer trimestre
                                            </option>

                                            <option value="T2">
                                                Segundo trimestre
                                            </option>

                                            <option value="T3">
                                                Tercer trimestre
                                            </option>

                                            <option value="T4">
                                                Cuarto trimestre
                                            </option>
                                        </select>

                                    </div>
                                )}

                                {/* MES */}
                                <div className="col-md-4 mb-3">

                                    <label className="form-label">
                                        Mes
                                    </label>

                                    <select
                                        name="mes"
                                        className="form-select"
                                        value={formulario.mes}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Seleccione el mes
                                        </option>

                                        <option value="1">Enero</option>
                                        <option value="2">Febrero</option>
                                        <option value="3">Marzo</option>
                                        <option value="4">Abril</option>
                                        <option value="5">Mayo</option>
                                        <option value="6">Junio</option>
                                        <option value="7">Julio</option>
                                        <option value="8">Agosto</option>
                                        <option value="9">Septiembre</option>
                                        <option value="10">Octubre</option>
                                        <option value="11">Noviembre</option>
                                        <option value="12">Diciembre</option>

                                    </select>

                                </div>

                                {/* ESTADO */}
                                <div className="col-md-4 mb-3">

                                    <label className="form-label">
                                        Estado
                                    </label>

                                    <select
                                        name="estado"
                                        className="form-select"
                                        value={formulario.estado}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="NO">
                                            Pendiente
                                        </option>

                                        <option value="SI">
                                            Pagado
                                        </option>
                                    </select>

                                </div>

                                {/* VALOR */}
                                <div className="col-md-4 mb-3">

                                    <label className="form-label">
                                        Valor
                                    </label>

                                    <input
                                        type="number"
                                        name="valor"
                                        className="form-control"
                                        value={formulario.valor}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        required
                                    />

                                </div>

                                {/* FECHA PAGO */}
                                <div className="col-md-4 mb-3">

                                    <label className="form-label">
                                        Fecha de pago
                                    </label>

                                    <input
                                        type="date"
                                        name="fecha_pago"
                                        className="form-control"
                                        value={formulario.fecha_pago}
                                        onChange={handleChange}
                                        disabled={
                                            formulario.estado === "NO"
                                        }
                                    />

                                </div>

                                {/* OBSERVACION */}
                                <div className="col-12 mb-3">

                                    <label className="form-label">
                                        Observación
                                    </label>

                                    <textarea
                                        name="observacion"
                                        className="form-control"
                                        rows="4"
                                        value={formulario.observacion}
                                        onChange={handleChange}
                                        placeholder="Ingrese una observación"
                                    />

                                </div>

                            </div>

                            <button
                                type="submit"
                                className="btn btn-success me-2"
                                disabled={guardando}
                            >
                                {guardando
                                    ? "Guardando..."
                                    : "Guardar pago"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/pagos")}
                                disabled={guardando}
                            >
                                Cancelar
                            </button>

                        </form>

                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
}

export default NuevoPago;