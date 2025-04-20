import React, { useEffect, useState, Fragment } from "react";
import DataTable from "react-data-table-component";
import usuariosAxios from "../../config/axios";
import { validarSesion } from "../../utils/ValidarSesion";
import { useNavigate } from "react-router-dom";

function AsignarRoles() {
	const [usuarios, setUsuarios] = useState([]);
	const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
	const [busqueda, setBusqueda] = useState("");
	const [cargando, setCargando] = useState(false);
	const [mensajeExito, setMensajeExito] = useState(""); // Estado para el mensaje de éxito

	const token = localStorage.getItem("tokenLogin");
	const navigate = useNavigate();

	// Roles definidos manualmente
	const [roles] = useState([
		{ id_rol: 1, nombre: "casual" },
		{ id_rol: 2, nombre: "cultural" },
		{ id_rol: 3, nombre: "academico" },
		{ id_rol: 6, nombre: "administrador" },
		{ id_rol: 7, nombre: "deportivo" },
		{ id_rol: 8, nombre: "gastronomico" },
	]);

	useEffect(() => {
		if (!token) {
			navigate("/");
			return;
		}

		const fetchData = async () => {
			setCargando(true);
			try {
				const resUsuarios = await usuariosAxios.get("/usuarios", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setUsuarios(resUsuarios.data);
				setUsuariosFiltrados(resUsuarios.data);
			} catch (error) {
				if (validarSesion(error, navigate)) return;
				console.error("Error al cargar usuarios:", error);
			} finally {
				setCargando(false);
			}
		};

		fetchData();
	}, [token, navigate]);

	const handleBusqueda = (e) => {
		const texto = e.target.value.toLowerCase();
		setBusqueda(texto);
		const filtrados = usuarios.filter((u) =>
			`${u.nombre} ${u.apellido} ${u.correo} ${u.telefono}`
				.toLowerCase()
				.includes(texto)
		);
		setUsuariosFiltrados(filtrados);
	};

	const handleCambioRol = async (id_usuario, nuevoRolId) => {
		try {
			await usuariosAxios.put(
				"/cambiarrol",
				{ id_usuario, nuevoRolId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			// Actualizar el rol en la UI
			setUsuarios((prev) =>
				prev.map((u) =>
					u.id_usuario === id_usuario ? { ...u, rol_id: nuevoRolId } : u
				)
			);
			setUsuariosFiltrados((prev) =>
				prev.map((u) =>
					u.id_usuario === id_usuario ? { ...u, rol_id: nuevoRolId } : u
				)
			);

			// Mostrar el mensaje de éxito
			setMensajeExito("¡Rol actualizado correctamente!");
			// Ocultar el mensaje después de 3 segundos
			setTimeout(() => {
				setMensajeExito("");
			}, 3000);
		} catch (error) {
			console.error("Error al cambiar el rol:", error);
			alert("No se pudo cambiar el rol del usuario.");
		}
	};

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
			name: "Rol",
			cell: (row) => (
				<div className="d-flex gap-2 align-items-center">
					<select
						className="form-select form-select-sm"
						value={row.rol_id}
						onChange={(e) =>
							handleCambioRol(row.id_usuario, parseInt(e.target.value))
						}
					>
						{roles.map((rol) => (
							<option key={rol.id_rol} value={rol.id_rol}>
								{rol.nombre}
							</option>
						))}
					</select>
				</div>
			),
		},
	];

	const customStyles = {
		headCells: {
			style: {
				backgroundColor: "#343a40",
				color: "white",
				fontWeight: "bold",
			},
		},
		rows: {
			highlightOnHoverStyle: {
				backgroundColor: "rgba(248, 120, 0, 0.692)",
			},
		},
	};

	return (
		<Fragment>
			<div className="container">
				<h2 className="mb-3">Asignar Roles</h2>

				{/* Mostrar mensaje de éxito */}
				{mensajeExito && (
					<div className="alert alert-success" role="alert">
						{mensajeExito}
					</div>
				)}

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

				<DataTable
					columns={columnas}
					data={usuariosFiltrados}
					pagination
					highlightOnHover
					striped
					responsive
					customStyles={customStyles}
					progressPending={cargando}
					noDataComponent="No hay usuarios disponibles"
				/>
			</div>
		</Fragment>
	);
}

export default AsignarRoles;
