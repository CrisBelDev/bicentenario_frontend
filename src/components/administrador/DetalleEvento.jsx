import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usuariosAxios from "../../config/axios"; // Cliente Axios configurado
import { validarSesion } from "../../utils/ValidarSesion";
import ReactQuill from "react-quill-new"; // Asegúrate de tener Quill importado
import "react-quill-new/dist/quill.snow.css"; // Estilos de Quill
import Swal from "sweetalert2"; // Importar SweetAlert2
import Ubicacion from "./Ubicacion"; // Importa el componente Ubicacion

const EditarEvento = () => {
	const [editable, setEditable] = useState(false);
	const { id } = useParams(); // Obtén el id del evento de la URL
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
	const [mapPosition, setMapPosition] = useState([0, 0]); // Coordenadas del mapa
	const navigate = useNavigate();
	const token = localStorage.getItem("tokenLogin");

	// Si no hay token, redirigir a la página de inicio
	useEffect(() => {
		if (!token) {
			navigate("/");
		}
	}, [token, navigate]);

	const formatDate = (date) => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, "0"); // Los meses comienzan en 0
		const day = String(d.getDate()).padStart(2, "0");
		const hours = String(d.getHours()).padStart(2, "0");
		const minutes = String(d.getMinutes()).padStart(2, "0");
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};

	// Cargar los datos del evento al inicio
	useEffect(() => {
		const fetchEventData = async () => {
			try {
				const response = await usuariosAxios.get(`/evento/detalle/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				console.log("mio:", response.data.evento);
				const eventData = response.data.evento;
				setFormData({
					titulo: eventData.titulo,
					descripcion: eventData.descripcion,
					fecha_inicio: formatDate(eventData.fecha_inicio),
					fecha_fin: formatDate(eventData.fecha_fin),
					ubicacion: eventData.ubicacion,
					imagenes: eventData.imagenes,
					tipo: eventData.tipo,
				});
				setMapPosition(eventData.ubicacion.split(",").map(Number)); // Asumimos que la ubicación es "lat,long"
			} catch (error) {
				console.error("Error al cargar el evento:", error);
				setMensaje("❌ Error al cargar los datos del evento");
				if (validarSesion(error, navigate)) return;
			}
		};

		fetchEventData();
	}, [id, token, navigate]);

	// Manejar cambios en los campos de texto o archivos
	const handleChange = (e) => {
		const { name, value, type, files } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: type === "file" ? files[0] : value,
		}));
	};

	// Manejar cambios en la descripción con ReactQuill
	const handleDescripcionChange = (value) => {
		setFormData((prevData) => ({
			...prevData,
			descripcion: value,
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
			data.append("imagenes", formData.imagenes);
		}
		data.append("tipo", formData.tipo);

		try {
			const response = await usuariosAxios.put(`/evento/editar/${id}`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});

			setMensaje("✅ Evento editado con éxito");
			Swal.fire({
				title: "¡Evento editado con éxito!",
				icon: "success",
			});

			navigate(
				`/bicentenario-dashboard/detalle-evento/${response.data.evento.id_evento}`
			);
		} catch (error) {
			console.error("Error al editar el evento:", error);
			setMensaje("❌ Error al editar el evento");
			if (validarSesion(error, navigate)) return;
		}
	};

	return (
		<div className="container mt-4">
			<div className="row">
				<div className="col-md-6">
					<div className="card mb-4 shadow">
						<div className="card-header bg-primary text-white">
							<h3>Editar Evento</h3>
						</div>
						<div className="card-body">
							<form onSubmit={handleSubmit} className="mt-3">
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
											/>
										) : (
											<input
												type={field.type}
												className="form-control"
												name={field.name}
												value={formData[field.name]}
												onChange={handleChange}
												disabled={!editable}
												required
											/>
										)}
									</div>
								))}

								{/* Ubicación con el componente Ubicacion */}
								<Ubicacion
									ubicacion={formData.ubicacion}
									setUbicacion={(value) =>
										setFormData({ ...formData, ubicacion: value })
									}
									setMensaje={setMensaje}
								/>

								{/* Tipo de evento */}
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
										<option value="deportivo">Deportivo</option>
										<option value="historico">Histórico</option>
									</select>
								</div>

								{/* Imágenes */}
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

								{/* Botón para activar edición (solo se muestra cuando no está en modo edición) */}
								{!editable && (
									<button
										type="button"
										className="btn btn-warning me-2"
										onClick={() => setEditable(true)}
									>
										Editar
									</button>
								)}

								{/* Botón para enviar el formulario (solo se muestra en modo edición) */}
								{editable && (
									<button type="submit" className="btn btn-success">
										Actualizar
									</button>
								)}

								{mensaje && (
									<div className="alert alert-info mt-3">{mensaje}</div>
								)}
							</form>
						</div>
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
									src={
										formData.imagenes.startsWith("http")
											? formData.imagenes
											: `/uploads/${formData.imagenes}`
									}
									alt="Imagen del evento"
									className="img-fluid"
								/>
							) : (
								<p>No hay imagen</p>
							)}

							<p>{formData.descripcion || "No hay descripción aún"}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditarEvento;
