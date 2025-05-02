import React, { useState, useEffect } from "react";
import usuariosAxios from "../../../config/axios";

import CreatableSelect from "react-select/creatable";
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
				console.log(
					"Guardando patrocinadores:",
					selectedPatrocinadores.map((patro) => patro.value)
				);
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
		value: patro.id_patrocinador,
		label: patro.nombre,
	}));

	const handleCreatePatrocinador = async (inputValue) => {
		try {
			// Crear el nuevo patrocinador
			const response = await usuariosAxios.post("/patrocinadores", {
				nombre: inputValue,
			});

			const nuevo = response.data; // Esperamos que contenga { id_patrocinador, nombre }

			const newOption = {
				value: nuevo.id_patrocinador,
				label: nuevo.nombre,
			};

			// Agregar a la lista y seleccionar
			setPatrocinadores([...patrocinadores, nuevo]);
			setSelectedPatrocinadores([...selectedPatrocinadores, newOption]);
		} catch (error) {
			console.error("Error al crear nuevo patrocinador:", error);
			alert("No se pudo crear el patrocinador.");
		}
	};

	useEffect(() => {
		onSelectPatrocinadores(selectedPatrocinadores);
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
									<CreatableSelect
										closeMenuOnSelect={false}
										components={animatedComponents}
										isMulti
										options={patrocinadoresOptions}
										value={selectedPatrocinadores}
										onChange={(selectedOptions) => {
											setSelectedPatrocinadores(selectedOptions || []);
										}}
										onCreateOption={handleCreatePatrocinador}
										placeholder="Busca o crea patrocinadores"
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
						className="modal-backdrop fade show"
						onClick={() => setShowModal(false)}
					></div>
				</>
			)}
		</>
	);
};

export default ModalPatrocinadores;
