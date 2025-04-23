// src/components/Agenda.jsx
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import usuariosAxios from "../../config/axios";

const Agenda = () => {
	const [eventos, setEventos] = useState([]);

	useEffect(() => {
		const obtenerEventos = async () => {
			try {
				const res = await usuariosAxios.get("evento/mostrar");
				const eventosAPI = res.data.eventos;

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
			""
		); // quitar HTML
		alert(
			`📌 ${title}\n📍 Lugar: ${extendedProps.lugar}\n🎭 Tipo: ${extendedProps.tipo}\n📝 Descripción: ${descripcion}`
		);
	};

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Agenda de Eventos</h2>
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
				locale="es" // Opcional si quieres en español
			/>
		</div>
	);
};

export default Agenda;
