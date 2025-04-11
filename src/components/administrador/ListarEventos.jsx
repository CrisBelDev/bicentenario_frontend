import React, { useEffect, useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import usuariosAxios from "../../config/axios";
import { validarSesion } from "../../utils/ValidarSesion";
import Swal from "sweetalert2"; // Importa SweetAlert

function ListarEventos() {
	const [eventos, setEventos] = useState([]);
	const [busqueda, setBusqueda] = useState("");
	const [eventosFiltrados, setEventosFiltrados] = useState([]);
	const [cargando, setCargando] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("tokenLogin");
		if (!token) {
			navigate("/");
			return;
		}

		const consultarApi = async () => {
			setCargando(true);
			try {
				const { data } = await usuariosAxios.get("/evento/mostrar");
				console.log("Datos recibidos del backend:", data);
				if (Array.isArray(data.eventos)) {
					setEventos(data.eventos);
					setEventosFiltrados(data.eventos);
				} else {
					console.error("Error: La API no devuelve un array");
					setEventos([]);
					setEventosFiltrados([]);
				}
			} catch (error) {
				if (validarSesion(error, navigate)) return;
				console.error("Error al obtener los eventos:", error);
			} finally {
				setCargando(false);
			}
		};

		consultarApi();
	}, [navigate]);

	const handleBusqueda = (e) => {
		const valorBusqueda = e.target.value.toLowerCase();
		setBusqueda(valorBusqueda);
		const filtro = eventos.filter((evento) =>
			`${evento.titulo} ${evento.descripcion} ${evento.tipo}`
				.toLowerCase()
				.includes(valorBusqueda)
		);
		setEventosFiltrados(filtro);
	};

	const formatearFecha = (fecha) =>
		fecha ? new Date(fecha).toLocaleString() : "Sin fecha";

	const handleEliminarEvento = async (id_evento) => {
		// Mostrar SweetAlert de confirmación
		console.log("el id es: ", id_evento);
		const result = await Swal.fire({
			title: "¿Estás seguro?",
			text: "¡Este evento será eliminado permanentemente!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
		});

		// Si el usuario confirma, eliminar el evento
		if (result.isConfirmed) {
			try {
				await usuariosAxios.delete(`/evento/eliminar/${id_evento}`);
				Swal.fire("Eliminado", "El evento ha sido eliminado", "success");

				// Actualizar la lista de eventos
				setEventos(eventos.filter((evento) => evento.id_evento !== id_evento));
				setEventosFiltrados(
					eventosFiltrados.filter((evento) => evento.id_evento !== id_evento)
				);
			} catch (error) {
				Swal.fire("Error", "Hubo un error al eliminar el evento", "error");
				console.error("Error al eliminar el evento:", error);
			}
		}
	};

	const columnas = [
		{
			name: "Título",
			selector: (row) => row.titulo,
			sortable: true,
		},
		{
			name: "Fecha Inicio",
			selector: (row) => formatearFecha(row.fecha_inicio),
		},
		{
			name: "Fecha Fin",
			selector: (row) => formatearFecha(row.fecha_fin),
		},
		{
			name: "Tipo",
			selector: (row) => row.tipo,
		},
		{
			name: "Acciones",
			cell: (row) => (
				<div className="d-flex gap-1">
					<button
						onClick={() =>
							(window.location.href = `/bicentenario-dashboard/detalle-evento/${row.id_evento}`)
						}
						className="btn btn-sm btn-primary"
					>
						<i className="fas fa-pen-alt"></i>
					</button>

					<button
						type="button"
						className="btn btn-sm btn-danger"
						onClick={() => handleEliminarEvento(row.id_evento)}
					>
						<i className="fas fa-times"></i>
					</button>
				</div>
			),
			ignoreRowClick: true,
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
		cells: {
			style: {
				padding: "12px",
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
			<div className="container-sm">
				<div className="d-flex justify-content-between align-items-center mb-3">
					<h2>Eventos</h2>
					<Link to="/eventos/nuevo" className="btn btn-success">
						<i className="fas fa-plus-circle"></i> Nuevo Evento
					</Link>
				</div>

				<div className="mb-3">
					<label className="fw-bold text-primary">🔎 Buscar evento:</label>
					<input
						type="text"
						className="form-control form-control-sm border-primary"
						placeholder="Escribe aquí..."
						value={busqueda}
						onChange={handleBusqueda}
					/>
				</div>

				<span className="badge bg-info fs-6">
					📌 Total de registros: {eventosFiltrados.length}
				</span>

				<DataTable
					columns={columnas}
					data={eventosFiltrados}
					pagination
					highlightOnHover
					striped
					responsive
					customStyles={customStyles}
					noDataComponent="No hay eventos disponibles"
				/>
			</div>
		</Fragment>
	);
}

export default ListarEventos;
