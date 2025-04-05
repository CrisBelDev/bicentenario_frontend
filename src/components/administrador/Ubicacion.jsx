import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMap } from "react-leaflet";
import L from "leaflet";

const MapUpdater = ({ position }) => {
	const map = useMap();
	React.useEffect(() => {
		map.setView(position); // Actualiza la vista del mapa a las nuevas coordenadas
	}, [position, map]);

	return null;
};

const Ubicacion = ({ ubicacion, setUbicacion, setMensaje }) => {
	const [escribeUbicacion, setEscribeUbicacion] = useState("");
	const [mapPosition, setMapPosition] = useState([0, 0]);

	// Al iniciar el componente, actualiza mapPosition si ya hay una ubicacion.
	useEffect(() => {
		if (ubicacion) {
			const coords = ubicacion
				.split(",")
				.map((coord) => parseFloat(coord.trim()));
			if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
				setMapPosition(coords);
			}
		}
	}, [ubicacion]);

	const handleUbicacionChange = (e) => {
		const { value } = e.target;
		setUbicacion(value);
		const coords = value.split(",").map((coord) => parseFloat(coord.trim()));

		if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
			setMapPosition(coords);
		} else {
			setMensaje("❌ Ubicación inválida. Usa el formato 'latitud, longitud'.");
		}
	};

	const handleSearchLocation = async () => {
		if (!escribeUbicacion) {
			setMensaje("❌ Ingresa una dirección.");
			return;
		}

		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
					escribeUbicacion
				)}&countrycodes=BO&bounded=1&viewbox=-69.3,-22.9,-57.4,-9.5`
			);
			const data = await response.json();

			if (data.length > 0) {
				const { lat, lon } = data[0];
				setMapPosition([parseFloat(lat), parseFloat(lon)]);
				setUbicacion(`${lat}, ${lon}`);
				setMensaje("✅ Ubicación encontrada.");
			} else {
				setMensaje("❌ No se encontró la dirección.");
			}
		} catch (error) {
			setMensaje("❌ Error al buscar la dirección.");
		}
	};

	return (
		<div>
			<div className="mb-3">
				<label className="form-label">Ubicación (Latitud, Longitud)</label>
				<input
					type="text"
					className="form-control"
					name="ubicacion"
					value={ubicacion}
					onChange={handleUbicacionChange}
					placeholder="Ejemplo: 12.3456, -76.5432"
					required
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">O escribe la dirección</label>
				<input
					type="text"
					className="form-control"
					name="escribeUbicacion"
					placeholder="Si prefieres, escribe la dirección"
					value={escribeUbicacion}
					onChange={(e) => setEscribeUbicacion(e.target.value)}
				/>
			</div>
			<button
				type="button"
				className="btn btn-info mt-2"
				onClick={handleSearchLocation}
			>
				🔍 Buscar Dirección
			</button>

			<div className="mb-3">
				{/* Mapa */}
				<MapContainer
					center={mapPosition}
					zoom={16}
					style={{ height: "400px", width: "100%" }}
				>
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					<Marker
						position={mapPosition}
						draggable={true}
						eventHandlers={{
							dragend: (event) => {
								const { lat, lng } = event.target.getLatLng();
								setMapPosition([lat, lng]);
								setUbicacion(`${lat}, ${lng}`);
							},
						}}
					>
						<Popup>Ubicación seleccionada</Popup>
					</Marker>

					<MapUpdater position={mapPosition} />
				</MapContainer>
			</div>
		</div>
	);
};

export default Ubicacion;
