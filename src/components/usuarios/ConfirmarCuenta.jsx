import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ConfirmarCuenta = () => {
	const [mensaje, setMensaje] = useState(
		"Se ha enviado un correo de confirmación. Por favor, revisa tu bandeja de entrada y sigue las instrucciones."
	);
	const [error, setError] = useState(false);
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	useEffect(() => {
		if (token) {
			const confirmarCuenta = async () => {
				try {
					const respuesta = await fetch("http://localhost:5000/confirmar", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ token }),
					});

					const resultado = await respuesta.json();

					if (!respuesta.ok) {
						throw new Error(resultado.msg);
					}

					setMensaje(resultado.msg);
					setError(false);
				} catch (error) {
					setMensaje(error.message);
					setError(true);
				}
			};

			confirmarCuenta();
		}
	}, [token]);

	return (
		<div className="container d-flex justify-content-center align-items-center vh-100">
			<div className="card shadow p-4" style={{ maxWidth: "400px" }}>
				<div className="card-body text-center">
					<h1 className="card-title">Confirmación de Cuenta</h1>
					<p className={`card-text ${error ? "text-danger" : "text-success"}`}>
						{mensaje}
					</p>
				</div>
			</div>
		</div>
	);
};

export default ConfirmarCuenta;
