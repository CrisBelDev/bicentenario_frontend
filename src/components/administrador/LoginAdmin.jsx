import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import usuariosAxios from "../../config/axios"; // Asegúrate de tener la configuración de axios correctamente

const LoginAdmin = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError(""); // Limpiar el error previo

		try {
			// Llamada a la API para verificar las credenciales
			const response = await usuariosAxios.post("/admin/login", {
				email,
				password,
			});

			// Si la autenticación es exitosa, almacenamos el token y el rol
			if (response.data.token) {
				localStorage.setItem("tokenLogin", response.data.token);
				localStorage.setItem("userRole", "admin");
				localStorage.setItem("nombre", response.data.nombre);
				localStorage.setItem("apellido", response.data.apellido);

				// Redirigir al dashboard de administrador
				navigate("/bicentenario-dashboard");
			} else {
				setError("Credenciales incorrectas.");
			}
		} catch (err) {
			// Manejo de errores de red o errores específicos de la API
			if (err.response) {
				// Si el backend devuelve un error específico
				setError(
					err.response.data.mensaje ||
						"Ocurrió un error. Por favor, intenta de nuevo."
				);
			} else {
				setError("Error en la conexión. Intenta más tarde.");
			}
		}
	};

	return (
		<section className="fondo  h-100 d-flex justify-content-center align-items-center bg-light vh-100">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
						<div className="text-center my-4">
							<img
								src="https://getbootstrap.com/docs/5.0/assets/brand/bootstrap-logo.svg"
								alt="logo"
								width="100"
							/>
						</div>
						<div className="card shadow-lg">
							<div className="card-body p-5">
								<h1 className="fs-4 card-title fw-bold mb-4 text-center">
									Admin Login
								</h1>
								<form onSubmit={handleLogin} className="needs-validation">
									<div className="mb-3">
										<label className="mb-2 text-muted" htmlFor="email">
											Correo Electrónico
										</label>
										<input
											id="email"
											type="email"
											className="form-control"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>

									<div className="mb-3">
										<label className="text-muted" htmlFor="password">
											Contraseña
										</label>
										<input
											id="password"
											type="password"
											className="form-control"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
									</div>

									{error && <p className="text-danger text-center">{error}</p>}

									<div className="d-flex align-items-center">
										<button type="submit" className="btn btn-primary w-100">
											Iniciar sesión
										</button>
									</div>
								</form>
							</div>
							<div className="card-footer text-center py-3">
								<small className="text-muted">
									Copyright &copy; 2024 &mdash; Bicentenario Bolivia
								</small>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default LoginAdmin;
