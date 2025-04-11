// src/components/eventos/Ubicacion.jsx
import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
	width: "100%",
	height: "400px",
};

const defaultCenter = {
	lat: -16.5, // Latitud por defecto (puedes cambiar esto)
	lng: -68.15, // Longitud por defecto
};

const UbicacionMapa = ({ ubicacion, setUbicacion, setMensaje }) => {
	const [markerPosition, setMarkerPosition] = useState(defaultCenter);

	// Cargar la API de Google Maps
	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey:
			import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
			process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
	});

	// Convertir la ubicación de string a coordenadas
	useEffect(() => {
		if (ubicacion) {
			const [lat, lng] = ubicacion.split(",").map(Number);
			if (!isNaN(lat) && !isNaN(lng)) {
				setMarkerPosition({ lat, lng });
			}
		}
	}, [ubicacion]);

	const onMapClick = useCallback(
		(e) => {
			const newLat = e.latLng.lat();
			const newLng = e.latLng.lng();
			const newUbicacion = `${newLat},${newLng}`;
			setMarkerPosition({ lat: newLat, lng: newLng });
			setUbicacion(newUbicacion);
			setMensaje("📍 Ubicación actualizada");
		},
		[setUbicacion, setMensaje]
	);

	if (loadError) return <div>Error al cargar el mapa</div>;
	if (!isLoaded) return <div>Cargando mapa...</div>;

	return (
		<div className="mb-3">
			<label className="form-label">Ubicación</label>
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={markerPosition}
				zoom={15}
				onClick={onMapClick}
			>
				<Marker
					position={markerPosition}
					draggable={true}
					onDragEnd={(e) => {
						const lat = e.latLng.lat();
						const lng = e.latLng.lng();
						const newUbicacion = `${lat},${lng}`;
						setMarkerPosition({ lat, lng });
						setUbicacion(newUbicacion);
						setMensaje("📍 Marcador actualizado");
					}}
				/>
			</GoogleMap>
			<small className="form-text text-muted">
				Haz clic en el mapa o mueve el marcador para actualizar la ubicación.
			</small>
		</div>
	);
};

export default UbicacionMapa;
