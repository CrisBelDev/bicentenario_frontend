import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const PrivateNav = () => {
	return (
		<Navbar bg="dark" variant="dark" expand="lg">
			<Navbar.Brand as={Link} to="/dashboard">
				Dashboard
			</Navbar.Brand>
			<Nav className="ml-auto">
				<Nav.Link as={Link} to="/usuarios">
					Usuarios
				</Nav.Link>
				<Button variant="outline-light">Cerrar sesión</Button>
			</Nav>
		</Navbar>
	);
};

export default PrivateNav;
