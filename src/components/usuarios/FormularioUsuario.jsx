import React, { useReducer, useState } from "react";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
const estadoInicial = {
	nombre: "",
	apellido: "",
	correo: "",
	password: "",
	confirmarPassword: "",
	telefono: "",
	pais: "",
	ciudad: "",
	genero: "",
};

const reductor = (estado, accion) => ({
	...estado,
	[accion.name]: accion.value,
});

const FormularioUsuario = ({ onSubmit }) => {
	const [usuario, dispatch] = useReducer(reductor, estadoInicial);
	const [captchaValue, setCaptchaValue] = useState(null);
	const [confirmTouched, setConfirmTouched] = useState(false);

	const manejarCambio = (e) => {
		dispatch({ name: e.target.name, value: e.target.value });
	};

	const manejarBlurConfirmar = () => setConfirmTouched(true);

	const manejarCambioCaptcha = (value) => setCaptchaValue(value);

	const validarContraseñas = () =>
		usuario.password === usuario.confirmarPassword;

	const validarUsuario = () => {
		return (
			Object.values(usuario).every((campo) => campo.trim() !== "") &&
			validarContraseñas() &&
			captchaValue
		);
	};

	const manejarEnvio = (e) => {
		e.preventDefault();
		if (!validarContraseñas()) {
			return Swal.fire("Error", "Las contraseñas no coinciden.", "error");
		}
		if (!captchaValue) {
			return Swal.fire("Error", "Por favor completa el CAPTCHA.", "error");
		}
		onSubmit({ ...usuario, captcha: captchaValue });
	};

	return (
		<form onSubmit={manejarEnvio} className="mt-5 border p-4 bg-light shadow">
			<h4 className="mb-5 text-secondary">Crea tu cuenta</h4>
			<div className="row">
				<div className="mb-3 col-md-6">
					<label>
						Nombre<span className="text-danger">*</span>
					</label>
					<input
						type="text"
						name="nombre"
						className="form-control"
						placeholder="Ingresa tu nombre"
						value={usuario.nombre}
						onChange={manejarCambio}
					/>
				</div>

				<div className="mb-3 col-md-6">
					<label>
						Apellido<span className="text-danger">*</span>
					</label>
					<input
						type="text"
						name="apellido"
						className="form-control"
						placeholder="Ingresa tu apellido"
						value={usuario.apellido}
						onChange={manejarCambio}
					/>
				</div>

				<div className="mb-3 col-md-12">
					<label>
						Correo electrónico<span className="text-danger">*</span>
					</label>
					<input
						type="email"
						name="correo"
						className="form-control"
						placeholder="Ingresa tu correo electrónico"
						value={usuario.correo}
						onChange={manejarCambio}
					/>
				</div>

				<div className="mb-3 col-md-12">
					<label>
						Contraseña<span className="text-danger">*</span>
					</label>
					<input
						type="password"
						name="password"
						className="form-control"
						placeholder="Ingresa tu contraseña"
						value={usuario.password}
						onChange={manejarCambio}
					/>
				</div>

				<div className="mb-3 col-md-12">
					<label>
						Confirmar contraseña<span className="text-danger">*</span>
					</label>
					<input
						type="password"
						name="confirmarPassword"
						className="form-control"
						placeholder="Confirma tu contraseña"
						value={usuario.confirmarPassword}
						onChange={manejarCambio}
						onBlur={manejarBlurConfirmar}
					/>
				</div>

				{confirmTouched && !validarContraseñas() && (
					<div className="alert alert-danger">
						Las contraseñas no coinciden.
					</div>
				)}

				<div className="mb-3 col-md-12">
					<label>
						Teléfono<span className="text-danger">*</span>
					</label>
					<input
						type="text"
						name="telefono"
						className="form-control"
						placeholder="Ingresa tu teléfono"
						value={usuario.telefono}
						onChange={manejarCambio}
					/>
				</div>

				<div className="mb-3 col-md-12">
					<label>
						País<span className="text-danger">*</span>
					</label>
					<input
						type="text"
						name="pais"
						className="form-control"
						placeholder="Ingresa tu país"
						value={usuario.pais}
						onChange={manejarCambio}
					/>
				</div>

				<div className="mb-3 col-md-12">
					<label>
						Ciudad<span className="text-danger">*</span>
					</label>
					<input
						type="text"
						name="ciudad"
						className="form-control"
						placeholder="Ingresa tu ciudad"
						value={usuario.ciudad}
						onChange={manejarCambio}
					/>
				</div>

				<div className="mb-3 col-md-12">
					<label>
						Género<span className="text-danger">*</span>
					</label>
					<select
						className="form-select"
						name="genero"
						value={usuario.genero}
						onChange={manejarCambio}
					>
						<option value="">Selecciona una opción</option>
						<option value="masculino">Masculino</option>
						<option value="femenino">Femenino</option>
						<option value="otro">Otro</option>
					</select>
				</div>

				<div className="mb-3 col-md-12">
					<ReCAPTCHA
						sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
						onChange={manejarCambioCaptcha}
					/>
				</div>

				<div className="col-md-12">
					<button
						className="btn btn-primary float-end"
						type="submit"
						disabled={!validarUsuario()}
					>
						Regístrate ahora
					</button>
				</div>
			</div>

			<p className="text-center mt-3 text-secondary">
				Si ya tienes una cuenta, por favor{" "}
				<Link to="/login">Inicia sesión ahora</Link>
			</p>
		</form>
	);
};

export default FormularioUsuario;
