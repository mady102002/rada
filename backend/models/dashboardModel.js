const pool = require("../config/db");

// ==========================================
// TOTAL CLIENTES
// ==========================================
const totalClientes = async () => {
    const resultado = await pool.query(`
        SELECT COUNT(*) AS total
        FROM rada.clientes
    `);

    return Number(
        resultado.rows[0].total
    );
};

// ==========================================
// TOTAL USUARIOS
// ==========================================
const totalUsuarios = async () => {
    const resultado = await pool.query(`
        SELECT COUNT(*) AS total
        FROM rada.usuarios
    `);

    return Number(
        resultado.rows[0].total
    );
};

// ==========================================
// TOTAL TRÁMITES
// ==========================================
const totalTramites = async () => {
    const resultado = await pool.query(`
        SELECT COUNT(*) AS total
        FROM rada.tramites
    `);

    return Number(
        resultado.rows[0].total
    );
};

// ==========================================
// TOTAL PAGOS
// ==========================================
const totalPagos = async () => {
    const resultado = await pool.query(`
        SELECT
            (
                (SELECT COUNT(*) FROM rada.pagos_dc)
                +
                (SELECT COUNT(*) FROM rada.pagos_su)
            ) AS total
    `);

    return Number(
        resultado.rows[0].total
    );
};

// ==========================================
// TOTAL PAGOS DC
// ==========================================
const totalPagosDc = async () => {
    const resultado = await pool.query(`
        SELECT COUNT(*) AS total
        FROM rada.pagos_dc
    `);

    return Number(
        resultado.rows[0].total
    );
};

// ==========================================
// TOTAL PAGOS SU
// ==========================================
const totalPagosSu = async () => {
    const resultado = await pool.query(`
        SELECT COUNT(*) AS total
        FROM rada.pagos_su
    `);

    return Number(
        resultado.rows[0].total
    );
};

// ==========================================
// TRÁMITES POR ESTADO
// ==========================================
const tramitesPorEstado = async () => {
    const resultado = await pool.query(`
        SELECT
            status,
            COUNT(*) AS total
        FROM rada.tramites
        GROUP BY status
        ORDER BY status
    `);

    return resultado.rows.map(
        (fila) => ({
            estado: fila.status,
            total: Number(
                fila.total
            ),
        })
    );
};

// ==========================================
// PAGOS POR ESTADO
// ==========================================
const pagosPorEstado = async () => {
    const resultado = await pool.query(`
        SELECT
            estado,
            SUM(total) AS total
        FROM (
            SELECT
                estado,
                COUNT(*) AS total
            FROM rada.pagos_dc
            GROUP BY estado

            UNION ALL

            SELECT
                estado,
                COUNT(*) AS total
            FROM rada.pagos_su
            GROUP BY estado
        ) datos

        GROUP BY estado
        ORDER BY estado
    `);

    return resultado.rows.map(
        (fila) => ({
            estado:
                fila.estado,

            total:
                Number(
                    fila.total
                ),
        })
    );
};

// ==========================================
// PAGOS PENDIENTES
// ==========================================
const pagosPendientes = async () => {
    const resultado = await pool.query(`
        SELECT
            'DC' AS tipo,
            p.id,
            p.cliente_id,
            c.razon_social,
            p.anio,
            p.mes,
            p.valor,
            p.estado
        FROM rada.pagos_dc p

        INNER JOIN rada.clientes c
            ON c.id = p.cliente_id

        WHERE p.estado = 'NO'

        UNION ALL

        SELECT
            'SU' AS tipo,
            p.id,
            p.cliente_id,
            c.razon_social,
            p.anio,
            p.mes,
            p.valor,
            p.estado
        FROM rada.pagos_su p

        INNER JOIN rada.clientes c
            ON c.id = p.cliente_id

        WHERE p.estado = 'NO'

        ORDER BY anio DESC, mes DESC
        LIMIT 10
    `);

    return resultado.rows;
};

// ==========================================
// LICENCIAS POR VENCER
// ==========================================
const licenciasPorVencer = async () => {
    const resultado = await pool.query(`
        SELECT
            l.id,
            l.cliente_id,
            c.razon_social,
            l.n_licencia,
            l.f_licencia,
            l.f_max_licencia,

            (
                l.f_max_licencia -
                CURRENT_DATE
            ) AS dias_restantes

        FROM rada.clientes_licencias l

        INNER JOIN rada.clientes c
            ON c.id = l.cliente_id

        WHERE
            l.f_max_licencia IS NOT NULL

            AND l.f_max_licencia >= CURRENT_DATE

            AND l.f_max_licencia
                <= CURRENT_DATE
                   + INTERVAL '30 days'

        ORDER BY
            l.f_max_licencia ASC

        LIMIT 10
    `);

    return resultado.rows.map(
        (fila) => ({
            id:
                fila.id,

            cliente_id:
                fila.cliente_id,

            razon_social:
                fila.razon_social,

            n_licencia:
                fila.n_licencia,

            f_licencia:
                fila.f_licencia,

            f_max_licencia:
                fila.f_max_licencia,

            dias_restantes:
                Number(
                    fila.dias_restantes
                ),
        })
    );
};

// ==========================================
// TRÁMITES PENDIENTES
// ==========================================
const tramitesPendientes = async () => {
    const resultado = await pool.query(`
        SELECT
            t.id,
            t.num_tramite,
            t.cliente_id,
            c.razon_social,
            t.status,
            t.fecha_tramite,
            t.tipo_tramite,
            t.categoria,
            t.referencia,
            t.observacion

        FROM rada.tramites t

        INNER JOIN rada.clientes c
            ON c.id = t.cliente_id

        WHERE t.status IN (
            'PENDIENTE',
            'EN PROCESO'
        )

        ORDER BY
            t.fecha_tramite ASC

        LIMIT 10
    `);

    return resultado.rows;
};

// ==========================================
// EXPORTAR FUNCIONES
// ==========================================
module.exports = {
    totalClientes,
    totalUsuarios,
    totalTramites,
    totalPagos,
    totalPagosDc,
    totalPagosSu,
    tramitesPorEstado,
    pagosPorEstado,
    pagosPendientes,
    licenciasPorVencer,
    tramitesPendientes,
};