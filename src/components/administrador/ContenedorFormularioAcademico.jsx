import React, { useState, useEffect } from "react";
import usuariosAxios from "../../config/axios";

const ContenedorFormularioAcademico = ({ id_evento }) => {
	const [formDataAcademico, setFormDataAcademico] = useState({
		modalidad: "presencial",
		organizado_por: "",
		ponentes: [""],
		enlace_sesion: "",
		es_gratuito: false,
		requisitos_registro: "",
	});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormDataAcademico((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleArrayChange = (index, field, value) => {
		const updatedArray = [...formDataAcademico[field]];
		updatedArray[index] = value;
		setFormDataAcademico((prev) => ({
			...prev,
			[field]: updatedArray,
		}));
	};

	const handleAddInput = (field) => {
		setFormDataAcademico((prev) => ({
			...prev,
			[field]: [...prev[field], ""],
		}));
	};

	const handleRemoveInput = (field, index) => {
		const updatedArray = [...formDataAcademico[field]];
		updatedArray.splice(index, 1);
		setFormDataAcademico((prev) => ({
			...prev,
			[field]: updatedArray.length ? updatedArray : [""],
		}));
	};

	const handleSubmit = (e) => {
		if (e) e.preventDefault();

		if (!id_evento) {
			alert("Debe existir un ID de evento antes de enviar.");
			return;
		}

		if (!formDataAcademico.organizado_por.trim()) {
			alert("Debe ingresar quién organiza el evento.");
			return;
		}

		const datosAEnviar = {
			...formDataAcademico,
			id_evento,
			ponentes: JSON.stringify(formDataAcademico.ponentes),
		};

		usuariosAxios
			.post("/evento-academico", datosAEnviar)
			.then((res) => console.log("Académico registrado", res.data))
			.catch((err) => console.error("Error al registrar", err));
	};

	useEffect(() => {
		if (id_evento) handleSubmit();
	}, [id_evento]);

	return (
		<form onSubmit={handleSubmit}>
			<div className="mb-3">
				<label className="form-label">Modalidad</label>
				<select
					name="modalidad"
					className="form-select"
					value={formDataAcademico.modalidad}
					onChange={handleChange}
				>
					<option value="presencial">Presencial</option>
					<option value="virtual">Virtual</option>
					<option value="mixto">Mixto</option>
				</select>
			</div>

			<div className="mb-3">
				<label className="form-label">Organizado por</label>
				<input
					type="text"
					className="form-control"
					name="organizado_por"
					value={formDataAcademico.organizado_por}
					onChange={handleChange}
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Ponentes</label>
				{formDataAcademico.ponentes.map((ponente, i) => (
					<div key={i} className="input-group mb-2">
						<input
							type="text"
							className="form-control"
							value={ponente}
							onChange={(e) => handleArrayChange(i, "ponentes", e.target.value)}
						/>
						<button
							type="button"
							className="btn btn-danger"
							onClick={() => handleRemoveInput("ponentes", i)}
							disabled={formDataAcademico.ponentes.length === 1}
						>
							✕
						</button>
					</div>
				))}
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() => handleAddInput("ponentes")}
				>
					Agregar Ponente
				</button>
			</div>

			<div className="mb-3">
				<label className="form-label">Enlace a la sesión</label>
				<input
					type="text"
					className="form-control"
					name="enlace_sesion"
					value={formDataAcademico.enlace_sesion}
					onChange={handleChange}
				/>
			</div>

			<div className="form-check mb-3">
				<input
					type="checkbox"
					className="form-check-input"
					name="es_gratuito"
					checked={formDataAcademico.es_gratuito}
					onChange={handleChange}
				/>
				<label className="form-check-label">Es gratuito</label>
			</div>

			<div className="mb-3">
				<label className="form-label">Requisitos para el registro</label>
				<textarea
					className="form-control"
					name="requisitos_registro"
					value={formDataAcademico.requisitos_registro}
					onChange={handleChange}
				></textarea>
			</div>

			<button type="submit" className="btn btn-primary">
				Guardar Evento Académico
			</button>
		</form>
	);
};

export default ContenedorFormularioAcademico;
