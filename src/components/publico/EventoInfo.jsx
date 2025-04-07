import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import usuariosAxios from "../../config/axios";
import Swal from "sweetalert2";

const EventoInfo = () => {
	const { id } = useParams();
	const [eventos, setEventos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [eventoPadre, setEventoPadre] = useState([]);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await usuariosAxios.get(`/evento-cultural/${id}`);
				const response1 = await usuariosAxios.get(`/evento/detalle/${id}`);
				setEventoPadre(response1.data.evento);
				setEventos(response.data);
			} catch (error) {
				console.error("Error al obtener los eventos:", error.response.data);
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
			<div className="container ">
				<div className="titulo_evento ">
					<h2 className="text-center mb-3 pt-4">
						📌 Cronograma de Actividades
					</h2>
					<h4 className="text-center  mb-4">{eventoPadre.titulo}</h4>
				</div>
				{eventos.length > 0 ? (
					<div className="row">
						{eventos.map((evento) => (
							<div key={evento.id_evento_cultural} className="col-19 mb-4">
								<div className="card h-100 border-0 shadow-sm">
									<div className="card-header  py-2">
										<h5 className="mb-0">{evento.titulo}</h5>
									</div>
									<div className="card-body p-3">
										<div className="row ">
											<div className="col-6">
												<p className="mb-2 d-flex justify-content-between align-items-center flex-wrap">
													<span>
														<strong>📅 Desde:</strong>{" "}
														{new Date(evento.fecha_inicio).toLocaleDateString()}
														<strong> Hasta: </strong>{" "}
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
												<p className="mb-1">
													<strong>👥 Organizado por: </strong>
													<br />
													<small>{evento.organizado_por}</small>
												</p>
												<hr />

												<div
													className="mt-1"
													style={{ fontSize: "0.95rem" }}
													dangerouslySetInnerHTML={{
														__html: evento.descripcion,
													}}
												/>
											</div>

											{evento.afiche_promocional && (
												<div className="col-6 d-flex justify-content-end flex-wrap">
													<img
														src={evento.afiche_promocional}
														alt="Afiche del evento"
														className="img-fluid rounded shadow-sm"
														style={{ maxHeight: "100%", objectFit: "cover" }}
													/>
												</div>
											)}
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
