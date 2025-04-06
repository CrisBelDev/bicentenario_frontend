import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import usuariosAxios from "../../config/axios";
import Swal from "sweetalert2";

const FormularioEventoCultural = ({ id_evento }) => {
	const [formData, setFormData] = useState({
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
			setFormData({ ...formData, [name]: files[0] }); // ✅ Guardar solo el archivo
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleDescripcionChange = (value) => {
		setFormData({ ...formData, descripcion: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const formDataToSend = new FormData();
		formDataToSend.append("id_evento", id_evento);
		formDataToSend.append("titulo", formData.titulo);
		formDataToSend.append("tipoEvento", formData.tipoEvento);
		formDataToSend.append("fechaInicio", formData.fechaInicio);
		formDataToSend.append("fechaFin", formData.fechaFin);
		formDataToSend.append("lugar", formData.lugar);
		formDataToSend.append("organizadoPor", formData.organizadoPor);
		formDataToSend.append("descripcion", formData.descripcion);

		if (formData.afichePromocional) {
			formDataToSend.append("afichePromocional", formData.afichePromocional);
		}

		usuariosAxios
			.post("/evento-cultural", formDataToSend, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				console.log("Evento registrado:", response.data);
				Swal.fire({
					icon: "success",
					title: "¡Evento cultural registrado exitosamente!",
					text: "El evento ha sido registrado correctamente.",
					showConfirmButton: false,
					timer: 1500,
				});
			})
			.catch((error) => {
				console.error("Error al registrar evento:", error);
				Swal.fire({
					icon: "error",
					title: "Error al registrar evento",
					text: "Hubo un problema al registrar la información del evento.",
				});
			});
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="mb-3">
				<label className="form-label">Título del Evento</label>
				<input
					type="text"
					className="form-control"
					name="titulo"
					value={formData.titulo}
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
					value={formData.tipoEvento}
					onChange={handleChange}
					required
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Fecha de Inicio</label>
				<input
					type="datetime-local"
					className="form-control"
					name="fechaInicio"
					value={formData.fechaInicio}
					onChange={handleChange}
					required
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Fecha de Finalización</label>
				<input
					type="datetime-local"
					className="form-control"
					name="fechaFin"
					value={formData.fechaFin}
					onChange={handleChange}
					required
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Lugar</label>
				<input
					type="text"
					className="form-control"
					name="lugar"
					value={formData.lugar}
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
					value={formData.organizadoPor}
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
					value={formData.descripcion}
					onChange={handleDescripcionChange}
					theme="snow"
				/>
			</div>

			<button type="submit" className="btn btn-success">
				Registrar Evento
			</button>
		</form>
	);
};

export default FormularioEventoCultural;
