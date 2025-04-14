import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const FormularioEventoCultural = ({ formData, setFormData, onSubmit }) => {
	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (name === "afichePromocional") {
			setFormData((prev) => ({ ...prev, [name]: files[0] }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleDescripcionChange = (value) => {
		setFormData((prev) => ({ ...prev, descripcion: value }));
	};

	return (
		<form onSubmit={onSubmit}>
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
		</form>
	);
};

export default FormularioEventoCultural;
