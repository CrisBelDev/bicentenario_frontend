import React from "react";
import Usuarios from "../ListarUsuarios";
const Content = () => {
	return (
		<div className="container-fluid">
			{/* Page Heading */}
			<div className="d-sm-flex align-items-center justify-content-between mb-4">
				<h1 className="h3 mb-0 text-gray-800">aqui ponde xcontre</h1>
				<a
					href="#"
					className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
				>
					<i className="fas fa-download fa-sm text-white-50"></i> Generate
					Report
				</a>
			</div>

			{/* Aquí insertamos el componente Usuarios */}
			<Usuarios />
		</div>
	);
};

export default Content;
