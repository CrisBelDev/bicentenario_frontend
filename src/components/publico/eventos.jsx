import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import usuariosAxios from "../../config/axios";

const Eventos = () => {
	const { pagina } = useParams();
	const navigate = useNavigate();
	const [eventos, setEventos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [totalPaginas, setTotalPaginas] = useState(1);

	// Convertir `pagina` a número asegurando que es válido
	let paginaActual = parseInt(pagina, 10);
	if (isNaN(paginaActual) || paginaActual < 1) {
		paginaActual = 1;
	}

	// Redirigir si la página en la URL no es válida
	useEffect(() => {
		if (!pagina || isNaN(paginaActual) || paginaActual < 1) {
			navigate(`/eventos/1`, { replace: true });
		}
	}, [pagina, navigate]);

	// Cargar eventos desde la API cuando cambia la página
	useEffect(() => {
		const fetchEventos = async () => {
			setLoading(true);
			try {
				const response = await usuariosAxios.get("/evento/mostrarPaginas", {
					params: { page: paginaActual, limit: 6 },
				});

				const eventosBackend = response.data.eventos || [];

				// Procesar imágenes correctamente
				const eventosProcesados = eventosBackend.map((evento) => ({
					...evento,
					imagenes: evento.imagenes
						? evento.imagenes.split(",").map((url) => url.trim())
						: [],
				}));

				setEventos(eventosProcesados);
				setTotalPaginas(response.data.totalPages || 1);
			} catch (err) {
				setError("No se pudieron cargar los eventos.");
			} finally {
				setLoading(false);
			}
		};

		fetchEventos();
	}, [pagina]);

	// Cálculo de las páginas anterior y siguiente
	const paginaAnterior = paginaActual > 1 ? paginaActual - 1 : 1;
	const paginaSiguiente =
		paginaActual < totalPaginas ? paginaActual + 1 : totalPaginas;

	return (
		<div className="index-page">
			<main className="main">
				<section id="eventos" className="py-5">
					<div className="container">
						<div className="borderline"></div>
						<h2 className="fw-bold text-center mb-4">
							Eventos del Bicentenario
						</h2>

						{loading ? (
							<p className="text-center">Cargando eventos...</p>
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
											<img
												src={evento.imagenes[0] || "/img/no-image.jpg"}
												className="card-img-top"
												alt={evento.titulo}
												style={{ height: "300px", objectFit: "cover" }}
											/>
											<div className="card-body d-flex flex-column">
												<h5 className="card-title">{evento.titulo}</h5>
												<div
													dangerouslySetInnerHTML={{
														__html: evento.descripcion,
													}}
												/>
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
												<Link
													to={`/evento/${evento.id_evento}`}
													className="btn btn-sm btn-primary w-100"
												>
													Ver Detalles
												</Link>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{/* Paginación */}
						{/* Paginación */}
						{eventos.length > 0 && !loading && !error && (
							<div className="text-center mt-4">
								<div className="d-flex justify-content-center">
									<Link
										to={`/eventos/${paginaAnterior}`}
										className={`btn btn-outline-primary me-3 ${
											paginaActual <= 1 ? "disabled" : ""
										}`}
									>
										← Anterior
									</Link>
									<span className="align-self-center mx-3">
										Página {paginaActual} de {totalPaginas}
									</span>
									<Link
										to={`/eventos/${paginaSiguiente}`}
										className={`btn btn-outline-primary ms-3 ${
											paginaActual >= totalPaginas ? "disabled" : ""
										}`}
									>
										Siguiente →
									</Link>
								</div>
							</div>
						)}
					</div>
				</section>
			</main>
		</div>
	);
};

export default Eventos;
