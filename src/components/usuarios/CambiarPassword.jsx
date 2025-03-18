import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import usuariosAxios from "../../config/axios";

const CambiarPassword = () => {
	const [nuevaPassword, setNuevaPassword] = useState("");
	const [confirmarPassword, setConfirmarPassword] = useState("");
	const [mensaje, setMensaje] = useState("");
	const [error, setError] = useState("");
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const navigate = useNavigate();
	console.log("llego el token: ", token);
	useEffect(() => {
		if (!token) {
			setError("Token inválido o expirado.");
		}
	}, [token]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMensaje("");
		setError("");

		if (nuevaPassword !== confirmarPassword) {
			setError("Las contraseñas no coinciden.");
			return;
		}

		try {
			const respuesta = await usuariosAxios.post("/cambiarpassword", {
				token,
				nuevaPassword,
			});
			console.log(respuesta.data);
			setMensaje(respuesta.data.mensaje);
			// Redirigir al login o a alguna página de confirmación
			setTimeout(() => navigate("/login"), 3000);
		} catch (err) {
			console.log(err.response.data);
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
							Cambiar Contraseña
						</h4>
						{mensaje && <div className="alert alert-success">{mensaje}</div>}
						{error && <div className="alert alert-danger">{error}</div>}
						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label className="form-label">Nueva Contraseña</label>
								<input
									type="password"
									className="form-control"
									placeholder="Ingresa tu nueva contraseña"
									value={nuevaPassword}
									onChange={(e) => setNuevaPassword(e.target.value)}
									required
								/>
							</div>
							<div className="mb-3">
								<label className="form-label">Confirmar Contraseña</label>
								<input
									type="password"
									className="form-control"
									placeholder="Confirma tu nueva contraseña"
									value={confirmarPassword}
									onChange={(e) => setConfirmarPassword(e.target.value)}
									required
								/>
							</div>
							<button type="submit" className="btn btn-primary w-100">
								Cambiar Contraseña
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CambiarPassword;
