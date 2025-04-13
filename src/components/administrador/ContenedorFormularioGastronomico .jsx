import React, { useState, useEffect } from "react";
import usuariosAxios from "../../config/axios";

const ContenedorFormularioGastronomico = ({ id_evento }) => {
	const [formDataGastro, setFormDataGastro] = useState({
		tipo_evento: "Comida tradicional boliviana",
		platos_tipicos: [""],
		cocineros: [""],
		lugar_preparacion: "",
		abierto_al_publico: true,
		costo_entrada: "",
	});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormDataGastro((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleArrayChange = (index, field, value) => {
		const updatedArray = [...formDataGastro[field]];
		updatedArray[index] = value;
		setFormDataGastro((prev) => ({
			...prev,
			[field]: updatedArray,
		}));
	};

	const handleAddInput = (field) => {
		setFormDataGastro((prev) => ({
			...prev,
			[field]: [...prev[field], ""],
		}));
	};

	const handleRemoveInput = (field, index) => {
		const updatedArray = [...formDataGastro[field]];
		updatedArray.splice(index, 1);
		setFormDataGastro((prev) => ({
			...prev,
			[field]: updatedArray,
		}));
	};

	const handleSubmit = (e) => {
		if (e) e.preventDefault();

		const datosAEnviar = {
			...formDataGastro,
			id_evento,
			platos_tipicos: JSON.stringify(formDataGastro.platos_tipicos),
			cocineros: JSON.stringify(formDataGastro.cocineros),
		};

		usuariosAxios
			.post("/evento-gastronomico", datosAEnviar)
			.then((res) => console.log("Gastronómico registrado", res.data))
			.catch((err) => console.error("Error al registrar", err));
	};

	useEffect(() => {
		if (id_evento) handleSubmit();
	}, [id_evento]);

	return (
		<form onSubmit={handleSubmit}>
			<div className="mb-3">
				<label className="form-label">Tipo de Evento</label>
				<input
					type="text"
					className="form-control"
					name="tipo_evento"
					value={formDataGastro.tipo_evento}
					onChange={handleChange}
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Platos Típicos</label>
				{formDataGastro.platos_tipicos.map((plato, i) => (
					<div key={i} className="input-group mb-2">
						<input
							type="text"
							className="form-control"
							value={plato}
							onChange={(e) =>
								handleArrayChange(i, "platos_tipicos", e.target.value)
							}
						/>
						<button
							type="button"
							className="btn btn-danger"
							onClick={() => handleRemoveInput("platos_tipicos", i)}
						>
							✕
						</button>
					</div>
				))}
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() => handleAddInput("platos_tipicos")}
				>
					Agregar Plato
				</button>
			</div>

			<div className="mb-3">
				<label className="form-label">Cocineros</label>
				{formDataGastro.cocineros.map((cocinero, i) => (
					<div key={i} className="input-group mb-2">
						<input
							type="text"
							className="form-control"
							value={cocinero}
							onChange={(e) =>
								handleArrayChange(i, "cocineros", e.target.value)
							}
						/>
						<button
							type="button"
							className="btn btn-danger"
							onClick={() => handleRemoveInput("cocineros", i)}
						>
							✕
						</button>
					</div>
				))}
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() => handleAddInput("cocineros")}
				>
					Agregar Cocinero
				</button>
			</div>

			<div className="mb-3">
				<label className="form-label">Lugar de Preparación</label>
				<input
					type="text"
					className="form-control"
					name="lugar_preparacion"
					value={formDataGastro.lugar_preparacion}
					onChange={handleChange}
				/>
			</div>

			<div className="form-check mb-3">
				<input
					type="checkbox"
					className="form-check-input"
					name="abierto_al_publico"
					checked={formDataGastro.abierto_al_publico}
					onChange={handleChange}
				/>
				<label className="form-check-label">Abierto al público</label>
			</div>

			<div className="mb-3">
				<label className="form-label">Costo de Entrada</label>
				<input
					type="number"
					className="form-control"
					name="costo_entrada"
					value={formDataGastro.costo_entrada}
					onChange={handleChange}
				/>
			</div>

			<button type="submit" className="btn btn-primary">
				Guardar Evento Gastronómico
			</button>
		</form>
	);
};

export default ContenedorFormularioGastronomico;
