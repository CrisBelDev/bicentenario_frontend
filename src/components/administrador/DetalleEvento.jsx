import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usuariosAxios from "../../config/axios";
import { validarSesion } from "../../utils/ValidarSesion";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Swal from "sweetalert2";
import {
	GoogleMap,
	MarkerF,
	useJsApiLoader,
	Autocomplete,
} from "@react-google-maps/api";

const EditarEvento = () => {
	const [editable, setEditable] = useState(false);
	const { id } = useParams();
	const [formData, setFormData] = useState({
		titulo: "",
		descripcion: "",
		fecha_inicio: "",
		fecha_fin: "",
		ubicacion: "",
		tipo: "",
		lugar: "",
	});
	const [mensaje, setMensaje] = useState("");
	const [mapPosition, setMapPosition] = useState({ lat: 0, lng: 0 });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [eventoData, setEventoData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const token = localStorage.getItem("tokenLogin");

	const autocompleteRef = useRef(null); // Referencia para Autocomplete
	const mapRef = useRef(null); // Referencia para el mapa

	useEffect(() => {
		// Redirigir si no hay token
		if (!token) {
			navigate("/");
			return;
		}

		const fetchEventData = async () => {
			try {
				const response = await usuariosAxios.get(`/evento/detalle/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const eventData = response.data.evento;
				setFormData({
					titulo: eventData.titulo,
					descripcion: eventData.descripcion,
					fecha_inicio: formatDate(eventData.fecha_inicio),
					fecha_fin: formatDate(eventData.fecha_fin),
					ubicacion: eventData.ubicacion,
					tipo: eventData.tipo,
					lugar: eventData.lugar,
				});
				const [lat, lng] = eventData.ubicacion.split(",").map(parseFloat);
				setMapPosition({ lat, lng });
				setEventoData(eventData);
			} catch (error) {
				console.error("Error al cargar el evento:", error);
				setMensaje("❌ Error al cargar los datos del evento");
				if (validarSesion(error, navigate)) return;
			} finally {
				setIsLoading(false);
			}
		};

		fetchEventData();
	}, [id, token, navigate]);

	const formatDate = (date) => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const day = String(d.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => {
			const updatedData = { ...prevData, [name]: value };
			console.log("actualizado: ", updatedData);
			setEventoData(updatedData);
			return updatedData;
		});
	};

	const handleDescripcionChange = (value) => {
		setFormData((prevData) => {
			const updatedData = { ...prevData, descripcion: value };
			setEventoData(updatedData);
			return updatedData;
		});
	};

	const validateForm = () => {
		if (
			!formData.titulo ||
			!formData.descripcion ||
			!formData.fecha_inicio ||
			!formData.fecha_fin
		) {
			setMensaje("❌ Todos los campos son obligatorios.");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!token) {
			setMensaje("❌ No se encontró el token. Inicia sesión nuevamente.");
			return;
		}

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		const data = new FormData();
		data.append("titulo", formData.titulo);
		data.append("descripcion", formData.descripcion);
		data.append("fecha_inicio", formData.fecha_inicio);
		data.append("fecha_fin", formData.fecha_fin);
		data.append("ubicacion", `${mapPosition.lat},${mapPosition.lng}`);
		data.append("tipo", formData.tipo);
		data.append("lugar", formData.lugar);
		console.log(formData);
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
			}).then(() => {
				window.location.href = `/bicentenario-dashboard/detalle-evento/${response.data.evento.id_evento}`;
			});
		} catch (error) {
			console.error("Error al editar el evento:", error);
			setMensaje("❌ Error al editar el evento");
			if (validarSesion(error, navigate)) return;
		} finally {
			setIsSubmitting(false);
		}
	};

	// Actualización de la ubicación en el buscador al seleccionar un lugar
	const handlePlaceSelect = () => {
		const place = autocompleteRef.current.getPlace();
		if (!place.geometry) return;

		const location = place.geometry.location;
		setMapPosition({
			lat: location.lat(),
			lng: location.lng(),
		});
		setFormData((prevData) => ({
			...prevData,
			lugar: place.formatted_address,
			ubicacion: `${location.lat()},${location.lng()}`,
		}));
	};

	// Actualización de la dirección en el buscador al mover el marcador
	const handleMarkerDragEnd = async (e) => {
		const { latLng } = e;
		const lat = latLng.lat();
		const lng = latLng.lng();
		setMapPosition({ lat, lng });

		// Obtener la dirección a partir de las coordenadas
		try {
			const geocoder = new window.google.maps.Geocoder();
			const latlng = new window.google.maps.LatLng(lat, lng);
			geocoder.geocode({ location: latlng }, (results, status) => {
				if (status === "OK" && results[0]) {
					setFormData((prevData) => ({
						...prevData,
						lugar: results[0].formatted_address,
						ubicacion: `${lat},${lng}`,
					}));
				} else {
					console.error("Geocoder failed due to: " + status);
				}
			});
		} catch (error) {
			console.error("Error al geocodificar la ubicación:", error);
		}
	};

	// Cargar la API de Google Maps
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries: ["places", "geocoding"], // Agregamos la librería de geocoding
	});

	if (!isLoaded || isLoading) {
		return <div>Cargando...</div>;
	}

	return (
		<div className="container mt-4">
			<div className="row">
				<div className="col-md-6">
					<div className="accordion" id="eventoAccordion">
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
										Editar Evento
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

										<div className="mb-3">
											<label className="form-label">Descripción</label>
											<ReactQuill
												value={formData.descripcion}
												onChange={handleDescripcionChange}
												theme="snow"
												required
											/>
										</div>

										<div className="mb-3">
											<label className="form-label">Ubicación</label>
											<Autocomplete
												onLoad={(autocomplete) =>
													(autocompleteRef.current = autocomplete)
												}
												onPlaceChanged={handlePlaceSelect}
											>
												<input
													type="text"
													className="form-control"
													value={formData.lugar}
													onChange={handleChange}
													name="lugar"
													placeholder="Busca un lugar..."
												/>
											</Autocomplete>
										</div>

										<GoogleMap
											ref={mapRef}
											mapContainerStyle={{ width: "100%", height: "300px" }}
											center={mapPosition}
											zoom={17}
										>
											<MarkerF
												position={mapPosition}
												draggable
												onDragEnd={handleMarkerDragEnd}
											/>
										</GoogleMap>

										<button
											type="submit"
											className="btn btn-success"
											disabled={isSubmitting}
										>
											{isSubmitting ? "Guardando..." : "Guardar Evento"}
										</button>
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

export default EditarEvento;
