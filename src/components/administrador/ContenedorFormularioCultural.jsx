import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import usuariosAxios from "../../config/axios";

const ContenedorFormularioCultural = ({ id_evento }) => {
	console.log("recibido XD: ", id_evento);
	const [formDataCultural, setFormDataCultural] = useState({
		organizadoPor: "",

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

		formDataCulturalToSend.append(
			"organizadoPor",
			formDataCultural.organizadoPor
		);
		formDataCulturalToSend.append("descripcion", formDataCultural.descripcion);

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
