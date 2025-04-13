import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import usuariosAxios from "../../config/axios";

const ContenedorFormularioDeportivo = ({ id_evento }) => {
	const [formData, setFormData] = useState({
		disciplina: "",
		categorias: [""],
		modalidad: "",
		reglas: "",
		premios: [""],
		equiposParticipantes: [""],
		organizadoPor: "",
		requisitosParticipacion: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleQuillChange = (value, name) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleArrayChange = (index, value, key) => {
		const updated = [...formData[key]];
		updated[index] = value;
		setFormData((prev) => ({ ...prev, [key]: updated }));
	};

	const handleAddField = (key) => {
		setFormData((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
	};

	const handleRemoveField = (key, index) => {
		const updated = [...formData[key]];
		updated.splice(index, 1);
		setFormData((prev) => ({ ...prev, [key]: updated }));
	};

	useEffect(() => {
		if (id_evento) {
			handleSubmit(); // auto-enviar si ya hay un ID
		}
	}, [id_evento]);

	const handleSubmit = (e) => {
		if (e) e.preventDefault();

		const data = {
			id_evento,
			disciplina: formData.disciplina,
			categorias: JSON.stringify(formData.categorias),
			modalidad: formData.modalidad,
			reglas: formData.reglas,
			premios: JSON.stringify(formData.premios),
			equipos_participantes: JSON.stringify(formData.equiposParticipantes),
			organizado_por: formData.organizadoPor,
			requisitos_participacion: formData.requisitosParticipacion,
		};

		usuariosAxios
			.post("/evento-deportivo", data)
			.then((res) => console.log("Evento deportivo registrado:", res.data))
			.catch((err) =>
				console.error("Error al registrar evento deportivo:", err)
			);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="mb-3">
				<label className="form-label">Disciplina</label>
				<input
					type="text"
					name="disciplina"
					className="form-control"
					value={formData.disciplina}
					onChange={handleChange}
					required
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Modalidad</label>
				<input
					type="text"
					name="modalidad"
					className="form-control"
					value={formData.modalidad}
					onChange={handleChange}
					required
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Organizado por</label>
				<input
					type="text"
					name="organizadoPor"
					className="form-control"
					value={formData.organizadoPor}
					onChange={handleChange}
					required
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Reglas</label>
				<ReactQuill
					value={formData.reglas}
					onChange={(val) => handleQuillChange(val, "reglas")}
					theme="snow"
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Requisitos de Participación</label>
				<ReactQuill
					value={formData.requisitosParticipacion}
					onChange={(val) => handleQuillChange(val, "requisitosParticipacion")}
					theme="snow"
				/>
			</div>

			{/* Categorías dinámicas */}
			<div className="mb-3">
				<label className="form-label">Categorías</label>
				{formData.categorias.map((cat, i) => (
					<div className="d-flex mb-2" key={i}>
						<input
							type="text"
							className="form-control me-2"
							value={cat}
							onChange={(e) =>
								handleArrayChange(i, e.target.value, "categorias")
							}
							required
						/>
						<button
							type="button"
							className="btn btn-danger"
							onClick={() => handleRemoveField("categorias", i)}
						>
							−
						</button>
					</div>
				))}
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() => handleAddField("categorias")}
				>
					+ Agregar categoría
				</button>
			</div>

			{/* Premios dinámicos */}
			<div className="mb-3">
				<label className="form-label">Premios</label>
				{formData.premios.map((premio, i) => (
					<div className="d-flex mb-2" key={i}>
						<input
							type="text"
							className="form-control me-2"
							value={premio}
							onChange={(e) => handleArrayChange(i, e.target.value, "premios")}
						/>
						<button
							type="button"
							className="btn btn-danger"
							onClick={() => handleRemoveField("premios", i)}
						>
							−
						</button>
					</div>
				))}
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() => handleAddField("premios")}
				>
					+ Agregar premio
				</button>
			</div>

			{/* Equipos o Participantes dinámicos */}
			<div className="mb-3">
				<label className="form-label">Equipos o Participantes</label>
				{formData.equiposParticipantes.map((equipo, i) => (
					<div className="d-flex mb-2" key={i}>
						<input
							type="text"
							className="form-control me-2"
							value={equipo}
							onChange={(e) =>
								handleArrayChange(i, e.target.value, "equiposParticipantes")
							}
						/>
						<button
							type="button"
							className="btn btn-danger"
							onClick={() => handleRemoveField("equiposParticipantes", i)}
						>
							−
						</button>
					</div>
				))}
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() => handleAddField("equiposParticipantes")}
				>
					+ Agregar equipo
				</button>
			</div>

			<button type="submit" className="btn btn-primary">
				Guardar Evento Deportivo
			</button>
		</form>
	);
};

export default ContenedorFormularioDeportivo;
