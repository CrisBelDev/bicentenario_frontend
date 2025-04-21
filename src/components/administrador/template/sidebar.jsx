import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ sidebarVisible, toggleSidebar }) => {
	const userRole = localStorage.getItem("userRole");

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

			{/* Dashboard (disponible para todos los roles) */}
			<li className="nav-item active">
				<Link className="nav-link" to=".">
					<i className="fas fa-fw fa-tachometer-alt"></i>
					<span>Dashboard</span>
				</Link>
			</li>

			{/* Asignar roles (solo para administradores) */}
			{userRole === "administrador" && (
				<li className="nav-item">
					<Link
						className="nav-link d-flex align-items-center gap-2"
						to="asignar-roles"
					>
						<i className="fas fa-users fa-fw"></i>
						<span>Asignar roles</span>
					</Link>
				</li>
			)}

			{/* Listar Usuarios (administrador y cultural, por ejemplo) */}
			{["administrador", "cultural"].includes(userRole) && (
				<li className="nav-item">
					<Link className="nav-link" to="listar-usuarios">
						<i className="fas fa-fw fa-users"></i>
						<span>Listar Usuarios</span>
					</Link>
				</li>
			)}

			{/* Crear Evento */}
			<li className="nav-item">
				<Link
					className="nav-link"
					to="#"
					onClick={(e) => {
						e.preventDefault();
						window.location.href = "/bicentenario-dashboard/crear-evento";
					}}
				>
					<i className="fas fa-fw fa-calendar-plus"></i>
					<span>Crear Evento</span>
				</Link>
			</li>

			{/* Lista de eventos */}
			{["administrador", "cultural"].includes(userRole) && (
				<li className="nav-item">
					<Link className="nav-link" to="listar-eventos">
						<i className="fas fa-fw fa-calendar-alt"></i>
						<span>Lista de eventos</span>
					</Link>
				</li>
			)}
		</ul>
	);
};

export default Sidebar;
