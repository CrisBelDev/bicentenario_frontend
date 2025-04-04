import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ sidebarVisible, toggleSidebar }) => {
	return (
		<ul
			className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${
				sidebarVisible ? "toggled" : ""
			}`}
			id="accordionSidebar"
		>
			{/* Sidebar - Brand */}
			<Link
				className="sidebar-brand d-flex align-items-center justify-content-center"
				to="/"
			>
				<div className="sidebar-brand-icon rotate-n-15">
					<i className="fas fa-laugh-wink"></i>
				</div>
				<div className="sidebar-brand-text mx-3">
					SB Admin <sup>2</sup>
				</div>
			</Link>

			{/* Nav Item - Dashboard */}
			<li className="nav-item active">
				<Link className="nav-link" to=".">
					<i className="fas fa-fw fa-tachometer-alt"></i>
					<span>Dashboard</span>
				</Link>
			</li>

			{/* Nav Item - Listar Usuarios */}
			<li className="nav-item">
				<Link className="nav-link" to="listar-usuarios">
					<i className="fas fa-fw fa-users"></i>
					<span>Listar Usuarios</span>
				</Link>
			</li>

			{/* Nav Item - Crear Evento */}
			<li className="nav-item">
				<Link className="nav-link" to="crear-evento">
					<i className="fas fa-fw fa-calendar-plus"></i>
					<span>Crear Evento</span>
				</Link>
			</li>

			{/* Nav Item - Listar Evento */}
			<li className="nav-item">
				<Link className="nav-link" to="listar-eventos">
					<i className="fas fa-fw fa-calendar-alt"></i>
					<span>Lista de eventos</span>
				</Link>
			</li>

			{/* Otros enlaces de navegación */}
			{/* Agregar más rutas aquí para otras secciones del dashboard */}
		</ul>
	);
};

export default Sidebar;
