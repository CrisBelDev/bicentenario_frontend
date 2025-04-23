import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "font-awesome/css/font-awesome.min.css"; // Asegúrate de importar los estilos de Font Awesome

const PublicNav = () => {
	const navigate = useNavigate();
	const [usuario, setUsuario] = useState(
		localStorage.getItem("nombre") || null
	);

	useEffect(() => {
		// Detectar cambios en el localStorage cuando el usuario inicia/cierra sesión
		const handleStorageChange = () => {
			setUsuario(localStorage.getItem("nombre"));
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
		setUsuario(null); // Actualizar estado para ocultar el perfil
		navigate("/login");
	};

	return (
		<>
			<header
				id="header"
				className="header d-flex align-items-center sticky-top color-menu "
			>
				<div className="container-fluid container-xl position-relative d-flex align-items-center ">
					{/* Logo */}
					<Navbar.Brand
						as={Link}
						to="/"
						className=" d-flex align-items-center me-auto"
					>
						<h1 className="sitename">Bicentenario</h1>
					</Navbar.Brand>

					{/* Menú de navegación */}
					<Navbar bg="" variant="" expand="lg">
						<Container>
							<Navbar.Toggle aria-controls="navbarResponsive">
								<i className="fa fa-bars"></i> {/* Cambia el ícono aquí */}
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

									{/* Si el usuario NO está autenticado, mostrar "Registrarse" y "Iniciar Sesión" */}
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
												<i className="fas fa-user-circle "></i> {usuario}
											</Dropdown.Toggle>
											<Dropdown.Menu>
												<Dropdown.Item as={Link} to="/perfil">
													Mi Perfil
												</Dropdown.Item>
												<Dropdown.Item as={Link} to="/configuracion">
													Configuración
												</Dropdown.Item>
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
			<div className=" navbar-border"></div>
		</>
	);
};

export default PublicNav;
