import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import usuariosAxios from "../../config/axios";

function ListarUsuarios() {
	// State para los usuarios
	const [usuarios, guardarUsuarios] = useState([]);

	//State para Datatables
	const [busqueda, setBusqueda] = useState(""); // Estado para la búsqueda
	const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);

	// Consultar API
	useEffect(() => {
		const consultarApi = async () => {
			const { data } = await usuariosAxios.get("/usuarios");
			guardarUsuarios(data);
			setUsuariosFiltrados(data);
		};
		consultarApi();
	}, []);

	// Función para filtrar usuarios
	const handleBusqueda = (e) => {
		setBusqueda(e.target.value);
		const filtro = usuarios.filter((usuario) =>
			`${usuario.nombre} ${usuario.apellido} ${usuario.correo} ${usuario.telefono}`
				.toLowerCase()
				.includes(e.target.value.toLowerCase())
		);
		setUsuariosFiltrados(filtro);
	};

	// Definir las columnas para la tabla
	const columnas = [
		{
			name: "Nombre",
			selector: (row) => `${row.nombre} ${row.apellido}`,
			sortable: true,
		},
		{
			name: "Correo",
			selector: (row) => row.correo,
			sortable: true,
		},
		{
			name: "Teléfono",
			selector: (row) => row.telefono,
		},
		{
			name: "Acciones",
			cell: (row) => (
				<div className="d-flex gap-1">
					<a href="#" className="btn btn-sm btn-primary">
						<i className="fas fa-pen-alt"></i>
					</a>
					<button type="button" className="btn btn-sm btn-danger">
						<i className="fas fa-times"></i>
					</button>
				</div>
			),
			ignoreRowClick: true,
			// Eliminamos allowOverflow y button para evitar warnings
		},
	];

	// Estilos personalizados para la tabla
	const customStyles = {
		headCells: {
			style: {
				backgroundColor: "#343a40",
				color: "white",
				fontWeight: "bold",
			},
		},
		cells: {
			style: {
				padding: "12px",
			},
		},
		rows: {
			highlightOnHoverStyle: {
				backgroundColor: "rgba(248, 120, 0, 0.692);",
			},
		},
	};

	return (
		<Fragment>
			<div className="container">
				<div className="d-flex justify-content-between align-items-center mb-3">
					<h2>Usuarios</h2>
					<Link to="/usuarios/nuevo" className="btn btn-success">
						<i className="fas fa-plus-circle"></i> Nuevo Usuario
					</Link>
				</div>

				{/* Barra de búsqueda con label */}
				<div className="mb-3">
					<label className="fw-bold text-primary">🔎 Buscar usuario:</label>
					<input
						type="text"
						className="form-control form-control-sm border-primary"
						placeholder="Escribe aquí..."
						value={busqueda}
						onChange={handleBusqueda}
					/>
				</div>
				<span className="badge bg-info fs-6">
					📌 Total de registros: {usuarios.length}
				</span>

				{/* Tabla de datos */}
				<DataTable
					columns={columnas}
					data={usuariosFiltrados}
					pagination
					highlightOnHover
					striped
					responsive
					customStyles={customStyles}
					noDataComponent="No hay usuarios disponibles"
				/>
			</div>
		</Fragment>
	);
}

export default ListarUsuarios;
