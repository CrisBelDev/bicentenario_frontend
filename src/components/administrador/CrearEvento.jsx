import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usuariosAxios from "../../config/axios"; // Cliente Axios configurado
import { validarSesion } from "../../utils/ValidarSesion";

const CrearEvento = () => {
	const [formData, setFormData] = useState({
		titulo: "",
		descripcion: "",
		fecha_inicio: "",
		fecha_fin: "",
		ubicacion: "",
		imagenes: null,
		tipo: "",
	});

	const [mensaje, setMensaje] = useState("");
	const navigate = useNavigate();
	const token = localStorage.getItem("tokenLogin");

	// Si no hay token, redirigir a la página de inicio
	useEffect(() => {
		if (!token) {
			navigate("/");
		}
	}, [token, navigate]);

	// Manejar cambios en los campos de texto o archivos
	const handleChange = (e) => {
		const { name, value, type, files } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: type === "file" ? files[0] : value, // Manejar imágenes si es el caso
		}));
	};

	// Enviar formulario
	const handleSubmit = async (e) => {
		e.preventDefault();

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

		try {
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
			if (validarSesion(error, navigate)) return; // Si la sesión expiró, no seguimos ejecutando
		}
	};

	return (
		<div className="container mt-4">
			<div className="row">
				{/* Formulario */}
				<div className="col-md-6">
					<h2>Crear Nuevo Evento</h2>
					<form onSubmit={handleSubmit} className="mt-3">
						{/* Campos de formulario */}
						{[
							{ label: "Título", name: "titulo", type: "text" },
							{ label: "Descripción", name: "descripcion", type: "textarea" },
							{
								label: "Fecha Inicio",
								name: "fecha_inicio",
								type: "datetime-local",
							},
							{ label: "Fecha Fin", name: "fecha_fin", type: "datetime-local" },
							{ label: "Ubicación", name: "ubicacion", type: "text" },
							{ label: "Tipo", name: "tipo", type: "text" },
						].map((field) => (
							<div className="mb-3" key={field.name}>
								<label className="form-label">{field.label}</label>
								{field.type === "textarea" ? (
									<textarea
										className="form-control"
										name={field.name}
										value={formData[field.name]}
										onChange={handleChange}
										rows="4"
										required
									/>
								) : (
									<input
										type={field.type}
										className="form-control"
										name={field.name}
										value={formData[field.name]}
										onChange={handleChange}
										required
									/>
								)}
							</div>
						))}

						{/* Imagenes */}
						<div className="mb-3">
							<label className="form-label">Imágenes</label>
							<input
								type="file"
								className="form-control"
								name="imagenes"
								onChange={handleChange}
								accept="image/*"
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
