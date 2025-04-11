import React, { useState, useEffect } from "react";
import usuariosAxios from "../../../config/axios"; // Esto es correcto si hay exportación por defecto

import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const ModalPatrocinadores = ({
	showModal,
	setShowModal,
	onSelectPatrocinadores,
}) => {
	const [patrocinadores, setPatrocinadores] = useState([]);
	const [selectedPatrocinadores, setSelectedPatrocinadores] = useState([]);

	useEffect(() => {
		const fetchPatrocinadores = async () => {
			try {
				const response = await usuariosAxios.get("/patrocinadores");
				console.log("Patrocinadores recibidos:", response.data);
				setPatrocinadores(response.data);
			} catch (error) {
				console.error("Error fetching patrocinadores:", error);
			}
		};
		fetchPatrocinadores();
	}, []);

	const handleSave = async () => {
		console.log(
			"Patrocinadores seleccionados para guardar:",
			selectedPatrocinadores
		);
		if (selectedPatrocinadores.length > 0) {
			try {
				await usuariosAxios.post("/patrocinadores", {
					patrocinadores: selectedPatrocinadores.map((patro) => patro.value),
				});
				alert("Patrocinadores guardados exitosamente");
				setShowModal(false);
			} catch (error) {
				console.error("Error saving patrocinadores:", error);
				alert("Error al guardar patrocinadores");
			}
		} else {
			console.warn("No se seleccionó ningún patrocinador.");
		}
	};

	const patrocinadoresOptions = patrocinadores.map((patro) => ({
		value: patro.id_patrocinador, // Usamos 'id_patrocinador' como 'value'
		label: patro.nombre, // 'nombre' como 'label'
	}));

	useEffect(() => {
		console.log("Opciones para Select:", patrocinadoresOptions);
	}, [patrocinadores]);

	useEffect(() => {
		console.log("Patrocinadores seleccionados:", selectedPatrocinadores);
		onSelectPatrocinadores(selectedPatrocinadores); // Pasamos el valor al componente padre
	}, [selectedPatrocinadores, onSelectPatrocinadores]);

	return (
		<>
			{showModal && (
				<>
					<div className="modal fade show d-block" tabIndex="-1">
						<div className="modal-dialog modal-xl">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title">Selecciona patrocinadores</h5>
									<button
										type="button"
										className="btn-close"
										onClick={() => setShowModal(false)}
									></button>
								</div>
								<div className="modal-body">
									<Select
										closeMenuOnSelect={false}
										components={animatedComponents}
										isMulti
										options={patrocinadoresOptions}
										value={selectedPatrocinadores}
										onChange={(selectedOptions) => {
											console.log("Cambio en el Select:", selectedOptions);
											setSelectedPatrocinadores(selectedOptions || []);
										}}
										placeholder="Busca y selecciona patrocinadores"
									/>
								</div>
								<div className="modal-footer">
									<button
										className="btn btn-secondary"
										onClick={() => setShowModal(false)}
									>
										Cerrar
									</button>
									<button className="btn btn-primary" onClick={handleSave}>
										Guardar cambios
									</button>
								</div>
							</div>
						</div>
					</div>

					<div
						className=" modal-backdrop fade show "
						onClick={() => setShowModal(false)}
					></div>
				</>
			)}
		</>
	);
};

export default ModalPatrocinadores;
