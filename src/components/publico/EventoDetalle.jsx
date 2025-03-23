import React from "react";
import { useParams } from "react-router-dom";

const EventoDetalle = () => {
	// Obtener el id de la URL
	const { id_evento } = useParams();

	return <h2>Detalle del Evento: {id_evento}</h2>;
};

export default EventoDetalle;
