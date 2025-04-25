import { Navbar, Nav, Container, Dropdown, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import usuariosAxios from "../../config/axios"; // Usamos tu instancia personalizada
import "font-awesome/css/font-awesome.min.css";

const PublicNav = () => {
	const navigate = useNavigate();
	const [usuario, setUsuario] = useState(
		localStorage.getItem("nombre") || null
	);
	const [rol, setRol] = useState(localStorage.getItem("userRole") || null);
	const [notificaciones, setNotificaciones] = useState([]);
	const [noLeidas, setNoLeidas] = useState(0);

	useEffect(() => {
		const handleStorageChange = () => {
			setUsuario(localStorage.getItem("nombre"));
			setRol(localStorage.getItem("userRole"));
		};
		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	useEffect(() => {
		const fetchNotificaciones = async () => {
			const id_usuario = localStorage.getItem("idUsuario");
			console.log("ID Usuario:", id_usuario);
			if (!id_usuario) return;

			try {
				const { data } = await usuariosAxios.get(
					`/notificacion/usuario/${id_usuario}`
				);
				console.log("Notificaciones:", data);

				// Accedemos a data.notificaciones que es un array
				if (data && Array.isArray(data.notificaciones)) {
					setNotificaciones(data.notificaciones);
					setNoLeidas(data.notificaciones.filter((n) => !n.leido).length);
				} else {
					console.error("Las notificaciones no son un array esperado.");
				}
			} catch (error) {
				console.error("Error al obtener notificaciones:", error);
			}
		};

		if (usuario) {
			fetchNotificaciones();
		}
	}, [usuario]);

	const cerrarSesion = () => {
		localStorage.removeItem("tokenLogin");
		localStorage.removeItem("nombre");
		localStorage.removeItem("apellido");
		localStorage.removeItem("userRole");
		localStorage.removeItem("id_usuario");
		setUsuario(null);
		setRol(null);
		navigate("/login");
	};

	const irADetalleEvento = (id_evento, id) => {
		// Marcar la notificación como leída
		const marcarComoLeida = async () => {
			try {
				await usuariosAxios.put(`/notificacion/leida/${id}`);
				// Actualizar el estado local para reflejar el cambio
				setNotificaciones((prevNotificaciones) =>
					prevNotificaciones.map((n) =>
						n.id_evento === id_evento ? { ...n, leido: true } : n
					)
				);
				setNoLeidas((prevNoLeidas) => prevNoLeidas - 1);
			} catch (error) {
				console.error("Error al marcar la notificación como leída:", error);
			}
		};

		marcarComoLeida();

		window.location.href = `/eventos/info/${id_evento}`;
	};

	return (
		<>
			<header className="header d-flex align-items-center sticky-top color-menu">
				<div className="container-fluid container-xl position-relative d-flex align-items-center">
					<Navbar.Brand
						as={Link}
						to="/"
						className="d-flex align-items-center me-auto"
					>
						<h1 className="sitename">Bicentenario</h1>
					</Navbar.Brand>

					<Navbar expand="lg">
						<Container>
							<Navbar.Toggle aria-controls="navbarResponsive">
								<i className="fa fa-bars"></i>
							</Navbar.Toggle>
							<Navbar.Collapse id="navbarResponsive">
								<Nav className="ms-auto">
									<Nav.Link as={Link} to="/" className="active">
										Home
									</Nav.Link>
									<Nav.Link as={Link} to="/eventos">
										Eventos
									</Nav.Link>
									<Nav.Link as={Link} to="/agenda">
										Agenda
									</Nav.Link>
									<Nav.Link as={Link} to="#portfolio">
										Portfolio
									</Nav.Link>
									<Nav.Link as={Link} to="#team">
										Team
									</Nav.Link>
									<Nav.Link as={Link} to="#contact">
										Contact
									</Nav.Link>

									{usuario && (
										<Dropdown align="end" className="me-3">
											<Dropdown.Toggle
												variant="light"
												id="dropdown-notificaciones"
											>
												<i className="fas fa-bell"></i>
												{noLeidas > 0 && (
													<Badge bg="danger" className="ms-1">
														{noLeidas}
													</Badge>
												)}
											</Dropdown.Toggle>
											<Dropdown.Menu
												className="mt-4"
												style={{
													maxHeight: "400px",
													overflowY: "auto",
													width: "350px",
												}}
											>
												{notificaciones.length === 0 ? (
													<Dropdown.Item>
														No tienes notificaciones
													</Dropdown.Item>
												) : (
													notificaciones
														.slice(0, 15) // Mostrar solo las primeras 15
														.map(
															(n) => (
																console.log("Notificación:", n),
																(
																	<Dropdown.Item
																		key={n.id}
																		onClick={() =>
																			irADetalleEvento(n.id_evento, n.id)
																		}
																		style={{
																			whiteSpace: "normal",
																			fontSize: "0.875rem", // más pequeño que el normal
																			lineHeight: "1.2",
																			borderBottom: "2px solid #ddd",
																		}}
																	>
																		<div
																			style={{
																				fontWeight: n.leido ? "normal" : "bold",
																			}}
																		>
																			{n.mensaje}
																		</div>
																	</Dropdown.Item>
																)
															)
														)
												)}
												{notificaciones.length > 15 && (
													<Dropdown.Item
														as={Link}
														to="/notificaciones"
														className="text-center text-primary fw-semibold"
													>
														Ver todas las notificaciones
													</Dropdown.Item>
												)}
											</Dropdown.Menu>
										</Dropdown>
									)}

									{!usuario ? (
										<>
											<Nav.Link as={Link} to="/registro">
												Registrarse
											</Nav.Link>
											<Nav.Link as={Link} to="/login">
												Iniciar Sesión
											</Nav.Link>
										</>
									) : (
										<Dropdown align="end">
											<Dropdown.Toggle variant="warning" id="dropdown-perfil">
												<i className="fas fa-user-circle"></i> {usuario}
											</Dropdown.Toggle>
											<Dropdown.Menu className="mt-4">
												{rol === "normal" || !rol ? (
													<a href="/perfil" className="dropdown-item">
														Mi Perfil
													</a>
												) : (
													<a
														href="/bicentenario-dashboard"
														className="dropdown-item"
													>
														Bicentenario Dashboard
													</a>
												)}
												<a href="/configuracion" className="dropdown-item">
													Configuración
												</a>
												<Dropdown.Divider />
												<Dropdown.Item onClick={cerrarSesion}>
													Cerrar Sesión
												</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									)}
								</Nav>
							</Navbar.Collapse>
						</Container>
					</Navbar>
				</div>
			</header>
			<div className="navbar-border"></div>
		</>
	);
};

export default PublicNav;
