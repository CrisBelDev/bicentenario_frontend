import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usuariosAxios from "../../config/axios"; // Ajusta según tu configuración de axios
import ReactQuill from "react-quill-new"; // Asegúrate de que esta es la versión correcta
import "react-quill-new/dist/quill.snow.css"; // Estilos de Quill
import ImageUploader from "quill-image-uploader"; // Importar el módulo

// Registrar el módulo de carga de imágenes de Quill
if (ReactQuill && ReactQuill.Quill) {
	ReactQuill.Quill.register("modules/imageUploader", ImageUploader);
}

function DetalleEvento() {
	const { id } = useParams(); // Obtener el ID del evento
	const navigate = useNavigate(); // Función para redirigir

	const [evento, setEvento] = useState(null);
	const [cargando, setCargando] = useState(false);
	const [descripcion, setDescripcion] = useState(""); // Estado para la descripción
	const [editor, setEditor] = useState(null); // Estado para el editor de Quill

	// Configuración de los módulos de Quill
	const modules = {
		toolbar: [
			[{ header: "1" }, { header: "2" }, { font: [] }],
			[{ list: "ordered" }, { list: "bullet" }],
			[{ align: [] }],
			["bold", "italic", "underline"],
			["link", "image"],
			[{ color: [] }, { background: [] }],
			["clean"],
		],
		imageUploader: {
			upload: (file) => {
				const formData = new FormData();
				formData.append("image", file);

				return usuariosAxios
					.post("/upload-image", formData) // Asegúrate de que esta ruta sea la correcta
					.then((response) => {
						console.log("Imagen cargada con éxito:", response.data);
						const imageUrl = `${window.location.origin}${response.data.url}`;

						// Inserta la imagen en el editor
						if (editor) {
							const range = editor.getSelection(); // Obtener la posición actual del cursor
							if (range) {
								// Insertar la imagen en la posición del cursor
								editor.insertEmbed(range.index, "image", imageUrl);
							} else {
								// Si no hay selección, insertar al final
								editor.insertEmbed(editor.getLength(), "image", imageUrl);
							}
						}

						return imageUrl; // Retorna la URL de la imagen subida
					})
					.catch((error) => {
						console.error("Error al cargar la imagen:", error);
					});
			},
		},
	};

	// Cargar los detalles del evento
	useEffect(() => {
		const consultarApi = async () => {
			setCargando(true);
			try {
				const { data } = await usuariosAxios.get(`/evento/detalle/${id}`);
				setEvento(data.evento); // Guardar evento
				setDescripcion(data.evento.descripcion || ""); // Establecer la descripción
			} catch (error) {
				console.error("Error al obtener el evento:", error);
				navigate("/error"); // Redirigir si ocurre un error
			} finally {
				setCargando(false);
			}
		};

		consultarApi();
	}, [id, navigate]);

	// Manejar cambios en la descripción
	const handleDescripcionChange = (value) => {
		setDescripcion(value);
	};

	// Manejar el envío del formulario
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await usuariosAxios.post("/evento/detalle", {
				eventoId: id,
				descripcion,
			});
			alert("Detalles registrados exitosamente!");
			navigate(`/eventocultura/${id}`); // Redirigir al detalle del evento
		} catch (error) {
			console.error("Error al registrar los detalles:", error);
		}
	};

	// Setear el editor cuando esté listo
	const handleEditorChange = (editor) => {
		setEditor(editor); // Guardar el editor para manipularlo después
	};

	if (cargando) {
		return <div>Cargando...</div>;
	}

	if (!evento) {
		return <div>No se encontró el evento.</div>;
	}

	return (
		<div>
			<h2>Detalles del Evento</h2>
			<p>
				<strong>Nombre:</strong> {evento.nombre}
			</p>
			<p>
				<strong>Fecha:</strong> {evento.fecha}
			</p>
			<p>
				<strong>Descripción:</strong> {evento.descripcion}
			</p>

			{/* Formulario con ReactQuill */}
			<h3>Editar Descripción:</h3>
			<ReactQuill
				value={descripcion}
				onChange={handleDescripcionChange}
				onEditorReady={handleEditorChange} // Guardar el editor cuando esté listo
				modules={modules} // Aplicar módulos de Quill, incluyendo la carga de imágenes
			/>
			<button onClick={handleSubmit}>Guardar</button>
		</div>
	);
}

export default DetalleEvento;
