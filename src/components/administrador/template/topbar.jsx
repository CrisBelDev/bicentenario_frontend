import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Topbar = ({ toggleSidebar }) => {
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = useState(false);

	// Obtener datos del administrador desde localStorage
	const nombre = localStorage.getItem("nombre") || "Administrador";
	const apellido = localStorage.getItem("apellido") || "";

	// Función para cerrar sesión
	const handleLogout = () => {
		localStorage.removeItem("tokenLogin");
		localStorage.removeItem("userRole");
		localStorage.removeItem("nombre");
		localStorage.removeItem("apellido");

		navigate("/"); // Redirige a la pantalla de login
	};

	// Alternar el estado del dropdown
	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	return (
		<nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
			{/* Sidebar Toggle (Topbar) */}
			<button
				id="sidebarToggleTop"
				className="btn btn-link d-md-none rounded-circle mr-3"
				onClick={toggleSidebar}
			>
				<i className="fa fa-bars"></i>
			</button>

			{/* Topbar Navbar */}
			<ul className="navbar-nav ml-auto">
				{/* Nav Item - User Information */}
				<li className="nav-item dropdown no-arrow">
					<button
						className="nav-link dropdown-toggle btn btn-link"
						onClick={toggleDropdown}
						aria-expanded={dropdownOpen}
					>
						<span className="mr-2 d-none d-lg-inline text-gray-600 small">
							{nombre} {apellido}
						</span>
						<img
							className="img-profile rounded-circle"
							src="/img/favicon.png"
							alt="Perfil"
						/>
					</button>

					{/* Dropdown - User Information */}
					{dropdownOpen && (
						<div className="dropdown-menu dropdown-menu-right shadow animated--grow-in show">
							<a className="dropdown-item" href="#">
								<i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
								Perfil
							</a>
							<a className="dropdown-item" href="#">
								<i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
								Configuraciones
							</a>
							<div className="dropdown-divider"></div>
							<button className="dropdown-item" onClick={handleLogout}>
								<i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
								Cerrar sesión
							</button>
						</div>
					)}
				</li>
			</ul>
		</nav>
	);
};

export default Topbar;
