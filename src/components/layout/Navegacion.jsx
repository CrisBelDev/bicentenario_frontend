import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

const Navegacion = () => {
	return (
		<Navbar bg="dark" variant="dark" expand="lg">
			<Container>
				<Navbar.Brand as={Link} to="/">
					Mi App
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto">
						<Nav.Link as={Link} to="/">
							home
						</Nav.Link>
						<Nav.Link as={Link} to="/productos">
							Productos
						</Nav.Link>
						<Nav.Link as={Link} to="/usuarios/nuevo">
							Sig up
						</Nav.Link>
						<Nav.Link as={Link} to="/usuarios/nuevo">
							Login
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Navegacion;
