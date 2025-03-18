import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
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

//dasboard
import AdminDashboard from "./components/administrador/template/AdminDashboard"; // Dashboard para administradores
import LoginAdmin from "./components/administrador/LoginAdmin"; // Login para administradores
import ListarUsuarios from "./components/administrador/ListarUsuarios";
import CrearEvento from "./components/administrador/CrearEvento";
// Componente que protege rutas privadas
const PrivateRoute = ({ element }) => {
	const token = localStorage.getItem("tokenLogin");
	return token ? element : <Navigate to="/login" />; // Redirige al login si no está autenticado
};

// Componente que protege rutas para administradores
const AdminRoute = ({ element }) => {
	const token = localStorage.getItem("tokenLogin");
	const userRole = localStorage.getItem("userRole"); // Suponemos que el rol del usuario está almacenado en el localStorage

	if (token && userRole === "admin") {
		return element; // Si es administrador, permite el acceso
	} else {
		return <Navigate to="/" />; // Si no es administrador, redirige a la página principal
	}
};

// Componente que protege rutas públicas (solo redirige si está autenticado)
const PublicRoute = ({ element }) => {
	const token = localStorage.getItem("tokenLogin");
	return token ? <Navigate to="/" /> : element; // Redirige a la home si ya está autenticado
};

const App = () => {
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
					{/* Rutas hijas del dashboard */}
					<Route path="listar-usuarios" element={<ListarUsuarios />} />
					<Route path="crear-evento" element={<CrearEvento />} />
					{/* Otras rutas dentro del dashboard */}
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
