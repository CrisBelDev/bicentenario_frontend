import React from "react";

const Usuario = ({ usuario }) => {
	return (
		<li className="list-group-item d-flex justify-content-between align-items-center">
			<div>
				<h5 className="mb-1">
					{usuario.nombre} {usuario.apellido}
				</h5>
				<p className="mb-1">{usuario.correo}</p>
				<p className="mb-0">Tel: {usuario.telefono}</p>
			</div>
			<div>
				<a href="#" className="btn btn-primary me-2">
					<i className="fas fa-pen-alt"></i> Editar
				</a>
				<button type="button" className="btn btn-danger">
					<i className="fas fa-times"></i> Eliminar
				</button>
			</div>
		</li>
	);
};

export default Usuario;
