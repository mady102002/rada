import "./CardResumen.css";

function CardResumen({ titulo, total, color }) {

    return (

        <div className="card-resumen shadow-sm">

            <div className="card-body">

                <h6>{titulo}</h6>

                <h2 style={{ color }}>{total}</h2>

            </div>

        </div>

    );

}

export default CardResumen;