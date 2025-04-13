import React, { useState, useEffect, useRef } from "react";
import {
	GoogleMap,
	MarkerF,
	useJsApiLoader,
	Autocomplete,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import usuariosAxios from "../../config/axios";
import { validarSesion } from "../../utils/ValidarSesion";
import Swal from "sweetalert2";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import ModalPatrocinadores from "./helpers/ModalPatrocinadores";

//aqui van los formularios dinamicos
import ContenedorFormularioCultural from "./ContenedorFormularioCultural";
import ContenedorFormularioGastronomico from "./ContenedorFormularioGastronomico ";
import ContenedorFormularioAcademico from "./ContenedorFormularioAcademico";
import ContenedorFormularioDeportivo from "./ContenedorFormularioDeportivo ";
//---------------------------------
const containerStyle = {
	width: "100%",
	height: "400px",
};

const defaultCenter = {
	lat: -16.504774678561407,
	lng: -68.12995721673195,
};

const CrearEvento = () => {
	const [showModal, setShowModal] = useState(false);
	const [selectedPatrocinadores, setSelectedPatrocinadores] = useState([]);
	const [id_evento, setIdEvento] = useState(null);

	const handlePatrocinadoresSelect = (selectedOptions) => {
		setSelectedPatrocinadores(selectedOptions);
	};
	const [formData, setFormData] = useState({
		titulo: "",
		descripcion: "",
		fecha_inicio: "",
		fecha_fin: "",
		ubicacion: "",
		imagenes: null,
		tipo: "",
		lugar: "",
	});

	const [mensaje, setMensaje] = useState("");
	const [mapPosition, setMapPosition] = useState(defaultCenter);
	const [escribeUbicacion, setEscribeUbicacion] = useState("");
	const [autocomplete, setAutocomplete] = useState(null);
	const [geocoder, setGeocoder] = useState(null);
	const [isApiLoaded, setIsApiLoaded] = useState(false);
	const markerRef = useRef(null);
	const navigate = useNavigate();
	const token = localStorage.getItem("tokenLogin");

	useEffect(() => {
		if (!token) navigate("/");
	}, [token, navigate]);

	// Usamos el cargador para cargar la API de Google Maps y la biblioteca "places" de forma dinámica
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries: ["places", "geometry"],
	});

	useEffect(() => {
		if (isLoaded) {
			const loadPlacesLibrary = async () => {
				try {
					const { places } = await google.maps.importLibrary("places");
					const geo = new window.google.maps.Geocoder();
					setGeocoder(geo);
					setIsApiLoaded(true);
				} catch (error) {
					console.error("Error cargando la biblioteca places", error);
				}
			};
			loadPlacesLibrary();
		}
	}, [isLoaded]);

	const handleChange = (e) => {
		const { name, value, type, files } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "file" ? files[0] : value,
		}));
	};

	const handleDescripcionChange = (value) => {
		setFormData((prev) => ({ ...prev, descripcion: value }));
	};

	const handleUbicacionChange = (e) => {
		const { value } = e.target;
		console.log("data ", value);
		setFormData((prev) => ({ ...prev, lugar: value }));
		setEscribeUbicacion(value);
	};

	const handleMapClick = (e) => {
		const lat = e.latLng.lat();
		const lng = e.latLng.lng();
		setMapPosition({ lat, lng });
		setFormData((prev) => ({ ...prev, ubicacion: `${lat}, ${lng}` }));
		if (geocoder) {
			geocoder.geocode({ location: { lat, lng } }, (results, status) => {
				if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
					setEscribeUbicacion(results[0].formatted_address || "");
					setMensaje("✅ Ubicación seleccionada correctamente.");
				} else {
					setMensaje("❌ No se pudo obtener la dirección.");
				}
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!token) return setMensaje("❌ No se encontró el token. Inicia sesión.");

		const data = new FormData();
		Object.keys(formData).forEach((key) => {
			if (formData[key]) data.append(key, formData[key]);
		});
		if (selectedPatrocinadores.length > 0) {
			data.append("patrocinadores", JSON.stringify(selectedPatrocinadores));
		}

		try {
			console.log("data ", data);
			const res = await usuariosAxios.post("/evento/registrar", data, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});

			setIdEvento(res.data.evento.id_evento);

			if (res.status === 201 && res.data && res.data.evento) {
				const { isConfirmed } = await Swal.fire({
					title: "¡Evento creado!",
					text: "¿Quieres continuar con el siguiente paso?",
					icon: "success",
					showCancelButton: true,
					confirmButtonText: "Sí",
					cancelButtonText: "No",
				});

				if (isConfirmed) {
					navigate(
						`/bicentenario-dashboard/detalle-evento/${res.data.evento.id_evento}`
					);
				}

				setFormData({
					titulo: "",
					descripcion: "",
					fecha_inicio: "",
					fecha_fin: "",
					ubicacion: "",
					imagenes: null,
					tipo: "",
					lugar: "",
				});
			} else {
				setMensaje("❌ Hubo un problema con el servidor. Intenta nuevamente.");
			}
		} catch (error) {
			console.error("Error al crear el evento:", error);
			setMensaje("❌ Error al crear el evento");
			validarSesion(error, navigate);
		}
	};

	return (
		<>
			<ModalPatrocinadores
				showModal={showModal}
				setShowModal={setShowModal}
				onSelectPatrocinadores={handlePatrocinadoresSelect}
			/>
			<div className="container mt-4">
				<div className="row">
					{/* Columna izquierda - formulario actual */}
					<div className="col-md-6">
						<div className="card mb-4 shadow">
							<div className="card-header bg-primary text-white">
								<h3>Crear Evento</h3>
							</div>
							<div className="card-body">
								<form onSubmit={handleSubmit}>
									<div className="mb-3">
										<label className="form-label">Título</label>
										<input
											type="text"
											className="form-control"
											name="titulo"
											value={formData.titulo}
											onChange={handleChange}
										/>
									</div>
									<div className="mb-3">
										<label className="form-label">Tipo de Evento</label>
										<select
											className="form-control"
											name="tipo"
											value={formData.tipo}
											onChange={handleChange}
										>
											<option value="">Seleccione el tipo de evento</option>
											<option value="academico">Académico</option>
											<option value="cultural">Cultural</option>
											<option value="deportivo">Deportivo</option>
											<option value="gastronomico">Gastronomico</option>
										</select>
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

									<div className="row mb-3">
										<div className="col-md-6">
											<label className="form-label">Fecha de Inicio</label>
											<input
												type="datetime-local"
												className="form-control"
												name="fecha_inicio"
												value={formData.fecha_inicio}
												onChange={handleChange}
											/>
										</div>

										<div className="col-md-6">
											<label className="form-label">
												Fecha de Finalización
											</label>
											<input
												type="datetime-local"
												className="form-control"
												name="fecha_fin"
												value={formData.fecha_fin}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className="mb-4">
										<hr />
										<div className="d-flex justify-content-between align-items-center mb-2">
											<h5 className="mb-0 text-primary">Patrocinadores</h5>
											<button
												className="btn btn-primary d-flex align-items-center ml-1 px-4 py-2 rounded-pill shadow-sm"
												onClick={() => setShowModal(true)}
												type="button"
											>
												<i className="bi bi-plus-circle mr-2"></i>
												Agregar Patrocinadores
											</button>
										</div>
										<p className="text-muted">
											Patrocinadores seleccionados:{" "}
											<span className="fw-semibold text-dark">
												{selectedPatrocinadores.length}
											</span>
										</p>
										<hr />
									</div>

									<div className="mb-3">
										<label className="form-label">
											Ubicación (buscador de Google)
										</label>
										{isLoaded && (
											<Autocomplete
												onLoad={(auto) => setAutocomplete(auto)}
												onPlaceChanged={() => {
													if (autocomplete) {
														const place = autocomplete.getPlace();
														if (place.geometry && place.geometry.location) {
															const lat = place.geometry.location.lat();
															const lng = place.geometry.location.lng();
															setMapPosition({ lat, lng });
															setFormData((prev) => ({
																...prev,
																ubicacion: `${lat}, ${lng}`,
																lugar: place.formatted_address,
															}));
															setEscribeUbicacion(
																place.formatted_address || ""
															);
															setMensaje(
																"✅ Ubicación seleccionada correctamente."
															);
														} else {
															setMensaje("❌ No se pudo obtener la ubicación.");
														}
													}
												}}
											>
												<input
													type="text"
													name="lugar"
													className="form-control"
													placeholder="Escribe una dirección..."
													value={escribeUbicacion}
													onChange={handleUbicacionChange}
												/>
											</Autocomplete>
										)}
									</div>

									<div className="mt-3">
										{isLoaded && (
											<GoogleMap
												mapContainerStyle={containerStyle}
												center={mapPosition}
												zoom={15}
												onClick={handleMapClick}
											>
												<MarkerF
													position={mapPosition}
													draggable
													onDragEnd={handleMapClick}
													ref={markerRef}
												/>
											</GoogleMap>
										)}
									</div>

									<div className="mt-3">
										<label className="form-label">Imagen del Evento</label>
										<input
											type="file"
											className="form-control"
											name="imagenes"
											onChange={handleChange}
										/>
									</div>

									<div className="mt-4">
										<button type="submit" className="btn btn-primary">
											Crear Evento
										</button>
									</div>
									{mensaje && (
										<div className="alert alert-info mt-3">{mensaje}</div>
									)}
								</form>
							</div>
						</div>
					</div>

					{/* Columna derecha - contenido adicional */}
					<div className="col-md-6">
						<div className="card mb-4 shadow">
							<div className="card-header bg-secondary text-white">
								<h4>Formulario adicional</h4>
							</div>
							<div className="card-body">
								{/* Aquí puedes agregar más formularios u otros componentes */}
								{formData.tipo === "cultural" && (
									<ContenedorFormularioCultural id_evento={id_evento} />
								)}
								{formData.tipo === "gastronomico" && (
									<ContenedorFormularioGastronomico id_evento={id_evento} />
								)}
								{formData.tipo === "academico" && (
									<ContenedorFormularioAcademico id_evento={id_evento} />
								)}
								{formData.tipo === "deportivo" && (
									<ContenedorFormularioDeportivo id_evento={id_evento} />
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CrearEvento;
