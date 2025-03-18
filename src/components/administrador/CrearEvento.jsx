import React, { useState } from "react";
import usuariosAxios from "../../config/axios"; // Cliente Axios configurado

const CrearEvento = () => {
	const [formData, setFormData] = useState({
		titulo: "",
		descripcion: "",
		fecha_inicio: "",
		fecha_fin: "",
		ubicacion: "",
		imagenes: null, // Cambiado a null para manejar archivos
		tipo: "",
	});

	const [mensaje, setMensaje] = useState("");

	// Manejar cambios en los campos de texto
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Manejar cambio de imagen
	const handleFileChange = (e) => {
		setFormData((prevData) => ({
			...prevData,
			imagenes: e.target.files[0], // Guardamos el archivo seleccionado
		}));
	};

	// Enviar formulario
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const token = localStorage.getItem("tokenLogin");

			if (!token) {
				setMensaje("❌ No se encontró el token. Inicia sesión nuevamente.");
				return;
			}

			const data = new FormData();
			data.append("titulo", formData.titulo);
			data.append("descripcion", formData.descripcion);
			data.append("fecha_inicio", formData.fecha_inicio);
			data.append("fecha_fin", formData.fecha_fin);
			data.append("ubicacion", formData.ubicacion);
			if (formData.imagenes) {
				data.append("imagenes", formData.imagenes); // Adjuntar imagen solo si existe
			}
			data.append("tipo", formData.tipo);

			const response = await usuariosAxios.post("/evento/registrar", data, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});

			setMensaje("✅ Evento creado con éxito");
			console.log(response.data);

			// Limpiar formulario
			setFormData({
				titulo: "",
				descripcion: "",
				fecha_inicio: "",
				fecha_fin: "",
				ubicacion: "",
				imagenes: null,
				tipo: "",
			});
		} catch (error) {
			console.error("Error al crear el evento:", error);
			setMensaje("❌ Error al crear el evento");
		}
	};

	return (
		<div className="container mt-4">
			<div className="row">
				{/* Formulario */}
				<div className="col-md-6">
					<h2>Crear Nuevo Evento</h2>
					<form onSubmit={handleSubmit} className="mt-3">
						{/* Título */}
						<div className="mb-3">
							<label className="form-label">Título</label>
							<input
								type="text"
								className="form-control"
								name="titulo"
								value={formData.titulo}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Descripción */}
						<div className="mb-3">
							<label className="form-label">Descripción</label>
							<textarea
								className="form-control"
								name="descripcion"
								value={formData.descripcion}
								onChange={handleChange}
								rows="4"
								required
							></textarea>
						</div>

						{/* Fecha Inicio */}
						<div className="mb-3">
							<label className="form-label">Fecha Inicio</label>
							<input
								type="datetime-local"
								className="form-control"
								name="fecha_inicio"
								value={formData.fecha_inicio}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Fecha Fin */}
						<div className="mb-3">
							<label className="form-label">Fecha Fin</label>
							<input
								type="datetime-local"
								className="form-control"
								name="fecha_fin"
								value={formData.fecha_fin}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Ubicación */}
						<div className="mb-3">
							<label className="form-label">Ubicación</label>
							<input
								type="text"
								className="form-control"
								name="ubicacion"
								value={formData.ubicacion}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Imágenes */}
						<div className="mb-3">
							<label className="form-label">Imágenes</label>
							<input
								type="file"
								className="form-control"
								name="imagenes"
								onChange={handleFileChange}
								accept="image/*"
							/>
						</div>

						{/* Tipo */}
						<div className="mb-3">
							<label className="form-label">Tipo</label>
							<input
								type="text"
								className="form-control"
								name="tipo"
								value={formData.tipo}
								onChange={handleChange}
								required
							/>
						</div>

						<button type="submit" className="btn btn-primary">
							Crear Evento
						</button>

						{mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
					</form>
				</div>

				{/* Vista previa */}
				<div className="col-md-6">
					<h2>Vista previa del evento</h2>
					<div className="card text-center mb-4 shadow">
						<div className="card-header bg-primary text-white">
							📅 Evento: {formData.titulo || "Sin título aún"}
						</div>

						<div className="card-body">
							<h5 className="card-title">
								📝 Título: {formData.titulo || "Sin definir"}
							</h5>

							<p className="card-text">
								📖 Descripción:{" "}
								{formData.descripcion || "Agrega una descripción"}
							</p>

							<p className="card-text">
								📍 Ubicación: {formData.ubicacion || "Sin ubicación"}
							</p>

							<p className="card-text">
								⏰ Inicio: {formData.fecha_inicio || "No definido"} <br />
								🕒 Fin: {formData.fecha_fin || "No definido"}
							</p>

							<p className="card-text">
								🎯 Tipo: {formData.tipo || "Sin tipo"}
							</p>

							{formData.imagenes ? (
								<img
									src={URL.createObjectURL(formData.imagenes)}
									alt="Vista previa"
									className="img-fluid mb-3"
								/>
							) : (
								<p className="text-muted">No se ha agregado una imagen</p>
							)}

							<button className="btn btn-secondary" disabled>
								Ver detalles
							</button>
						</div>

						<div className="card-footer text-muted">
							📅 Previsualización en tiempo real
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CrearEvento;
