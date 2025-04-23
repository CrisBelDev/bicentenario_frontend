// src/components/Agenda.jsx
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import usuariosAxios from "../../config/axios";

const Agenda = () => {
	const [eventos, setEventos] = useState([]);

	// Colores para los tipos de eventos
	const tipoClasesBootstrap = {
		gastronomico: "bg-success-subtle text-success",
		deportivo: "bg-primary-subtle text-primary",
		cultural: "bg-warning-subtle text-dark",
		academico: "bg-info-subtle text-dark",
	};

	useEffect(() => {
		const obtenerEventos = async () => {
			try {
				const res = await usuariosAxios.get("evento/mostrar");
				const eventosAPI = res.data.eventos;

				// Formateo de los eventos con clases dinámicas
				const eventosFormateados = eventosAPI.map((e) => ({
					id: e.id_evento,
					title: e.titulo,
					start: e.fecha_inicio,
					end: e.fecha_fin,
					extendedProps: {
						descripcion: e.descripcion,
						lugar: e.lugar,
						tipo: e.tipo,
						imagen: e.imagenes,
					},
				}));

				setEventos(eventosFormateados);
			} catch (error) {
				console.error("Error al cargar eventos:", error);
			}
		};

		obtenerEventos();
	}, []);

	const manejarClick = (info) => {
		const { title, extendedProps } = info.event;
		const descripcion = extendedProps.descripcion.replace(
			/<\/?[^>]+(>|$)/g,
			"" // Quitar HTML
		);
		alert(
			`📌 ${title}\n📍 Lugar: ${extendedProps.lugar}\n🎭 Tipo: ${extendedProps.tipo}\n📝 Descripción: ${descripcion}`
		);
	};

	// Función para marcar el día de hoy
	const esHoy = (date) => {
		const today = new Date();
		const currentDate = new Date(date); // Asegúrate de que `date` sea un objeto Date
		return today.toDateString() === currentDate.toDateString();
	};

	return (
		<>
			<div className="fondo"></div>
			<div className="container mt-5 agenda-container">
				<h2 className="text-2xl font-bold mb-4">Agenda de Eventos</h2>
				<div className="row">
					{/* Columna para el calendario */}
					<div className="col-12">
						<div className="p-4">
							<FullCalendar
								plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
								initialView="dayGridMonth"
								headerToolbar={{
									left: "prev,next today",
									center: "title",
									right: "dayGridMonth,timeGridWeek,timeGridDay",
								}}
								events={eventos}
								eventClick={manejarClick}
								height="auto"
								locale="es"
								// Colorear el día de hoy
								dayCellClassNames={(date) =>
									esHoy(date.date) ? "today-cell-highlight" : ""
								} // Cambié 'date' por 'date.date'
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Agenda;
