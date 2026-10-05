const pool = require("../config/db");

// ==========================================
// OBTENER TODOS LOS CLIENTES
// ==========================================
const obtenerClientes = async () => {

    const resultado = await pool.query(`
        SELECT
            c.*,
            cc.telefono,
            cc.email,
            ce.status_gfc AS estado

        FROM rada.clientes c

        LEFT JOIN rada.clientes_contacto cc
            ON cc.cliente_id = c.id

        LEFT JOIN rada.clientes_estados ce
            ON ce.cliente_id = c.id

        ORDER BY c.id ASC
    `);

    return resultado.rows;
};


// ==========================================
// OBTENER CLIENTE POR ID
// ==========================================
const obtenerClientePorId = async (id) => {

    const resultado = await pool.query(
        `
        SELECT
            c.*,
            cc.telefono,
            cc.email,
            ce.status_gfc AS estado

        FROM rada.clientes c

        LEFT JOIN rada.clientes_contacto cc
            ON cc.cliente_id = c.id

        LEFT JOIN rada.clientes_estados ce
            ON ce.cliente_id = c.id

        WHERE c.id = $1
        `,
        [id]
    );

    return resultado.rows[0];
};


// ==========================================
// CREAR CLIENTE
// ==========================================
const crearCliente = async (cliente) => {

    const conexion = await pool.connect();

    try {

        await conexion.query("BEGIN");

        const {
            razon_social,
            iniciales,
            nombre_comercial,
            ruc_ced,
            representante_legal,
            correo,
            telefono,
            estado
        } = cliente;


        // ======================================
        // 1. GUARDAR DATOS PRINCIPALES
        // ======================================
        const resultadoCliente =
            await conexion.query(
                `
                INSERT INTO rada.clientes
                (
                    razon_social,
                    iniciales,
                    nombre_comercial,
                    ruc_ced,
                    representante_legal
                )

                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                )

                RETURNING *
                `,
                [
                    razon_social,
                    iniciales || null,
                    nombre_comercial || null,
                    ruc_ced,
                    representante_legal || null
                ]
            );


        const nuevoCliente =
            resultadoCliente.rows[0];


        // ======================================
        // 2. GUARDAR CORREO Y TELÉFONO
        // ======================================
        await conexion.query(
            `
            INSERT INTO rada.clientes_contacto
            (
                cliente_id,
                telefono,
                email
            )

            VALUES (
                $1,
                $2,
                $3
            )
            `,
            [
                nuevoCliente.id,
                telefono || null,
                correo || null
            ]
        );


        // ======================================
        // 3. GUARDAR ESTADO
        // ======================================
        await conexion.query(
            `
            INSERT INTO rada.clientes_estados
            (
                cliente_id,
                status_gfc
            )

            VALUES (
                $1,
                $2
            )
            `,
            [
                nuevoCliente.id,
                estado || "Activo"
            ]
        );


        // ======================================
        // CONFIRMAR TRANSACCIÓN
        // ======================================
        await conexion.query("COMMIT");


        return {
            ...nuevoCliente,

            telefono:
                telefono || null,

            email:
                correo || null,

            estado:
                estado || "Activo"
        };


    } catch (error) {

        await conexion.query("ROLLBACK");

        throw error;

    } finally {

        conexion.release();

    }
};


// ==========================================
// ACTUALIZAR CLIENTE
// ==========================================
const actualizarCliente = async (
    id,
    cliente
) => {

    const conexion = await pool.connect();

    try {

        await conexion.query("BEGIN");

        const {
            razon_social,
            iniciales,
            nombre_comercial,
            ruc_ced,
            representante_legal,
            correo,
            telefono,
            estado
        } = cliente;


        // ======================================
        // 1. ACTUALIZAR DATOS PRINCIPALES
        // ======================================
        const resultado =
            await conexion.query(
                `
                UPDATE rada.clientes

                SET
                    razon_social = $1,
                    iniciales = $2,
                    nombre_comercial = $3,
                    ruc_ced = $4,
                    representante_legal = $5

                WHERE id = $6

                RETURNING *
                `,
                [
                    razon_social,
                    iniciales || null,
                    nombre_comercial || null,
                    ruc_ced,
                    representante_legal || null,
                    id
                ]
            );


        if (resultado.rows.length === 0) {

            await conexion.query(
                "ROLLBACK"
            );

            return null;
        }


        // ======================================
        // 2. ACTUALIZAR CONTACTO
        // ======================================
        const contacto =
            await conexion.query(
                `
                SELECT id

                FROM rada.clientes_contacto

                WHERE cliente_id = $1
                `,
                [id]
            );


        if (contacto.rows.length > 0) {

            await conexion.query(
                `
                UPDATE rada.clientes_contacto

                SET
                    telefono = $1,
                    email = $2

                WHERE cliente_id = $3
                `,
                [
                    telefono || null,
                    correo || null,
                    id
                ]
            );

        } else {

            await conexion.query(
                `
                INSERT INTO rada.clientes_contacto
                (
                    cliente_id,
                    telefono,
                    email
                )

                VALUES (
                    $1,
                    $2,
                    $3
                )
                `,
                [
                    id,
                    telefono || null,
                    correo || null
                ]
            );

        }


        // ======================================
        // 3. ACTUALIZAR ESTADO
        // ======================================
        const estadoExistente =
            await conexion.query(
                `
                SELECT id

                FROM rada.clientes_estados

                WHERE cliente_id = $1
                `,
                [id]
            );


        if (
            estadoExistente.rows.length > 0
        ) {

            await conexion.query(
                `
                UPDATE rada.clientes_estados

                SET status_gfc = $1

                WHERE cliente_id = $2
                `,
                [
                    estado || "Activo",
                    id
                ]
            );

        } else {

            await conexion.query(
                `
                INSERT INTO rada.clientes_estados
                (
                    cliente_id,
                    status_gfc
                )

                VALUES (
                    $1,
                    $2
                )
                `,
                [
                    id,
                    estado || "Activo"
                ]
            );

        }


        // ======================================
        // CONFIRMAR CAMBIOS
        // ======================================
        await conexion.query("COMMIT");


        return {
            ...resultado.rows[0],

            telefono:
                telefono || null,

            email:
                correo || null,

            estado:
                estado || "Activo"
        };


    } catch (error) {

        await conexion.query(
            "ROLLBACK"
        );

        throw error;

    } finally {

        conexion.release();

    }
};


// ==========================================
// ELIMINAR CLIENTE
// ==========================================
const eliminarCliente = async (id) => {

    const conexion = await pool.connect();

    try {

        await conexion.query("BEGIN");


        // Eliminar contacto
        await conexion.query(
            `
            DELETE FROM rada.clientes_contacto
            WHERE cliente_id = $1
            `,
            [id]
        );


        // Eliminar estado
        await conexion.query(
            `
            DELETE FROM rada.clientes_estados
            WHERE cliente_id = $1
            `,
            [id]
        );


        // Eliminar cliente
        const resultado =
            await conexion.query(
                `
                DELETE FROM rada.clientes

                WHERE id = $1

                RETURNING *
                `,
                [id]
            );


        await conexion.query("COMMIT");


        return resultado.rows[0];


    } catch (error) {

        await conexion.query(
            "ROLLBACK"
        );

        throw error;

    } finally {

        conexion.release();

    }
};


// ==========================================
// EXPORTAR FUNCIONES
// ==========================================
module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};