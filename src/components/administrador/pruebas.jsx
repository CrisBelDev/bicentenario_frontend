import React, { useState } from "react";
import usuariosAxios from "../../config/axios";
import Swal from "sweetalert2";
import FormularioEventoCultural from "./FormularioEventoCultural";

const ContenedorFormularioCultural = ({ id_evento }) => {
	const [formDataCultural, setFormDataCultural] = useState({
		titulo: "",
		tipoEvento: "",
		fechaInicio: "",
		fechaFin: "",
		lugar: "",
		organizadoPor: "",
		afichePromocional: null,
		descripcion: "",
	});

	const handleSubmitCultural = (e) => {
		e.preventDefaultCultural();

		const formDataCulturalToSend = new FormData();
		formDataCulturalToSend.append("id_evento", 76);
		formDataCulturalToSend.append("titulo", formDataCultural.titulo);
		formDataCulturalToSend.append("tipoEvento", formDataCultural.tipoEvento);
		formDataCulturalToSend.append("fechaInicio", formDataCultural.fechaInicio);
		formDataCulturalToSend.append("fechaFin", formDataCultural.fechaFin);
		formDataCulturalToSend.append("lugar", formDataCultural.lugar);
		formDataCulturalToSend.append(
			"organizadoPor",
			formDataCultural.organizadoPor
		);
		formDataCulturalToSend.append("descripcion", formDataCultural.descripcion);

		if (formDataCultural.afichePromocional) {
			formDataCulturalToSend.append(
				"afichePromocional",
				formDataCultural.afichePromocional
			);
		}

		usuariosAxios
			.post("/evento-cultural", formDataCulturalToSend, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				console.log("Evento registrado:", response.data);
				Swal.fire({
					icon: "success",
					title: "¡Evento cultural registrado exitosamente!",
					text: "El evento ha sido registrado correctamente.",
					showConfirmButton: false,
					timer: 1500,
				});
			})
			.catch((error) => {
				console.error("Error al registrar evento:", error);
				Swal.fire({
					icon: "error",
					title: "Error al registrar evento",
					text: "Hubo un problema al registrar la información del evento.",
				});
			});
	};

	return (
		<FormularioEventoCultural
			formData={formDataCultural}
			setFormData={setFormDataCultural}
			onSubmit={handleSubmitCultural}
		/>
	);
};

export default ContenedorFormularioCultural;
