import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Cambié useHistory por useNavigate
import usuariosAxios from "../../config/axios"; // Asegúrate de tener la configuración correcta de axios

const Eventos = () => {
	const { pagina } = useParams(); // Obtiene la página de los parámetros de la URL
	const navigate = useNavigate(); // Usamos useNavigate en lugar de useHistory
	const [eventos, setEventos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [totalPaginas, setTotalPaginas] = useState(1); // Para almacenar el número total de páginas

	// Asegurarse de que la página es un número entero válido
	const paginaActual = parseInt(pagina) || 1; // Si pagina es NaN, usamos 1 como valor predeterminado

	// Función para cargar los eventos
	useEffect(() => {
		const fetchEventos = async () => {
			try {
				const response = await usuariosAxios.get("/evento/mostrarPaginas", {
					params: { page: paginaActual, limit: 6 }, // Llamada a la API para obtener eventos por página
				});

				console.log("Eventos paginados:", response.data.eventos);

				const eventosBackend = response.data.eventos;

				if (!Array.isArray(eventosBackend)) {
					throw new Error("El formato de eventos no es un array");
				}

				// Procesar las imágenes
				const eventosProcesados = eventosBackend.map((evento) => ({
					...evento,
					imagenes: evento.imagenes
						? evento.imagenes.split(",").map((url) => url.trim())
						: [],
				}));

				setEventos(eventosProcesados);
				setTotalPaginas(response.data.totalPages); // Suponiendo que la respuesta incluye totalPaginas
			} catch (err) {
				console.error("Error al traer eventos:", err);
				setError("No se pudieron cargar los eventos.");
			} finally {
				setLoading(false);
			}
		};

		fetchEventos();
	}, [paginaActual]); // Vuelve a hacer la petición cuando cambie la página

	// Determinar las páginas siguiente y anterior
	const paginaAnterior = paginaActual > 1 ? paginaActual - 1 : 1;
	const paginaSiguiente =
		paginaActual < totalPaginas ? paginaActual + 1 : totalPaginas;

	// Si la página es inválida, redirigir a la primera página
	useEffect(() => {
		if (paginaActual > totalPaginas) {
			navigate("/eventos/1"); // Cambié history.push por navigate
		}
	}, [paginaActual, totalPaginas, navigate]);

	return (
		<div className="index-page">
			<main className="main">
				{/* Eventos */}
				<section id="eventos" className="py-5">
					<div className="container">
						<div className="borderline"></div>
						<h2 className="fw-bold text-center mb-4">
							Eventos del Bicentenario
						</h2>

						{loading ? (
							<div className="text-center">
								<div
									className="spinner-border text-primary"
									role="status"
								></div>
								<p className="mt-2">Cargando eventos...</p>
							</div>
						) : error ? (
							<div className="alert alert-danger text-center">{error}</div>
						) : eventos.length === 0 ? (
							<p className="text-center">
								No hay eventos disponibles en este momento.
							</p>
						) : (
							<div className="row gy-4">
								{eventos.map((evento) => (
									<div key={evento.id_evento} className="col-md-6 col-lg-4">
										<div className="card h-100 shadow-sm">
											{evento.imagenes && evento.imagenes.length > 0 ? (
												<img
													src={evento.imagenes[0]}
													className="card-img-top"
													alt={evento.titulo}
													style={{ height: "300px", objectFit: "cover" }}
												/>
											) : (
												<img
													src="/img/no-image.jpg"
													className="card-img-top"
													alt="Sin imagen"
													style={{ height: "200px", objectFit: "cover" }}
												/>
											)}

											<div className="card-body d-flex flex-column">
												<h5 className="card-title">{evento.titulo}</h5>
												<div className="card-text">
													<div
														dangerouslySetInnerHTML={{
															__html: evento.descripcion,
														}}
													/>
												</div>
												<p className="text-muted small mt-auto">
													📍 {evento.ubicacion} <br />
													📅{" "}
													{new Date(
														evento.fecha_inicio
													).toLocaleDateString()} -{" "}
													{new Date(evento.fecha_fin).toLocaleDateString()}
												</p>
											</div>

											<div className="card-footer bg-white border-0">
												<a
													href={`/evento/${evento.id_evento}`}
													className="btn btn-sm btn-primary w-100"
												>
													Ver Detalles
												</a>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{/* Navegación de páginas */}
						<div className="text-center mt-4">
							<div className="d-flex justify-content-center">
								<Link
									to={`/eventos/${paginaAnterior}`}
									className="btn btn-outline-primary me-3"
									disabled={paginaActual <= 1}
								>
									Anterior
								</Link>
								<span className="align-self-center">
									Página {paginaActual} de {totalPaginas}
								</span>
								<Link
									to={`/eventos/${paginaSiguiente}`}
									className="btn btn-outline-primary ms-3"
									disabled={paginaActual >= totalPaginas}
								>
									Siguiente
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
};

export default Eventos;
