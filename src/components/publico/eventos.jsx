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

	let paginaActual = parseInt(pagina, 10);
	if (isNaN(paginaActual) || paginaActual < 1) {
		paginaActual = 1;
	}

	useEffect(() => {
		if (!pagina || isNaN(paginaActual) || paginaActual < 1) {
			navigate(`/eventos/1`, { replace: true });
		}
	}, [pagina, navigate]);

	useEffect(() => {
		const fetchEventos = async () => {
			setLoading(true);
			try {
				const response = await usuariosAxios.get("/evento/mostrarPaginas", {
					params: { page: paginaActual, limit: 6 },
				});

				const eventosBackend = response.data.eventos || [];

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

	const paginaAnterior = paginaActual > 1 ? paginaActual - 1 : 1;
	const paginaSiguiente =
		paginaActual < totalPaginas ? paginaActual + 1 : totalPaginas;

	// Estado para la búsqueda
	const [busqueda, setBusqueda] = useState("");
	const [tipo, setTipo] = useState("");
	const [modoBusqueda, setModoBusqueda] = useState(false); // activa/desactiva la paginación

	const handleBuscar = async (e) => {
		e.preventDefault();

		// Si no se ingresa nada en el campo de búsqueda pero se seleccionó un tipo, solo se busca por tipo
		const query = busqueda.trim() || ""; // Si hay algo en el campo, se mantiene, sino se pone vacío

		try {
			setLoading(true);

			// Si hay búsqueda, buscamos por título y tipo, si solo hay tipo, solo lo usamos
			const response = await usuariosAxios.get(
				`/evento-buscar`,
				{ params: { tipo, titulo: busqueda } } // Se envían tanto el tipo como el título como parámetros de consulta
			);

			const eventosConImagen = response.data.eventos.map((evento) => ({
				...evento,
				imagenes: evento.imagenes
					? evento.imagenes.split(",").map((url) => url.trim())
					: [],
			}));

			setEventos(eventosConImagen);
			setError(null);
		} catch (err) {
			setEventos([]);
			setError("No se encontraron eventos con esos criterios.");
		} finally {
			setLoading(false);
		}

		// Activar modo de búsqueda después de realizar la consulta
		setModoBusqueda(true);
	};

	const limpiarBusqueda = () => {
		setBusqueda("");
		setTipo("");
		setModoBusqueda(false);

		window.location.reload(); // Recarga la página completamente
	};

	return (
		<div className="index-page">
			<main className="main">
				<section id="eventos" className="py-5">
					<div className="container">
						<div className="borderline"></div>
						<form onSubmit={handleBuscar} className="mb-4">
							<div className="row g-2">
								<div className="col-md-6">
									<input
										type="text"
										className="form-control"
										placeholder="Buscar por título"
										value={busqueda}
										onChange={(e) => setBusqueda(e.target.value)}
									/>
								</div>
								<div className="col-md-4">
									<select
										className="form-select"
										value={tipo}
										onChange={(e) => setTipo(e.target.value)}
									>
										<option value="">Todos los tipos</option>
										<option value="cultural">Cultural</option>
										<option value="academico">Académico</option>
										<option value="deportivo">Deportivo</option>
										<option value="gastronomico">Gastronómico</option>
									</select>
								</div>
								<div className="col-md-2 d-flex gap-2">
									<button type="submit" className="btn btn-primary w-100">
										Buscar
									</button>
									{modoBusqueda && (
										<button
											type="button"
											className="btn btn-secondary"
											onClick={limpiarBusqueda}
										>
											Limpiar
										</button>
									)}
								</div>
							</div>
						</form>

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
							<div className="row gy-4 d-flex justify-content-center">
								{eventos.map((evento) => (
									<div key={evento.id_evento} className="col-12">
										<div className="card h-100 shadow-sm d-flex flex-row">
											{/* Imagen a la izquierda */}
											<div style={{ width: "40%", maxWidth: "300px" }}>
												{evento.imagenes && evento.imagenes.length > 0 ? (
													<img
														src={evento.imagenes[0]}
														className="img-fluid"
														alt={evento.titulo}
														style={{
															objectFit: "cover",
															width: "100%",
															height: "auto",
														}}
													/>
												) : (
													<img
														src="/img/no-image.jpg"
														className="img-fluid"
														alt="Sin imagen"
														style={{
															objectFit: "cover",
															width: "100%",
															height: "auto",
														}}
													/>
												)}
											</div>

											{/* Contenido a la derecha */}
											<div
												className="card-body d-flex flex-column justify-content-between"
												style={{ width: "60%" }}
											>
												<div>
													<h5 className="text-center">{evento.titulo} </h5>
													<div className="card-text mb-2">
														<div
															dangerouslySetInnerHTML={{
																__html: evento.descripcion,
															}}
														/>
													</div>
													<p className="text-muted small">
														📍{evento.lugar} <br />
														<a
															href={`https://www.google.com/maps?q=${evento.ubicacion}`}
															target="_blank"
															rel="noopener noreferrer"
														>
															Ver en Google Maps
														</a>
														<br />
														📅 {new Date(
															evento.fecha_inicio
														).toLocaleString()}{" "}
														- {new Date(evento.fecha_fin).toLocaleString()}
													</p>
												</div>
												<div className="mb-1">
													{evento.patrocinadors &&
														evento.patrocinadors.length > 0 && (
															<>
																<h6 className="fw-bold text-primary">
																	Patrocinadores:
																</h6>
																<div className="d-flex flex-wrap">
																	{evento.patrocinadors.map((patrocinador) => (
																		<div
																			key={patrocinador.id_patrocinador}
																			className="d-flex align-items-center me-4 mb-2 fw-bold"
																		>
																			<i className="bi bi-patch-check-fill text-success me-2"></i>
																			{patrocinador.nombre}
																		</div>
																	))}
																</div>
															</>
														)}
												</div>

												<div className="">
													<Link
														to={`/eventos/info/${evento.id_evento}`}
														className="btn  btn-sm btn-primary"
													>
														Ver Detalles
													</Link>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{eventos.length > 0 && !loading && !error && !modoBusqueda && (
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
