import React, { useReducer, useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import usuariosAxios from "../../config/axios";

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
	const [paises, setPaises] = useState([]);
	const [ciudades, setCiudades] = useState([]);

	useEffect(() => {
		const obtenerPaises = async () => {
			try {
				const { data } = await usuariosAxios.get("/pais");
				setPaises(
					data.map((pais) => ({
						value: pais.id_pais,
						label: pais.nombre,
					}))
				);
			} catch (error) {
				console.error("Error al obtener los países", error);
			}
		};
		obtenerPaises();
	}, []);

	useEffect(() => {
		const obtenerCiudades = async () => {
			if (usuario.pais) {
				try {
					const { data } = await usuariosAxios.get(`/ciudades/${usuario.pais}`);
					setCiudades(
						data.map((ciudad) => ({
							value: ciudad.id_ciudad,
							label: ciudad.nombre,
						}))
					);
				} catch (error) {
					console.error("Error al obtener las ciudades", error);
				}
			}
		};
		obtenerCiudades();
	}, [usuario.pais]);

	const manejarCambio = (e) => {
		const { name, value } = e.target;
		dispatch({ name, value });
	};

	const manejarCambioCaptcha = (value) => setCaptchaValue(value);

	const validarContraseñas = () =>
		usuario.password === usuario.confirmarPassword;

	const validarUsuario = () => {
		return (
			Object.values(usuario).every((campo) =>
				campo ? String(campo).trim() !== "" : false
			) &&
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
						autoComplete="new-password"
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
						autoComplete="new-password"
					/>
				</div>

				{usuario.password &&
					usuario.confirmarPassword &&
					!validarContraseñas() && (
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

				<div className="mb-3 col-md-6">
					<label>
						País<span className="text-danger">*</span>
					</label>
					<Select
						name="pais"
						options={paises}
						value={paises.find((pais) => pais.value === usuario.pais) || null}
						onChange={(e) =>
							manejarCambio({ target: { name: "pais", value: e.value } })
						}
						placeholder="Selecciona un país"
					/>
				</div>

				<div className="mb-3 col-md-6">
					<label>
						Ciudad<span className="text-danger">*</span>
					</label>
					<Select
						name="ciudad"
						options={ciudades}
						value={
							ciudades.find((ciudad) => ciudad.value === usuario.ciudad) || null
						}
						onChange={(e) =>
							manejarCambio({ target: { name: "ciudad", value: e.value } })
						}
						isDisabled={!usuario.pais}
						placeholder="Selecciona una ciudad"
					/>
				</div>

				<div className="mb-3 col-md-12">
					<label>
						Género<span className="text-danger">*</span>
					</label>
					<Select
						name="genero"
						options={[
							{ value: "masculino", label: "Masculino" },
							{ value: "femenino", label: "Femenino" },
							{ value: "otro", label: "Otro" },
						]}
						value={{ value: usuario.genero, label: usuario.genero }}
						onChange={(e) =>
							manejarCambio({ target: { name: "genero", value: e.value } })
						}
						placeholder="Selecciona una opción"
					/>
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
