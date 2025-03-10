import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
	return (
		<div className="container mt-5">
			<h2>Bienvenido al Dashboard</h2>
			<p>Desde aquí podrás gestionar tu perfil, hacer compras y más.</p>

			<div className="d-flex flex-column gap-3">
				<Link to="/perfil" className="btn btn-primary">
					Mi Perfil
				</Link>
				<Link to="/carrito" className="btn btn-warning">
					Carrito de Compras
				</Link>
				<Link to="/productos" className="btn btn-info">
					Ver Productos
				</Link>
			</div>
		</div>
	);
};

export default Dashboard;
