function Buscador({
    label = "Buscar",
    placeholder = "Escriba para buscar...",
    value,
    onChange
}) {
    return (
        <div className="card shadow mb-4">
            <div className="card-body">

                <label className="form-label">
                    {label}
                </label>

                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />

            </div>
        </div>
    );
}

export default Buscador;