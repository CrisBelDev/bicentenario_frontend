import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usuariosAxios from "../../config/axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";

if (ReactQuill && ReactQuill.Quill) {
	ReactQuill.Quill.register("modules/imageUploader", ImageUploader);
}

function DetalleEvento() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [evento, setEvento] = useState(null);
	const [cargando, setCargando] = useState(false);
	const [descripcion, setDescripcion] = useState("");

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
					.post("/upload-image", formData)
					.then((response) => response.data.url)
					.catch((error) => console.error("Error al cargar la imagen:", error));
			},
		},
	};

	useEffect(() => {
		const consultarApi = async () => {
			setCargando(true);
			try {
				const { data } = await usuariosAxios.get(`/evento/detalle/${id}`);
				setEvento(data.evento);
				setDescripcion(data.evento.descripcion || "");
			} catch (error) {
				console.error("Error al obtener el evento:", error);
				navigate("/error");
			} finally {
				setCargando(false);
			}
		};
		consultarApi();
	}, [id, navigate]);

	const handleDescripcionChange = (value) => {
		setDescripcion(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await usuariosAxios.post("/evento-cultural", {
				id_evento: id,
				descripcion,
			});
			alert("Detalles registrados exitosamente!");
			navigate(`/eventocultura/${id}`);
		} catch (error) {
			console.error("Error al registrar los detalles:", error);
		}
	};

	if (cargando) return <div>Cargando...</div>;
	if (!evento) return <div>No se encontró el evento.</div>;

	return (
		<div className="container">
			<h2>Detalles del Evento</h2>
			<div className="card mb-4 shadow">
				<div className="card-header bg-primary text-white">
					{evento.nombre || "Sin título aún"}
				</div>
				<div className="card-body">
					{evento.imagen ? (
						<img
							src={evento.imagen}
							alt="Vista previa"
							className="img-fluid mb-3"
						/>
					) : (
						<p className="text-muted">No se ha agregado una imagen</p>
					)}

					<p className="card-text">
						{descripcion ? (
							<div
								className="descripcion-preview"
								dangerouslySetInnerHTML={{ __html: descripcion }}
							/>
						) : (
							"Agrega una descripción"
						)}
					</p>

					<p className="card-text">
						📍 Ubicación:
						{evento.ubicacion && evento.ubicacion.includes(",") && (
							<a
								href={`https://www.google.com/maps?q=${evento.ubicacion}`}
								target="_blank"
								rel="noopener noreferrer"
								className="ms-2"
							>
								Ver en Google Maps
							</a>
						)}
					</p>

					<p className="card-text">
						⏰ Inicio: {evento.fecha_inicio || "No definido"} <br />
						🕒 Fin: {evento.fecha_fin || "No definido"}
					</p>

					<p className="card-text">
						🎯 Tipo de evento: {evento.tipo || "Sin tipo"}
					</p>
				</div>
				<div className="card-footer">📅 Previsualización en tiempo real</div>
			</div>

			<h3>Editar Descripción:</h3>
			<ReactQuill
				value={descripcion}
				onChange={handleDescripcionChange}
				modules={modules}
			/>
			<button onClick={handleSubmit}>Guardar</button>
		</div>
	);
}

export default DetalleEvento;
