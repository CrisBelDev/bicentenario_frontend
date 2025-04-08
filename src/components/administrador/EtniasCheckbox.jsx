import React, { useState, useEffect } from "react";
import usuariosAxios from "../../config/axios"; // Cliente Axios configurado

const EtniasCheckbox = () => {
	const [etnias, setEtnias] = useState([]); // Mantener las etnias cargadas
	const [selectedEtnias, setSelectedEtnias] = useState([]); // Estado para las etnias seleccionadas
	const [enviar_check, setEnviar_check] = useState([]);
	useEffect(() => {
		// Cargar las etnias desde el backend
		const fetchEtnias = async () => {
			try {
				const response = await usuariosAxios.get("/etnias"); // Asegúrate de que esta ruta esté correcta
				console.log("Etnias cargadas desde el backend:", response.data); // Ver las etnias que se cargan desde el backend
				setEtnias(response.data); // Establecer las etnias desde la respuesta
			} catch (error) {
				console.error("Error al cargar las etnias:", error);
			}
		};

		fetchEtnias();
	}, []); // Solo se ejecuta una vez cuando el componente se monta

	// Maneja el cambio de selección en los checkboxes
	const handleCheckboxChange = (e) => {
		const { value, checked } = e.target;
		let updatedEtnias = [...selectedEtnias];

		// Buscar la etnia correspondiente
		const selectedEtnia = etnias.find((etnia) => etnia.nombre === value);

		if (checked) {
			updatedEtnias.push({
				id_etnia: selectedEtnia.id_etnia,
				nombre: selectedEtnia.nombre,
			}); // Añadir la etnia seleccionada con su id y nombre
		} else {
			updatedEtnias = updatedEtnias.filter(
				(etnia) => etnia.id_etnia !== selectedEtnia.id_etnia
			); // Eliminar la etnia desmarcada
		}
		setEnviar_check(updatedEtnias);
		console.log("Etnias seleccionadas después del cambio:", updatedEtnias); // Ver las etnias seleccionadas después de un cambio
		setSelectedEtnias(updatedEtnias); // Actualiza el estado con las etnias seleccionadas
	};

	return (
		<div>
			<label className="form-label">Selecciona las etnias</label>
			<div>
				{etnias.length > 0 ? (
					etnias.map((etnia) => (
						<div key={etnia.id_etnia}>
							<input
								type="checkbox"
								id={`etnia-${etnia.id_etnia}`}
								value={etnia.nombre} // Usar el nombre de la etnia como valor
								checked={selectedEtnias.some(
									(etniaSeleccionada) =>
										etniaSeleccionada.id_etnia === etnia.id_etnia
								)}
								onChange={handleCheckboxChange} // Usar handleCheckboxChange para manejar los cambios
							/>
							<label htmlFor={`etnia-${etnia.id_etnia}`}>{etnia.nombre}</label>
						</div>
					))
				) : (
					<p>Cargando etnias...</p>
				)}
			</div>

			{/* Mostrar las etnias seleccionadas */}
			<div>
				<h3>Etnias seleccionadas:</h3>
				<ul>
					{selectedEtnias.map((etnia, index) => (
						<li key={index}>
							ID: {etnia.id_etnia}, Nombre: {etnia.nombre}
						</li> // Mostrar el id_etnia y nombre
					))}
				</ul>
			</div>
		</div>
	);
};

export default EtniasCheckbox;
