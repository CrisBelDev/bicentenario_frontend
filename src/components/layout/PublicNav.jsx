import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "font-awesome/css/font-awesome.min.css";

const PublicNav = () => {
	const navigate = useNavigate();
	const [usuario, setUsuario] = useState(
		localStorage.getItem("nombre") || null
	);
	const [rol, setRol] = useState(localStorage.getItem("userRole") || null);

	useEffect(() => {
		const handleStorageChange = () => {
			setUsuario(localStorage.getItem("nombre"));
			setRol(localStorage.getItem("userRole"));
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	const cerrarSesion = () => {
		localStorage.removeItem("tokenLogin");
		localStorage.removeItem("nombre");
		localStorage.removeItem("apellido");
		localStorage.removeItem("userRole");
		setUsuario(null);
		setRol(null);
		navigate("/login");
	};

	return (
		<>
			<header
				id="header"
				className="header d-flex align-items-center sticky-top color-menu"
			>
				<div className="container-fluid container-xl position-relative d-flex align-items-center">
					<Navbar.Brand
						as={Link}
						to="/"
						className="d-flex align-items-center me-auto"
					>
						<h1 className="sitename">Bicentenario</h1>
					</Navbar.Brand>

					<Navbar bg="" variant="" expand="lg">
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
