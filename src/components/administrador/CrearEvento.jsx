import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usuariosAxios from "../../config/axios"; // Cliente Axios configurado
import { validarSesion } from "../../utils/ValidarSesion";
import ReactQuill, { Quill } from "react-quill-new"; // Asegúrate de tener Quill importado
import "react-quill-new/dist/quill.snow.css"; // Estilos de Quill

// Leaflet Imports
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useMap } from "react-leaflet";

const MapUpdater = ({ position }) => {
	const map = useMap();
	useEffect(() => {
		map.setView(position); // Actualiza la vista del mapa a las nuevas coordenadas
	}, [position, map]);

	return null;
};

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
	const [mapPosition, setMapPosition] = useState([
		-16.504774678561407, -68.12995721673195,
	]); // Coordenadas del mapa
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

	// Manejar cambios en la descripción con ReactQuill
	const handleDescripcionChange = (value) => {
		setFormData((prevData) => ({
			...prevData,
			descripcion: value,
		}));
	};

	// Manejar cambios en la ubicación
	const handleUbicacionChange = (e) => {
		const { value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			ubicacion: value, // Actualizar el estado con la nueva ubicación
		}));

		// Convertir ubicación en coordenadas y actualizar el mapa solo si las coordenadas son válidas
		const coords = value.split(",").map((coord) => parseFloat(coord.trim()));

		// Ver en consola las coordenadas que se están recibiendo
		console.log("Coordenadas recibidas:", coords);

		if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
			setMapPosition(coords); // Actualizamos las coordenadas del mapa
			console.log("Coordenadas válidas:", coords); // Ver en consola cuando las coordenadas son válidas
		} else {
			setMensaje("❌ Ubicación inválida. Usa el formato 'latitud, longitud'.");
			console.log("Coordenadas inválidas:", coords); // Ver en consola cuando las coordenadas son inválidas
		}
	};

	useEffect(() => {
		console.log("Nueva posición del mapa:", mapPosition); // Este log se ejecutará cada vez que cambien las coordenadas
	}, [mapPosition]); // Dependencia de mapPosition

	// Configuración de la barra de herramientas para ReactQuill
	const modules = {
		toolbar: [
			[{ header: "3" }],
			[{ list: "bullet" }],
			["bold", "italic", "underline", "strike"],
			[{ color: [] }],
			["link"],
			["clean"],
		],
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
					<div className="card mb-4 shadow">
						<div className="card-header bg-primary text-white">
							<h3>Crear Evento</h3>
						</div>

						<div className="card-body">
							<form
								onSubmit={handleSubmit}
								className="mt-3 colorfondo_formulario"
							>
								{/* Campos de formulario */}
								{[
									{ label: "Título", name: "titulo", type: "text" },
									{
										label: "Descripción",
										name: "descripcion",
										type: "react-quill",
									},
									{
										label: "Fecha Inicio",
										name: "fecha_inicio",
										type: "datetime-local",
									},
									{
										label: "Fecha Fin",
										name: "fecha_fin",
										type: "datetime-local",
									},
								].map((field) => (
									<div className="mb-3" key={field.name}>
										<label className="form-label">{field.label}</label>
										{field.type === "react-quill" ? (
											<ReactQuill
												value={formData.descripcion}
												onChange={handleDescripcionChange}
												theme="snow"
												required
												modules={modules} // Aquí aplicamos la configuración
											/>
										) : field.type === "textarea" ? (
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
												onChange={
													field.name === "ubicacion"
														? handleUbicacionChange
														: handleChange
												}
												required
											/>
										)}
									</div>
								))}

								{/* Campo de ubicación */}
								<div className="mb-3">
									<label className="form-label">
										Ubicación (Latitud, Longitud)
									</label>
									<input
										type="text"
										className="form-control"
										name="ubicacion"
										value={formData.ubicacion}
										onChange={handleUbicacionChange}
										placeholder="Ejemplo: 12.3456, -76.5432"
										required
									/>
								</div>
								<div className="mb-3">
									{/* Mapa */}
									{
										<MapContainer
											center={mapPosition}
											zoom={20}
											style={{ height: "400px", width: "100%" }}
										>
											<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
											<Marker position={mapPosition}>
												<Popup>Ubicación: {formData.ubicacion}</Popup>
											</Marker>
											<MapUpdater position={mapPosition} />
										</MapContainer>
									}
								</div>

								<div className="mb-3">
									<label className="form-label">Tipo de evento</label>
									<select
										className="form-control"
										name="tipo"
										value={formData.tipo}
										onChange={handleChange}
										required
									>
										<option value="">Selecciona una opción</option>
										<option value="cultural">Cultural</option>
										<option value="academico">Académico</option>
										<option value="gastronomico">Gastronómico</option>
									</select>
								</div>

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
									{formData.imagenes && (
										<div className="mt-2">
											<strong>Archivo seleccionado:</strong>{" "}
											{formData.imagenes.name}
										</div>
									)}
								</div>

								<button type="submit" className="btn btn-primary">
									Crear Evento
								</button>

								{mensaje && (
									<div className="alert alert-info mt-3">{mensaje}</div>
								)}
							</form>
						</div>

						<div className="card-footer"></div>
					</div>
				</div>

				{/* Vista previa */}
				<div className="col-md-6">
					<h2>Vista previa del evento</h2>
					<div className="card mb-4 shadow">
						<div className="card-header bg-primary text-white">
							{formData.titulo || "Sin título aún"}
						</div>
						<div className="card-body">
							{formData.imagenes ? (
								<img
									src={URL.createObjectURL(formData.imagenes)}
									alt="Vista previa"
									className="img-fluid mb-3"
								/>
							) : (
								<p className="text-muted">No se ha agregado una imagen</p>
							)}
						</div>
						<div className="card-body">
							<p className="card-text">
								{" "}
								{formData.descripcion ? (
									<div
										className="descripcion-preview"
										dangerouslySetInnerHTML={{ __html: formData.descripcion }}
									/>
								) : (
									"Agrega una descripción"
								)}
							</p>

							<p className="card-text">
								📍 Ubicación:
								{formData.ubicacion && formData.ubicacion.includes(",") && (
									<a
										href={`https://www.google.com/maps?q=${formData.ubicacion}`}
										target="_blank"
										rel="noopener noreferrer"
										className="ms-2"
									>
										Ver en Google Maps
									</a>
								)}
							</p>

							<p className="card-text">
								⏰ Inicio: {formData.fecha_inicio || "No definido"} <br />
								🕒 Fin: {formData.fecha_fin || "No definido"}
							</p>

							<p className="card-text">
								🎯 Tipo de evento: {formData.tipo || "Sin tipo"}
							</p>

							<button className="btn btn-secondary" disabled>
								Ver detalles
							</button>
						</div>

						<div className="card-footer ">
							📅 Previsualización en tiempo real
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CrearEvento;
