import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import usuariosAxios from "../../config/axios";
import { Link } from "react-router-dom";

function Login() {
	const navigate = useNavigate();
	const [usuario, guardarUsuario] = useState({ correo: "", password: "" });
	const [captchaValue, setCaptchaValue] = useState(null);
	const [mostrarPassword, setMostrarPassword] = useState(false);
	const [errorCorreo, setErrorCorreo] = useState("");
	const [errorPassword, setErrorPassword] = useState("");
	const [errorCaptcha, setErrorCaptcha] = useState("");
	const [errorGeneral, setErrorGeneral] = useState("");

	const actualizarState = (e) => {
		guardarUsuario({ ...usuario, [e.target.name]: e.target.value });
		if (e.target.name === "correo") setErrorCorreo("");
		if (e.target.name === "password") setErrorPassword("");
		setErrorGeneral("");
	};

	const handleCaptchaChange = (value) => {
		setCaptchaValue(value);
		setErrorCaptcha("");
	};

	const iniciarSesion = async (e) => {
		e.preventDefault();

		let errores = false;
		if (!usuario.correo.trim()) {
			setErrorCorreo("El correo es obligatorio.");
			errores = true;
		}
		if (!usuario.password.trim()) {
			setErrorPassword("La contraseña es obligatoria.");
			errores = true;
		}
		if (!captchaValue) {
			setErrorCaptcha("Por favor completa el CAPTCHA.");
			errores = true;
		}
		if (errores) return;

		try {
			const respuesta = await usuariosAxios.post("/login", {
				correo: usuario.correo,
				password: usuario.password,
				captcha: captchaValue,
			});

			const { token, nombre, apellido, rol, idUsuario } = respuesta.data;

			if (token) {
				localStorage.setItem("tokenLogin", token);
				localStorage.setItem("nombre", nombre);
				localStorage.setItem("apellido", apellido);
				localStorage.setItem("idUsuario", idUsuario);
				if (rol) {
					localStorage.setItem("userRole", rol);
				}

				// Redirección condicional según rol (si es admin, dashboard)
				if (
					rol === "administrador" ||
					rol === "cultural" ||
					rol === "academico" ||
					rol === "deportivo" ||
					rol === "gastronomico"
				) {
					window.location.href = "/bicentenario-dashboard";
				} else {
					navigate("/");
				}

				// Notifica actualización
				window.dispatchEvent(new Event("storage"));
			}
		} catch (error) {
			if (error.response?.data?.verificado === false) {
				setErrorGeneral("Tu cuenta no está verificada.");
				navigate("/confirmarcuenta");
			} else {
				setErrorGeneral(error.response?.data?.mensaje || "Acceso inválido.");
			}
		}
	};

	return (
		<>
			<div className="fondo"></div>
			<div className="container mt-5">
				<div className="row justify-content-center mb-2">
					<div className="col-md-5">
						<div className="card shadow-lg">
							<div className="card-body">
								<h2 className="text-center mb-4">Iniciar Sesión</h2>
								<form onSubmit={iniciarSesion} noValidate>
									<div className="mb-3">
										<label className="form-label">Correo electrónico</label>
										<input
											type="email"
											name="correo"
											className="form-control"
											placeholder="Ingresa tu correo"
											value={usuario.correo}
											onChange={actualizarState}
											autoComplete="username"
										/>
										{errorCorreo && (
											<div className="text-danger">{errorCorreo}</div>
										)}
									</div>

									<div className="mb-3">
										<label className="form-label">Contraseña</label>
										<div className="input-group">
											<input
												type={mostrarPassword ? "text" : "password"}
												name="password"
												className="form-control"
												placeholder="Ingresa tu contraseña"
												value={usuario.password}
												onChange={actualizarState}
												autoComplete="current-password"
											/>
											<button
												type="button"
												className="btn btn-outline-secondary"
												onClick={() => setMostrarPassword(!mostrarPassword)}
											>
												{mostrarPassword ? (
													<i className="fas fa-eye-slash"></i>
												) : (
													<i className="fas fa-eye"></i>
												)}
											</button>
										</div>
										{errorPassword && (
											<div className="text-danger">{errorPassword}</div>
										)}
									</div>

									<div className="mb-3">
										<ReCAPTCHA
											sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
											onChange={handleCaptchaChange}
										/>
										{errorCaptcha && (
											<div className="text-danger">{errorCaptcha}</div>
										)}
									</div>

									{errorGeneral && (
										<div className="alert alert-danger">{errorGeneral}</div>
									)}

									<div className="d-grid">
										<button type="submit" className="btn btn-primary">
											Iniciar Sesión
										</button>
									</div>
								</form>

								<hr />
								<div className="text-center">
									<p>
										¿No tienes una cuenta?{" "}
										<Link to="/registro">Regístrate</Link>
									</p>
								</div>
								{/* Aquí podrías condicionar mostrar estas redes solo a usuarios comunes */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Login;
