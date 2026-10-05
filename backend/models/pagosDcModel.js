const pool = require("../config/db");

// Normalizar semestre
const normalizarSemestre = (semestre) => {
    const valor = String(semestre || "")
        .trim()
        .toUpperCase();

    if (valor === "1" || valor === "S1") {
        return "S1";
    }

    if (valor === "2" || valor === "S2") {
        return "S2";
    }

    return valor;
};

// Normalizar estado
const normalizarEstado = (estado) => {
    const valor = String(estado || "")
        .trim()
        .toUpperCase();

    if (
        valor === "SI" ||
        valor === "SÍ" ||
        valor === "PAGADO" ||
        valor === "TRUE"
    ) {
        return "SI";
    }

    if (
        valor === "NO" ||
        valor === "PENDIENTE" ||
        valor === "FALSE"
    ) {
        return "NO";
    }

    return valor;
};

// Obtener todos los pagos DC
const obtenerPagos = async () => {
    const resultado = await pool.query(`
        SELECT
            p.*,
            c.razon_social
        FROM rada.pagos_dc p
        INNER JOIN rada.clientes c
            ON p.cliente_id = c.id
        ORDER BY p.id ASC
    `);

    return resultado.rows;
};

// Obtener pago DC por ID
const obtenerPagoPorId = async (id) => {
    const resultado = await pool.query(
        `
        SELECT
            p.*,
            c.razon_social
        FROM rada.pagos_dc p
        INNER JOIN rada.clientes c
            ON p.cliente_id = c.id
        WHERE p.id = $1
        `,
        [id]
    );

    return resultado.rows[0];
};

// Crear pago DC
const crearPago = async (datos) => {
    const {
        cliente_id,
        anio,
        semestre,
        mes,
        estado,
        valor,
        fecha_pago,
        observacion
    } = datos;

    const semestreFinal =
        normalizarSemestre(semestre);

    const estadoFinal =
        normalizarEstado(estado);

    if (
        semestreFinal !== "S1" &&
        semestreFinal !== "S2"
    ) {
        throw new Error(
            "El semestre debe ser S1 o S2"
        );
    }

    if (
        estadoFinal !== "SI" &&
        estadoFinal !== "NO"
    ) {
        throw new Error(
            "El estado debe ser SI o NO"
        );
    }

    const resultado = await pool.query(
        `
        INSERT INTO rada.pagos_dc
        (
            cliente_id,
            anio,
            semestre,
            mes,
            estado,
            valor,
            fecha_pago,
            observacion
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8
        )
        RETURNING *
        `,
        [
            cliente_id,
            anio,
            semestreFinal,
            mes,
            estadoFinal,
            valor,
            fecha_pago || null,
            observacion || null
        ]
    );

    return resultado.rows[0];
};

// Actualizar pago DC
const actualizarPago = async (id, datos) => {
    const {
        cliente_id,
        anio,
        semestre,
        mes,
        estado,
        valor,
        fecha_pago,
        observacion
    } = datos;

    const semestreFinal =
        normalizarSemestre(semestre);

    const estadoFinal =
        normalizarEstado(estado);

    if (
        semestreFinal !== "S1" &&
        semestreFinal !== "S2"
    ) {
        throw new Error(
            "El semestre debe ser S1 o S2"
        );
    }

    if (
        estadoFinal !== "SI" &&
        estadoFinal !== "NO"
    ) {
        throw new Error(
            "El estado debe ser SI o NO"
        );
    }

    const resultado = await pool.query(
        `
        UPDATE rada.pagos_dc
        SET
            cliente_id = $1,
            anio = $2,
            semestre = $3,
            mes = $4,
            estado = $5,
            valor = $6,
            fecha_pago = $7,
            observacion = $8
        WHERE id = $9
        RETURNING *
        `,
        [
            cliente_id,
            anio,
            semestreFinal,
            mes,
            estadoFinal,
            valor,
            fecha_pago || null,
            observacion || null,
            id
        ]
    );

    return resultado.rows[0];
};

// Eliminar pago DC
const eliminarPago = async (id) => {
    const resultado = await pool.query(
        `
        DELETE FROM rada.pagos_dc
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return resultado.rows[0];
};

module.exports = {
    obtenerPagos,
    obtenerPagoPorId,
    crearPago,
    actualizarPago,
    eliminarPago
};