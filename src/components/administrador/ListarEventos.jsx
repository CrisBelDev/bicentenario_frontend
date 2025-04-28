import React, { useEffect, useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import usuariosAxios from "../../config/axios";
import { validarSesion } from "../../utils/ValidarSesion";
import Swal from "sweetalert2";
// reportes
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable"; // Correcto import de autoTable
import logo from "../../assets/logo.png"; // Asegúrate que el logo esté en assets

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

	const formatearFecha = (fecha) =>
		fecha ? new Date(fecha).toLocaleDateString() : "Sin fecha";

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

	const handleEliminarEvento = async (id_evento) => {
		const result = await Swal.fire({
			title: "¿Estás seguro?",
			text: "¡Este evento será eliminado permanentemente!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
		});

		if (result.isConfirmed) {
			try {
				await usuariosAxios.delete(`/evento/eliminar/${id_evento}`);
				Swal.fire("Eliminado", "El evento ha sido eliminado", "success");

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

	// ✅ Exportar PDF de todos los eventos
	const exportarPDF = () => {
		const doc = new jsPDF();

		// Logo (si tienes uno)
		if (logo) {
			doc.addImage(logo, "PNG", 10, 10, 30, 30);
		}

		// Título
		doc.setFontSize(18);
		doc.text("Reporte de Eventos Bicentenario", 50, 20);

		// Fecha de generación
		doc.setFontSize(11);
		doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 50, 30);

		// Tabla de eventos
		autoTable(doc, {
			startY: 50,
			head: [["Título", "Fecha Inicio", "Fecha Fin", "Tipo"]],
			body: eventosFiltrados.map((evento) => [
				evento.titulo,
				formatearFecha(evento.fecha_inicio),
				formatearFecha(evento.fecha_fin),
				evento.tipo,
			]),
			styles: { fontSize: 10 },
			headStyles: { fillColor: [0, 123, 255] },
		});

		doc.save("reporte_eventos.pdf");
	};

	// ✅ Exportar PDF por tipo de evento
	const exportarPorTipo = () => {
		const doc = new jsPDF();
		const tipos = [...new Set(eventosFiltrados.map((evento) => evento.tipo))];

		let y = 50; // posición inicial Y

		// Logo
		if (logo) {
			doc.addImage(logo, "PNG", 10, 10, 30, 30);
		}

		// Título general
		doc.setFontSize(18);
		doc.text("Reporte por Tipo de Evento", 50, 20);

		// Fecha de generación
		doc.setFontSize(11);
		doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 50, 30);

		tipos.forEach((tipo) => {
			doc.setFontSize(14);
			doc.text(`${tipo}`, 14, y); // el tipo de evento
			y += 6; // pequeño espacio después del título

			const columnas = ["Título", "Fecha Inicio", "Fecha Fin"];
			const body = eventosFiltrados
				.filter((evento) => evento.tipo === tipo)
				.map((evento) => [
					evento.titulo,
					formatearFecha(evento.fecha_inicio),
					formatearFecha(evento.fecha_fin),
				]);

			autoTable(doc, {
				startY: y,
				head: [columnas],
				body: body,
				styles: { fontSize: 8 },
				headStyles: { fillColor: [0, 123, 255] },
				columnStyles: {
					0: { cellWidth: 60 },
					1: { cellWidth: 60 },
					2: { cellWidth: 60 },
				},
				margin: { left: 14, right: 14 },
				pageBreak: "auto",
				didDrawPage: (data) => {
					y = data.cursor.y + 10; // actualizar Y al final de la tabla
				},
			});
		});

		doc.save("reporte_tipo_evento.pdf");
	};

	// ✅ Exportar PDF con detalles completos de cada evento
	const exportarDetalleCompleto = () => {
		const doc = new jsPDF();

		// Logo (si tienes uno)
		if (logo) {
			doc.addImage(logo, "PNG", 10, 10, 30, 30);
		}

		// Título
		doc.setFontSize(18);
		doc.text("Reporte Detalle Completo de Eventos", 50, 20);

		// Fecha de generación
		doc.setFontSize(11);
		doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 50, 30);

		// Detalles de cada evento
		eventosFiltrados.forEach((evento, index) => {
			doc.setFontSize(14);
			doc.text(`Evento ${index + 1}: ${evento.titulo}`, 50, 40 + index * 60);

			doc.setFontSize(12);
			doc.text(`Descripción: ${evento.descripcion}`, 50, 50 + index * 60);
			doc.text(
				`Fecha Inicio: ${formatearFecha(evento.fecha_inicio)}`,
				50,
				55 + index * 60
			);
			doc.text(
				`Fecha Fin: ${formatearFecha(evento.fecha_fin)}`,
				50,
				60 + index * 60
			);
			doc.text(`Tipo: ${evento.tipo}`, 50, 65 + index * 60);
		});

		doc.save("reporte_detalle_completo_eventos.pdf");
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

					<div className="d-flex gap-2">
						<button className="btn btn-danger mb-3" onClick={exportarPDF}>
							📄 Exportar Todos los Eventos
						</button>

						<button className="btn btn-warning mb-3" onClick={exportarPorTipo}>
							📊 Exportar por Tipo
						</button>

						<button
							className="btn btn-info mb-3"
							onClick={exportarDetalleCompleto}
						>
							📝 Exportar Detalle Completo
						</button>

						<Link to="/eventos/nuevo" className="btn btn-success">
							<i className="fas fa-plus-circle"></i> Nuevo Evento
						</Link>
					</div>
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

				<span className="badge bg-info fs-6 mb-2">
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
