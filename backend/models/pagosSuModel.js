const pool = require("../config/db");

// Normalizar trimestre
const normalizarTrimestre = (trimestre) => {
    const valor = String(trimestre || "")
        .trim()
        .toUpperCase();

    if (valor === "1" || valor === "T1") {
        return "T1";
    }

    if (valor === "2" || valor === "T2") {
        return "T2";
    }

    if (valor === "3" || valor === "T3") {
        return "T3";
    }

    if (valor === "4" || valor === "T4") {
        return "T4";
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

// Obtener todos los pagos SU
const obtenerPagos = async () => {
    const resultado = await pool.query(`
        SELECT
            p.*,
            c.razon_social
        FROM rada.pagos_su p
        INNER JOIN rada.clientes c
            ON p.cliente_id = c.id
        ORDER BY p.id ASC
    `);

    return resultado.rows;
};

// Obtener pago SU por ID
const obtenerPagoPorId = async (id) => {
    const resultado = await pool.query(
        `
        SELECT
            p.*,
            c.razon_social
        FROM rada.pagos_su p
        INNER JOIN rada.clientes c
            ON p.cliente_id = c.id
        WHERE p.id = $1
        `,
        [id]
    );

    return resultado.rows[0];
};

// Crear pago SU
const crearPago = async (datos) => {
    const {
        cliente_id,
        anio,
        trimestre,
        mes,
        estado,
        valor,
        fecha_pago,
        observacion
    } = datos;

    const trimestreFinal =
        normalizarTrimestre(trimestre);

    const estadoFinal =
        normalizarEstado(estado);

    if (
        ![
            "T1",
            "T2",
            "T3",
            "T4"
        ].includes(trimestreFinal)
    ) {
        throw new Error(
            "El trimestre debe ser T1, T2, T3 o T4"
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
        INSERT INTO rada.pagos_su
        (
            cliente_id,
            anio,
            trimestre,
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
            trimestreFinal,
            mes,
            estadoFinal,
            valor,
            fecha_pago || null,
            observacion || null
        ]
    );

    return resultado.rows[0];
};

// Actualizar pago SU
const actualizarPago = async (id, datos) => {
    const {
        cliente_id,
        anio,
        trimestre,
        mes,
        estado,
        valor,
        fecha_pago,
        observacion
    } = datos;

    const trimestreFinal =
        normalizarTrimestre(trimestre);

    const estadoFinal =
        normalizarEstado(estado);

    if (
        ![
            "T1",
            "T2",
            "T3",
            "T4"
        ].includes(trimestreFinal)
    ) {
        throw new Error(
            "El trimestre debe ser T1, T2, T3 o T4"
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
        UPDATE rada.pagos_su
        SET
            cliente_id = $1,
            anio = $2,
            trimestre = $3,
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
            trimestreFinal,
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

// Eliminar pago SU
const eliminarPago = async (id) => {
    const resultado = await pool.query(
        `
        DELETE FROM rada.pagos_su
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