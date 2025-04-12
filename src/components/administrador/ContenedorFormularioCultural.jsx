import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import usuariosAxios from "../../config/axios";

const ContenedorFormularioCultural = ({ id_evento }) => {
	console.log("recibido XD: ", id_evento);
	const [formDataCultural, setFormDataCultural] = useState({
		titulo: "",
		tipoEvento: "",
		fechaInicio: "",
		fechaFin: "",
		lugar: "",
		organizadoPor: "",
		afichePromocional: null,
		descripcion: "",
	});

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === "afichePromocional") {
			setFormDataCultural((prev) => ({ ...prev, [name]: files[0] }));
		} else {
			setFormDataCultural((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleDescripcionChange = (value) => {
		setFormDataCultural((prev) => ({ ...prev, descripcion: value }));
	};

	useEffect(() => {
		if (id_evento) {
			handleSubmitCultural(); // Enviar automáticamente si ya hay un ID
		}
	}, [id_evento]);

	const handleSubmitCultural = (e) => {
		if (e) e.preventDefault();

		const formDataCulturalToSend = new FormData();
		formDataCulturalToSend.append("id_evento", id_evento);
		formDataCulturalToSend.append("titulo", formDataCultural.titulo);
		formDataCulturalToSend.append("tipoEvento", formDataCultural.tipoEvento);
		formDataCulturalToSend.append("fechaInicio", formDataCultural.fechaInicio);
		formDataCulturalToSend.append("fechaFin", formDataCultural.fechaFin);
		formDataCulturalToSend.append("lugar", formDataCultural.lugar);
		formDataCulturalToSend.append(
			"organizadoPor",
			formDataCultural.organizadoPor
		);
		formDataCulturalToSend.append("descripcion", formDataCultural.descripcion);

		if (formDataCultural.afichePromocional) {
			formDataCulturalToSend.append(
				"afichePromocional",
				formDataCultural.afichePromocional
			);
		}

		usuariosAxios
			.post("/evento-cultural", formDataCulturalToSend, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then((response) => {
				console.log("Evento registrado:", response.data);
			})
			.catch((error) => {
				console.error("Error al registrar evento:", error);
			});
	};

	return (
		<form onSubmit={handleSubmitCultural}>
			<div className="mb-3">
				<label className="form-label">Título del Evento</label>
				<input
					type="text"
					className="form-control"
					name="titulo"
					value={formDataCultural.titulo}
					onChange={handleChange}
					required
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Tipo de Evento</label>
				<input
					type="text"
					className="form-control"
					name="tipoEvento"
					value={formDataCultural.tipoEvento}
					onChange={handleChange}
					required
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Organizado por</label>
				<input
					type="text"
					className="form-control"
					name="organizadoPor"
					value={formDataCultural.organizadoPor}
					onChange={handleChange}
					required
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Afiche Promocional</label>
				<input
					type="file"
					className="form-control"
					name="afichePromocional"
					onChange={handleChange}
					required
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Descripción</label>
				<ReactQuill
					value={formDataCultural.descripcion}
					onChange={handleDescripcionChange}
					theme="snow"
				/>
			</div>
		</form>
	);
};

export default ContenedorFormularioCultural;
