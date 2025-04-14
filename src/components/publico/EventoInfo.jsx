import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import usuariosAxios from "../../config/axios";
import Swal from "sweetalert2";

const EventoInfo = () => {
	const { id } = useParams();
	const [eventos, setEventos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [eventoPadre, setEventoPadre] = useState({});

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await usuariosAxios.get(`/evento-detalles/${id}`);
				const eventoBase = response.data.evento;

				setEventoPadre(eventoBase);
				console.log(response.data.evento);

				let eventoExtendido = {};

				// Evento cultural
				if (eventoBase.tipo === "cultural" && eventoBase.evento_cultural) {
					eventoExtendido = {
						titulo: eventoBase.titulo,
						fecha_inicio: eventoBase.fecha_inicio,
						fecha_finalizacion: eventoBase.fecha_fin,
						lugar: eventoBase.lugar,
						descripcion: eventoBase.evento_cultural.descripcion,
						afiche_promocional: eventoBase.imagenes,

						organizado_por: eventoBase.evento_cultural.organizado_por,
						tipo_evento: eventoBase.tipo,
					};
					console.log(eventoBase.imagenes);
				}

				if (
					eventoBase.tipo === "gastronomico" &&
					eventoBase.evento_gastronomico
				) {
					const {
						tipo_evento,
						platos_tipicos,
						cocineros,
						lugar_preparacion,
						abierto_al_publico,
						costo_entrada,
					} = eventoBase.evento_gastronomico;

					// Función para asegurar que el dato sea un array válido
					const parseArray = (data) => {
						try {
							return Array.isArray(JSON.parse(data)) ? JSON.parse(data) : [];
						} catch (error) {
							console.error("Error al parsear:", error);
							return []; // Retorna un array vacío si no se puede parsear
						}
					};

					const cocinerosList = parseArray(cocineros)
						.map((cocinero, index) => `<p>${cocinero}</p>`)
						.join("");

					const platosList = parseArray(platos_tipicos)
						.map((plato, index) => `<p> ${plato}</p>`)
						.join("");

					eventoExtendido = {
						titulo: eventoBase.titulo,
						fecha_inicio: eventoBase.fecha_inicio,
						fecha_finalizacion: eventoBase.fecha_fin,
						lugar: eventoBase.lugar,
						descripcion: `
							<p><strong>Descripción:</strong></p>
							${eventoBase.descripcion}
							<p><strong>Tipo de Evento:</strong> ${tipo_evento}</p>
							<p><strong>Platos Típicos:</strong></p>
							${platosList}
							<p><strong>Cocineros:</strong></p>
							${cocinerosList}
							<p><strong>Lugar de Preparación:</strong> ${lugar_preparacion}</p>
							<p><strong>Abierto al Público:</strong> ${abierto_al_publico ? "Sí" : "No"}</p>
							<p><strong>Costo de Entrada:</strong> ${
								costo_entrada === "0.00" ? "Gratis" : `${costo_entrada} Bs`
							}</p>
						`,
						afiche_promocional: eventoBase.imagenes,

						tipo_evento: "Evento Gastronómico",
					};
				}

				// Evento académico
				if (eventoBase.tipo === "academico" && eventoBase.evento_academico) {
					const { ponentes } = eventoBase.evento_academico;

					eventoExtendido = {
						titulo: eventoBase.titulo,
						fecha_inicio: eventoBase.fecha_inicio,
						fecha_finalizacion: eventoBase.fecha_fin,
						lugar: eventoBase.lugar,
						descripcion: `
						<p><strong>Descripcion:</strong></p>
						${eventoBase.descripcion}
              <p><strong>Modalidad:</strong> ${
								eventoBase.evento_academico.modalidad
							}</p>
              <p><strong>Organizado por:</strong> ${
								eventoBase.evento_academico.organizado_por
							}</p>
              <p><strong>Ponentes:</strong> ${JSON.parse(ponentes).join(
								", "
							)}</p>
              <p><strong>Gratuito:</strong> ${
								eventoBase.evento_academico.es_gratuito ? "Sí" : "No"
							}</p>
              <p><strong>Enlace a la sesión:</strong> <a href="${
								eventoBase.evento_academico.enlace_sesion
							}" target="_blank" rel="noreferrer">${
							eventoBase.evento_academico.enlace_sesion
						}</a></p>
              <p><strong>Requisitos:</strong> ${
								eventoBase.evento_academico.requisitos_registro
							}</p>
            `,
						afiche_promocional: eventoBase.imagenes,
						organizado_por: eventoBase.evento_academico.organizado_por,
						tipo_evento: "Evento Académico",
					};
				}

				// Evento deportivo
				if (eventoBase.tipo === "deportivo" && eventoBase.evento_deportivo) {
					const {
						categorias,
						modalidad,
						reglas,
						premios,
						equipos_participantes,
						requisitos_participacion,
						organizado_por,
					} = eventoBase.evento_deportivo;

					// Función para asegurar que el dato sea un array válido
					const parseArray = (data) => {
						try {
							return Array.isArray(JSON.parse(data)) ? JSON.parse(data) : [];
						} catch (error) {
							console.error("Error al parsear:", error);
							return []; // Retorna un array vacío si no se puede parsear
						}
					};

					eventoExtendido = {
						titulo: eventoBase.titulo,
						fecha_inicio: eventoBase.fecha_inicio,
						fecha_finalizacion: eventoBase.fecha_fin,
						lugar: eventoBase.lugar,
						descripcion: `
            <p><strong>Descripción:</strong></p>
            ${eventoBase.descripcion}
            <p><strong>Modalidad:</strong> ${modalidad}</p>
            <p><strong>Categorías:</strong> ${parseArray(categorias).join(
							", "
						)}</p>
            <p><strong>Equipos Participantes:</strong> ${parseArray(
							equipos_participantes
						).join(", ")}</p>
            <p><strong>Premios:</strong> ${parseArray(premios).join(", ")}</p>
            <p><strong>Reglas:</strong> ${reglas}</p>
            <p><strong>Requisitos de Participación:</strong> ${requisitos_participacion}</p>
            <p><strong>Organizado por:</strong> ${organizado_por}</p>
        `,
						afiche_promocional: eventoBase.imagenes,
						organizado_por: organizado_por,
						tipo_evento: "Evento Deportivo",
					};
				}

				setEventos([eventoExtendido]);
			} catch (error) {
				console.error(
					"Error al obtener los eventos:",
					error?.response?.data || error
				);
				setError("❌ No se pudo cargar la información del evento.");
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "No se pudo cargar la información del evento.",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, [id]);

	if (loading) return <div className="text-center mt-4">Cargando...</div>;
	if (error) return <div className="text-danger text-center mt-4">{error}</div>;

	return (
		<div className="fondo_eventos">
			<div className="container">
				<div className="titulo_evento">
					<h2 className="text-center mb-3 pt-4">
						📌 Cronograma de Actividades
					</h2>
					<h4 className="text-center mb-4">{eventoPadre.titulo}</h4>
				</div>
				{eventos.length > 0 ? (
					<div className="row">
						{eventos.map((evento, index) => (
							<div key={index} className="col-12 mb-4">
								<div className="card h-100 border-0 shadow-sm">
									<div className="card-header py-2">
										<h5 className="mb-0">{evento.titulo}</h5>
									</div>
									<div className="card-body p-3">
										<div className="row">
											<div className="col-md-6">
												<p className="mb-2 d-flex justify-content-between align-items-center flex-wrap">
													<span>
														<strong>📅 Desde:</strong>{" "}
														{new Date(evento.fecha_inicio).toLocaleDateString()}{" "}
														<strong>Hasta:</strong>{" "}
														{new Date(
															evento.fecha_finalizacion
														).toLocaleDateString()}
													</span>
													<span>
														<strong>🏷️ Tipo:</strong>{" "}
														<span className="badge bg-info">
															{evento.tipo_evento}
														</span>
													</span>
												</p>

												<p className="mb-1">
													<strong>📍 Lugar: </strong>
													<small>{evento.lugar}</small>
												</p>
												{evento.organizado_por && (
													<p className="mb-1">
														<strong>👥 Organizado por: </strong>
														<br />
														<small>{evento.organizado_por}</small>
													</p>
												)}

												<hr />

												<div
													className="mt-1"
													style={{ fontSize: "0.95rem" }}
													dangerouslySetInnerHTML={{
														__html: evento.descripcion,
													}}
												/>
											</div>

											{/* Solo mostrar el afiche si es un evento cultural */}

											<div
												className="col-md-6 d-flex justify-content-end flex-wrap"
												style={{ alignItems: "flex-start" }}
											>
												<img
													src={`${eventoPadre.imagenes}`}
													alt="Afiche del evento"
													className="img-fluid rounded shadow-sm"
													style={{
														width: "100%", // Esto asegura que la imagen ocupe todo el contenedor.
														height: "auto", // Mantiene la proporción original de la imagen.
														objectFit: "contain", // Asegura que la imagen no se recorte y se adapte al contenedor sin deformarse.
														marginBottom: "1rem", // Espacio debajo de la imagen si es necesario.
													}}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="alert alert-warning text-center">
						No se encontró información del evento.
					</div>
				)}
			</div>
		</div>
	);
};

export default EventoInfo;
