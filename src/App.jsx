import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Swal from "sweetalert2"; // Instala con `npm install sweetalert2`

import PublicNav from "./components/layout/PublicNav";
import PrivateNav from "./components/layout/PrivateNav";

// Componentes
import NuevoUsuario from "./components/usuarios/NuevoUsuario";
import Productos from "./components/productos/Productos";
import HomePage from "./components/publico/HomePage";
import ConfirmarCuenta from "./components/usuarios/ConfirmarCuenta";
import Login from "./components/usuarios/login";
import RecuperarPassword from "./components/usuarios/RecuperarPassword";
import CambiarPassword from "./components/usuarios/CambiarPassword";
import Dashboard from "./components/usuarios/dashboard";
import Eventos from "./components/publico/eventos";
// Dashboard
import AdminDashboard from "./components/administrador/template/AdminDashboard";
import LoginAdmin from "./components/administrador/LoginAdmin";
import ListarUsuarios from "./components/administrador/ListarUsuarios";
import CrearEvento from "./components/administrador/CrearEvento";

// Función para verificar si el token ha expirado
// Función para verificar si el token ha expirado
const isTokenExpired = (token) => {
	try {
		const decoded = jwtDecode(token);
		if (!decoded.exp) return true;

		const currentTime = Date.now() / 1000; // Convertimos el tiempo actual a segundos
		const isExpired = decoded.exp < currentTime;

		// Log para ver el tiempo de expiración y la comparación
		console.log("Tiempo actual:", currentTime);
		console.log("Expiración del token:", decoded.exp);
		console.log("¿Token expirado?", isExpired ? "Sí" : "No");

		return isExpired;
	} catch (error) {
		return true;
	}
};

// Componente que protege rutas privadas
const PrivateRoute = ({ element }) => {
	const token = localStorage.getItem("tokenLogin");
	return token && !isTokenExpired(token) ? element : <Navigate to="/login" />;
};

// Componente que protege rutas para administradores
const AdminRoute = ({ element }) => {
	const token = localStorage.getItem("tokenLogin");
	const userRole = localStorage.getItem("userRole");

	if (token && userRole === "admin" && !isTokenExpired(token)) {
		return element;
	} else {
		return <Navigate to="/" />;
	}
};

// Componente que protege rutas públicas
const PublicRoute = ({ element }) => {
	const token = localStorage.getItem("tokenLogin");
	return token && !isTokenExpired(token) ? <Navigate to="/" /> : element;
};

const App = () => {
	useEffect(() => {
		const checkTokenExpiration = () => {
			const token = localStorage.getItem("tokenLogin");

			if (token) {
				const expired = isTokenExpired(token);

				// Log para ver si el token está expirado
				console.log(
					"Verificando expiración del token:",
					expired ? "Expirado" : "Válido"
				);

				if (expired) {
					// Mostrar alerta con SweetAlert2
					Swal.fire({
						icon: "warning",
						title: "Sesión Expirada",
						text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
						confirmButtonText: "Aceptar",
						backdrop: "static", // Impide que se cierre al hacer clic fuera de la alerta
						allowOutsideClick: false, // No permite cerrar la alerta al hacer clic fuera
					}).then((result) => {
						if (result.isConfirmed) {
							// Borrar datos del usuario y redirigir al login
							localStorage.removeItem("tokenLogin");
							localStorage.removeItem("userRole");
							localStorage.removeItem("userName");
							localStorage.removeItem("nombre");
							localStorage.removeItem("apellido");
							window.location.reload(); // Refresca la página
						}
					});
				}
			}
		};

		checkTokenExpiration(); // Verificar al cargar la app

		// Configurar un intervalo para verificar periódicamente
		const interval = setInterval(checkTokenExpiration, 60000); // Cada 1 minuto= 60000

		return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
	}, []);

	return (
		<Router>
			<Routes>
				{/* Rutas públicas */}
				<Route
					path="/"
					element={
						<>
							<PublicNav />
							<HomePage />
						</>
					}
				/>
				<Route
					path="/eventos" // Corrige la ruta aquí
					element={
						<>
							<PublicNav />
							<Eventos />
						</>
					}
				/>

				<Route
					path="/eventos/:pagina" // Ahora recibe un parámetro 'pagina'
					element={
						<>
							<PublicNav />
							<Eventos />
						</>
					}
				/>

				<Route
					path="/productos"
					element={
						<>
							<PublicNav />
							<Productos />
						</>
					}
				/>
				<Route
					path="/registro"
					element={
						<>
							<PublicNav />
							<NuevoUsuario />
						</>
					}
				/>
				<Route
					path="/confirmarcuenta"
					element={
						<>
							<PublicNav />
							<ConfirmarCuenta />
						</>
					}
				/>
				<Route
					path="/login"
					element={
						<>
							<PublicNav />
							<Login />
						</>
					}
				/>
				<Route path="/recuperar-password" element={<RecuperarPassword />} />
				<Route path="/cambiarpassword/" element={<CambiarPassword />} />

				{/* Rutas para usuarios logueados */}
				<Route
					path="/dashboard"
					element={<PrivateRoute element={<Dashboard />} />}
				/>

				{/* Rutas del dashboard para administradores */}
				<Route
					path="/bicentenario-dashboard"
					element={<AdminRoute element={<AdminDashboard />} />}
				>
					<Route path="listar-usuarios" element={<ListarUsuarios />} />
					<Route path="crear-evento" element={<CrearEvento />} />
				</Route>

				{/* Login exclusivo para administradores */}
				<Route
					path="/admin-login"
					element={<PublicRoute element={<LoginAdmin />} />}
				/>
			</Routes>
		</Router>
	);
};

export default App;
