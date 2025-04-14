import React, { useEffect, useState } from "react";
import usuariosAxios from "../../config/axios";
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import ChatN8N from "../agente/ChatN8N";
const HomePage = () => {
	const [eventos, setEventos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagina, setPagina] = useState(1);

	useEffect(() => {
		const fetchEventos = async () => {
			try {
				const response = await usuariosAxios.get("/evento/mostrarPaginas", {
					params: { page: pagina, limit: 6 },
				});

				console.log("Eventos paginados:", response.data.eventos);

				const eventosBackend = response.data.eventos;

				if (!Array.isArray(eventosBackend)) {
					throw new Error("El formato de eventos no es un array");
				}

				// Convertimos imagenes string en array
				const eventosProcesados = eventosBackend.map((evento) => ({
					...evento,
					imagenes: evento.imagenes
						? evento.imagenes.split(",").map((url) => url.trim())
						: [],
				}));

				setEventos(eventosProcesados);
			} catch (err) {
				console.error("Error al traer eventos:", err);
				setError("No se pudieron cargar los eventos.");
			} finally {
				setLoading(false);
			}
		};

		fetchEventos();
	}, [pagina]); // Rehacer la petición cada vez que cambie la página

	const siguientePagina = () => setPagina(pagina + 1);
	const paginaAnterior = () => setPagina(pagina - 1);

	return (
		<div className="index-page">
			<main className="main">
				{/* banner */}
				<section
					id="hero"
					className="d-flex align-items-center justify-content-center bg-dark text-white"
					style={{
						minHeight: "80vh",
						backgroundImage: "url('/img/home.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						position: "relative", // Para poder posicionar el overlay
					}}
				>
					{/* Capa opaca */}
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0, 0, 0, 0.33)", // Capa semi-transparente negra
							zIndex: 1, // Para que la capa esté por encima de la imagen
						}}
					/>

					{/* Contenido del banner */}
					<div
						className="container text-center"
						data-aos="fade-up"
						style={{ position: "relative", zIndex: 2 }}
					>
						<h1 className=" fw-bold mb-3 titulo-banner">
							BICENTENARIO DE BOLIVIA
						</h1>

						<p className="lead mx-auto" style={{ maxWidth: "600px" }}>
							En este Bicentenario, celebramos 200 años de independencia,
							libertad y unidad. ¡Feliz Bicentenario, Bolivia!
						</p>
						<a href="#eventos" className="btn btn-primary btn-lg mt-3">
							Ver Eventos
						</a>
					</div>
				</section>

				{/* About */}
				<section id="about" className="py-5 bg-light">
					<div className="container">
						<div className="text-center mb-5">
							<h2 className="fw-bold">Sobre Nosotros</h2>
							<p className="text-muted">
								Aprende más sobre quiénes somos y lo que hacemos.
							</p>
						</div>

						<div className="row align-items-center gy-4">
							<div className="col-lg-6">
								<p>
									Somos una organización dedicada a promover la cultura y
									historia boliviana en el marco de la celebración de nuestro
									Bicentenario.
								</p>
								<ul className="list-unstyled">
									<li className="d-flex align-items-start mb-3">
										<i className="bi bi-check2-circle text-success fs-4 me-2"></i>
										<span>
											Eventos culturales y educativos en todo el país.
										</span>
									</li>
									<li className="d-flex align-items-start mb-3">
										<i className="bi bi-check2-circle text-success fs-4 me-2"></i>
										<span>
											Fomento de la diversidad y el patrimonio cultural.
										</span>
									</li>
								</ul>
							</div>

							<div className="col-lg-6">
								<p>
									Trabajamos junto a organizaciones locales, artistas y líderes
									comunitarios para asegurar que esta celebración sea inclusiva
									y representativa de todas las voces bolivianas.
								</p>
								<a href="#eventos" className="btn btn-outline-primary mt-3">
									Leer más <i className="bi bi-arrow-right ms-1"></i>
								</a>
							</div>
						</div>
					</div>
				</section>
				{/* Eventos */}
				<section id="eventos" className="py-5">
					<div className="container">
						<div className="borderline"></div>
						<h2 className="fw-bold text-center mb-4">Eventos del Destacados</h2>

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

						{/* Botón para ver más eventos (redirige a eventos-list con la página siguiente) */}
						<div className="text-center mt-4">
							<Link to={`/eventos`} className="btn btn-primary">
								Ver más eventos
							</Link>
						</div>
					</div>
				</section>
				<ChatN8N />
			</main>
		</div>
	);
};

export default HomePage;
