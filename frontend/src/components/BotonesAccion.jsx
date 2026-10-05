import { Link } from "react-router-dom";

function BotonesAccion({
    editar,
    eliminar
}) {

    return (

        <>
            <Link
                to={editar}
                className="btn btn-warning btn-sm me-2"
            >
                Editar
            </Link>

            <button
                className="btn btn-danger btn-sm"
                onClick={eliminar}
            >
                Eliminar
            </button>
        </>

    );

}

export default BotonesAccion;