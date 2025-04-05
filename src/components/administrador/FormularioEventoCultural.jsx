// FormularioEventoCultural.jsx
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new"; // Asegúrate de tener Quill importado
import "react-quill-new/dist/quill.snow.css"; // Estilos de Quill
import usuariosAxios from "../../config/axios"; // Cliente Axios configurado
import Swal from "sweetalert2"; // Importar SweetAlert2

const FormularioEventoCultural = ({ id_evento }) => {
	const [formData, setFormData] = useState({
		descripcion: "",
	});

	// Efecto para cargar la descripción del evento si el id_evento cambia
	useEffect(() => {
		if (id_evento) {
			// Aquí hacemos la llamada a la API para obtener los datos del evento
			usuariosAxios
				.get(`/api/eventos/${id_evento}`) // Ajusta la ruta si es necesario
				.then((response) => {
					setFormData({
						descripcion: response.data.descripcion || "", // Asegúrate de que el campo sea "descripcion"
					});
				})
				.catch((error) => console.error("Error al cargar evento:", error));
		}
	}, [id_evento]);

	// Manejador de cambios en el campo de descripción
	const handleDescripcionChange = (value) => {
		setFormData({ ...formData, descripcion: value });
	};

	// Manejador del envío del formulario (usamos Axios para enviar los datos)
	const handleSubmit = (e) => {
		e.preventDefault();

		// Añadir id_evento al formData antes de enviarlo
		const dataToSend = {
			...formData,
			id_evento, // Agregar el id_evento al objeto de datos
		};

		// Enviar los datos del formulario al backend
		usuariosAxios
			.post(`/evento-cultural`, dataToSend) // Envía el formulario con el id_evento
			.then((response) => {
				console.log("Evento registrado:", response.data);

				// Mostrar alerta de éxito con SweetAlert2
				Swal.fire({
					icon: "success",
					title: "¡Información adicional registrada exitosamente!",
					text: "El evento ha sido actualizado correctamente.",
					showConfirmButton: false,
					timer: 1500, // La alerta desaparecerá después de 1.5 segundos
				});
			})
			.catch((error) => {
				console.error("Error al registrar evento:", error);

				// Mostrar alerta de error en caso de fallo
				Swal.fire({
					icon: "error",
					title: "Error al registrar evento",
					text: "Hubo un problema al registrar la información del evento.",
				});
			});
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="mb-3">
				<label className="form-label">Descripción</label>
				<ReactQuill
					value={formData.descripcion}
					onChange={handleDescripcionChange}
					theme="snow"
					required
				/>
			</div>

			<button type="submit" className="btn btn-success">
				Registrar
			</button>
		</form>
	);
};

export default FormularioEventoCultural;
