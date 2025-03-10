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
import Usuarios from "./components/usuarios/Usuarios";
import NuevoUsuario from "./components/usuarios/NuevoUsuario";
import Productos from "./components/productos/Productos";
import HomePage from "./components/publico/HomePage";
import ConfirmarCuenta from "./components/usuarios/ConfirmarCuenta";
import Login from "./components/usuarios/login";
import Prueba from "./components/usuarios/prueba";
import Dashboard from "./components/usuarios/dashboard";

// Componente que protege rutas privadas
const PrivateRoute = ({ element }) => {
	const token = localStorage.getItem("tokenLogin");
	return token ? element : <Navigate to="/login" />; // Redirige al login si no está autenticado
};

// Componente que protege rutas públicas
const PublicRoute = ({ element }) => {
	const token = localStorage.getItem("tokenLogin");
	return token ? <Navigate to="/" /> : element; // Redirige a la home si ya está autenticado
};

const App = () => {
	return (
		<Router>
			{/* Mostrar siempre PublicNav para usuarios normales */}
			<PublicNav />

			<div className="">
				<Routes>
					{/* Rutas públicas */}
					<Route path="/" element={<HomePage />} />
					<Route path="/productos" element={<Productos />} />

					{/* Usar PublicRoute para proteger el acceso a registro y confirmar cuenta */}
					<Route
						path="/registro"
						element={<PublicRoute element={<NuevoUsuario />} />}
					/>
					<Route
						path="/confirmarcuenta"
						element={<PublicRoute element={<ConfirmarCuenta />} />}
					/>

					<Route path="/login" element={<PublicRoute element={<Login />} />} />
					<Route path="/prueba" element={<Prueba />} />

					<Route path="/usuarios" element={<Usuarios />} />

					{/* Ruta protegida para usuarios autenticados */}
					<Route
						path="/dashboard"
						element={<PrivateRoute element={<Dashboard />} />}
					/>
				</Routes>
			</div>
		</Router>
	);
};

export default App;
