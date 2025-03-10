import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import usuariosAxios from "../../config/axios";
import { Link } from "react-router-dom";

function Login() {
	const navigate = useNavigate();
	const [usuario, guardarUsuario] = useState({ correo: "", password: "" });
	const [captchaValue, setCaptchaValue] = useState(null);
	const [mostrarPassword, setMostrarPassword] = useState(false); // Estado para ver la contraseña

	// Estados de error individuales
	const [errorCorreo, setErrorCorreo] = useState("");
	const [errorPassword, setErrorPassword] = useState("");
	const [errorCaptcha, setErrorCaptcha] = useState("");
	const [errorGeneral, setErrorGeneral] = useState("");

	const actualizarState = (e) => {
		guardarUsuario({ ...usuario, [e.target.name]: e.target.value });

		// Limpiar errores al escribir
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

		if (errores) {
			setErrorGeneral("");
			return;
		}

		try {
			const respuesta = await usuariosAxios.post("/login", {
				correo: usuario.correo,
				password: usuario.password,
				captcha: captchaValue,
			});

			// Si el login es exitoso, almacenar el token y los datos en localStorage
			if (respuesta.data.token) {
				localStorage.setItem("tokenLogin", respuesta.data.token);
				localStorage.setItem(
					"userName",
					`${respuesta.data.nombre} ${respuesta.data.apellido}`
				);

				// Disparar un evento personalizado para actualizar PublicNav
				window.dispatchEvent(new Event("storage"));

				navigate("/"); // Redirigir a la página de inicio
			}
		} catch (error) {
			// Verificar si la cuenta está verificada
			if (!error.response.data.verificado) {
				//console.log("Cuenta no verificada. Redirigiendo a confirmar cuenta.");
				navigate("/confirmarcuenta");
				return; // Detener la ejecución posterior para evitar que se ejecute el login si no está verificado
			}

			setErrorGeneral("Acceso inválido. Por favor, inténtelo otra vez.");
			//console.log("aqui entramos",error.response ? error.response.data : error);
		}
	};

	return (
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
										required
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
											required
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

								<div className="mb-3 form-check">
									<input
										type="checkbox"
										className="form-check-input border border-dark"
										id="remember"
									/>
									<label className="form-check-label" htmlFor="remember">
										Recordarme
									</label>
									<Link to="/recuperar-password" className="float-end">
										¿Olvidaste tu contraseña?
									</Link>
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
									<Link to="/registro">Regístrate ahora</Link>
								</p>
							</div>
							<div className="mt-3 text-center">
								<p>O inicia sesión con:</p>
								<div className="d-flex justify-content-center gap-2">
									<button className="btn btn-info">
										<i className="fab fa-twitter"></i> Twitter
									</button>
									<button className="btn btn-primary">
										<i className="fab fa-facebook"></i> Facebook
									</button>
									<button className="btn btn-danger">
										<i className="fab fa-google"></i> Google
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
