import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import usuariosAxios from "../../config/axios";
import FormularioUsuario from "./FormularioUsuario";

const NuevoUsuario = () => {
	const navigate = useNavigate();

	const agregarUsuario = async (usuario) => {
		try {
			await usuariosAxios.post("/usuarios", usuario);
			Swal.fire(
				"¡Registro exitoso!",
				"El usuario ha sido registrado correctamente.",
				"success"
			);
			navigate("/confirmarcuenta");
		} catch (error) {
			const mensaje =
				error.response?.data?.mensaje ||
				"Hubo un problema al registrar el usuario.";
			Swal.fire("Error", mensaje, "error");
		}
	};

	return (
		<section
			className="px-4 py-5 px-md-5 text-lg-start"
			style={{ backgroundColor: "hsl(0, 0%, 96%)" }}
		>
			<div className="container">
				<div className="row gx-lg-5 align-items-center colorear">
					<div className="col-lg-6 mb-5 mb-lg-0">
						<h1 className="my-5 display-3 fw-bold ls-tight text-center ">
							Bicentenario <br />
							<span className="text-primary ">Crea tu cuenta</span>
						</h1>
						<p
							className="text-center "
							style={{ color: "hsl(217, 10%, 50.8%)" }}
						>
							Lorem ipsum dolor sit amet consectetur adipisicing elit.
						</p>
					</div>
					<div className="col-lg-6 mb-5 mb-lg-5">
						<FormularioUsuario onSubmit={agregarUsuario} />
					</div>
				</div>
			</div>
		</section>
	);
};

export default NuevoUsuario;
