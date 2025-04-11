import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usuariosAxios from "../../config/axios"; // Cliente Axios configurado
import { validarSesion } from "../../utils/ValidarSesion";
import ReactQuill from "react-quill-new"; // Asegúrate de tener Quill importado
import "react-quill-new/dist/quill.snow.css"; // Estilos de Quill
import Swal from "sweetalert2"; // Importar SweetAlert2
import Ubicacion from "./Ubicacion"; // Importa el componente Ubicacion
import EtniasCheckbox from "./EtniasCheckbox"; // Importa el componente EtniasCheckbox

const EditarEventoCultural = () => {
	const [editable, setEditable] = useState(false);
	const { id } = useParams(); // Obtén el id del evento de la URL
	const [formData, setFormData] = useState({
		titulo: "",
		descripcion: "",
		fecha_inicio: "",
		fecha_fin: "",
		ubicacion: "",
		afiche_promocional: null,
		organizado_por: "",
		lugar: "",
		etniasSeleccionadas: [], // Agrega un estado para las etnias seleccionadas
	});

	const [mensaje, setMensaje] = useState("");
	const [mapPosition, setMapPosition] = useState([0, 0]); // Coordenadas del mapa
	const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío del formulario
	const [eventoData, setEventoData] = useState(null); // Aquí se guardará el evento desde la base de datos
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
		return `${year}-${month}-${day}T${String(d.getHours()).padStart(
			2,
			"0"
		)}:${String(d.getMinutes()).padStart(2, "0")}`;
	};

	// Cargar los datos del evento al inicio
	useEffect(() => {
		const fetchEventData = async () => {
			try {
				const response = await usuariosAxios.get(`evento-cultural-info/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				console.log(response.data);
				const eventData = response.data.evento;
				setFormData({
					titulo: eventData.titulo,
					descripcion: eventData.descripcion,
					fecha_inicio: formatDate(eventData.fecha_inicio),
					fecha_fin: formatDate(eventData.fecha_finalizacion),
					ubicacion: eventData.lugar, // es un string nomas
					afiche_promocional: eventData.afiche_promocional,
					organizado_por: eventData.organizado_por,
					lugar: eventData.lugar,
					etniasSeleccionadas: eventData.etnias || [], // Asume que las etnias seleccionadas están en el evento
				});

				setEventoData(eventData); // Guardamos los datos del evento para la vista previa
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
		setFormData((prevData) => {
			const updatedData = {
				...prevData,
				[name]: type === "file" ? files[0] : value,
			};
			setEventoData(updatedData); // Actualizamos eventoData para la vista previa
			return updatedData;
		});
	};

	// Manejar cambios en la descripción con ReactQuill
	const handleDescripcionChange = (value) => {
		setFormData((prevData) => {
			const updatedData = { ...prevData, descripcion: value };
			setEventoData(updatedData); // Actualizamos eventoData para la vista previa
			return updatedData;
		});
	};

	// Manejar cambios en las etnias seleccionadas
	const handleEtniasChange = (etniasSeleccionadas) => {
		setFormData((prevData) => ({
			...prevData,
			etniasSeleccionadas, // Actualiza las etnias seleccionadas en el estado
		}));
	};

	// Validación antes de enviar el formulario
	const validateForm = () => {
		if (
			!formData.titulo ||
			!formData.descripcion ||
			!formData.fecha_inicio ||
			!formData.fecha_fin ||
			!formData.organizado_por
		) {
			setMensaje("❌ Todos los campos son obligatorios.");
			return false;
		}
		return true;
	};

	// Enviar formulario
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!token) {
			setMensaje("❌ No se encontró el token. Inicia sesión nuevamente.");
			return;
		}

		if (!validateForm()) {
			return; // Si la validación falla, no enviar el formulario
		}

		setIsSubmitting(true); // Habilitar la carga

		const data = new FormData();
		data.append("titulo", formData.titulo);
		data.append("descripcion", formData.descripcion);
		data.append("fecha_inicio", formData.fecha_inicio);
		data.append("fecha_fin", formData.fecha_fin);
		data.append("ubicacion", formData.ubicacion);
		if (formData.afiche_promocional) {
			data.append("afiche_promocional", formData.afiche_promocional);
		}
		data.append("organizado_por", formData.organizado_por);
		const datos_check = JSON.stringify(formData.etniasSeleccionadas);
		console.log("datos que enviare al backend: ", datos_check);
		data.append("etnias", datos_check); // Agrega las etnias seleccionadas

		try {
			const response = await usuariosAxios.put(`/evento-cultural/${id}`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});

			setMensaje("✅ Evento editado con éxito");
			Swal.fire({
				title: "¡Evento editado con éxito!",
				icon: "success",
			}).then(() => {
				// Redirigir y recargar la página al hacer clic en el botón de confirmación
				window.location.href = `/bicentenario-dashboard/detalle-evento/${response.data.evento.id_evento}`;
			});
		} catch (error) {
			console.error("Error al editar el evento:", error);
			setMensaje("❌ Error al editar el evento");
			if (validarSesion(error, navigate)) return;
		} finally {
			setIsSubmitting(false); // Deshabilitar la carga
		}
	};

	return (
		<div className="container mt-4">
			<div className="row">
				<div className="col-md-6">
					<div className="accordion" id="eventoAccordion">
						{/* Acordeón de edición de evento */}
						<div className="card mb-4 shadow">
							<div
								className="card-header bg-primary text-white"
								id="headingOne"
							>
								<h3 className="mb-0">
									<button
										className="btn btn-link text-white"
										type="button"
										data-bs-toggle="collapse"
										data-bs-target="#collapseOne"
										aria-expanded="true"
										aria-controls="collapseOne"
									>
										Editar Evento Cultural
									</button>
								</h3>
							</div>
							<div
								id="collapseOne"
								className="collapse show"
								aria-labelledby="headingOne"
								data-bs-parent="#eventoAccordion"
							>
								<div className="card-body">
									<form onSubmit={handleSubmit} className="mt-3">
										{/* Campos de formulario */}
										{[
											{
												label: "Título",
												name: "titulo",
												type: "text",
											},
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
											{
												label: "Organizado por",
												name: "organizado_por",
												type: "text",
											},
											{
												label: "Lugar",
												name: "lugar",
												type: "text",
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

										{/* Afiche Promocional */}
										<div className="mb-3">
											<label className="form-label">Afiche Promocional</label>
											<input
												type="file"
												className="form-control"
												name="afiche_promocional"
												onChange={handleChange}
												accept="image/*"
											/>
										</div>

										{/* Componente EtniasCheckbox */}
										{/* <EtniasCheckbox
											selectedEtnias={formData.etniasSeleccionadas}
											onChange={handleEtniasChange}
										/> */}

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
											<button
												type="submit"
												className="btn btn-primary"
												disabled={isSubmitting}
											>
												{isSubmitting ? "Guardando..." : "Guardar Cambios"}
											</button>
										)}

										{/* Mensaje de error o éxito */}
										{mensaje && (
											<div className="mt-3">
												<p
													className={
														mensaje.startsWith("✅")
															? "text-success"
															: "text-danger"
													}
												>
													{mensaje}
												</p>
											</div>
										)}
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditarEventoCultural;
