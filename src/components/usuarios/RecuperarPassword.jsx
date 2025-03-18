import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import usuariosAxios from "../../config/axios";

const RecuperarPassword = () => {
	const [email, setEmail] = useState("");
	const [mensaje, setMensaje] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate(); // Usar useNavigate para redirigir

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMensaje("");
		setError("");

		try {
			const respuesta = await usuariosAxios.post("/recuperarpassword", {
				email,
			});
			// Asegúrate de que el backend mande el mensaje correcto
			console.log(respuesta.data.msg);
			setMensaje(respuesta.data.msg); // Mostrar el mensaje del servidor

			// Redirigir al login después de mostrar el mensaje
			setTimeout(() => {
				navigate("/"); // Redirige al login
			}, 5000); // Espera 3 segundos antes de redirigir
		} catch (err) {
			setError(
				err.response?.data?.error || "Ocurrió un error. Intenta nuevamente."
			);
		}
	};

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card shadow p-4 mt-5">
						<h4 className="text-center text-secondary mb-4">
							Recuperar Contraseña
						</h4>
						{mensaje && <div className="alert alert-success">{mensaje}</div>}{" "}
						{/* Mostrar el mensaje de éxito */}
						{error && <div className="alert alert-danger">{error}</div>}
						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label className="form-label">Correo Electrónico</label>
								<input
									type="email"
									className="form-control"
									placeholder="Ingresa tu correo"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<button type="submit" className="btn btn-primary w-100">
								Enviar enlace de recuperación
							</button>
						</form>
						<p className="text-center mt-3 text-secondary">
							¿Recordaste tu contraseña? <Link to="/login">Inicia sesión</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecuperarPassword;
