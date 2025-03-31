import React, { useState, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Configuración de los módulos para permitir insertar imágenes
const modules = {
	toolbar: [
		[{ header: "1" }, { header: "2" }, { font: [] }],
		[{ list: "ordered" }, { list: "bullet" }],
		["bold", "italic", "underline"],
		[{ align: [] }],
		["link", "image"],
	],
};

const FormularioDinamico = ({ tipo, onDataChange }) => {
	if (!tipo) return null;

	switch (tipo) {
		case "cultural":
			return <FormularioCultural onDataChange={onDataChange} />;
		case "academico":
			return <FormularioAcademico onDataChange={onDataChange} />;
		case "gastronomico":
			return <FormularioGastronomico onDataChange={onDataChange} />;
		case "deportivo":
			return <FormularioDeportivo onDataChange={onDataChange} />;
		case "historico":
			return <FormularioHistorico onDataChange={onDataChange} />;
		default:
			return null;
	}
};

const FormularioCultural = ({ onDataChange }) => {
	const [descripcion, setDescripcion] = useState("");
	const [imagen, setImagen] = useState(null);
	const quillRef = useRef();

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setImagen(file);
			if (onDataChange) {
				onDataChange({ descripcion, imagen: file });
			}
		}
	};

	const handleDescripcionChange = (value) => {
		setDescripcion(value);
		if (onDataChange) {
			onDataChange({ descripcion: value, imagen });
		}
	};

	return (
		<div className="card shadow p-3">
			<h4>Detalles del Evento Cultural</h4>
			<div className="mb-3">
				<label className="form-label">Descripción</label>
				<ReactQuill
					ref={quillRef}
					value={descripcion}
					onChange={handleDescripcionChange}
					theme="snow"
					modules={modules}
				/>
			</div>
			<div className="mb-3">
				<label className="form-label">Imagen</label>
				<input
					type="file"
					className="form-control"
					accept="image/*"
					onChange={handleImageChange}
				/>
			</div>
		</div>
	);
};

const FormularioAcademico = ({ onDataChange }) => (
	<div>Formulario para evento académico</div>
);
const FormularioGastronomico = ({ onDataChange }) => (
	<div>Formulario para evento gastronómico</div>
);
const FormularioDeportivo = ({ onDataChange }) => (
	<div>Formulario para evento deportivo</div>
);
const FormularioHistorico = ({ onDataChange }) => (
	<div>Formulario para evento histórico</div>
);

export default FormularioDinamico;
