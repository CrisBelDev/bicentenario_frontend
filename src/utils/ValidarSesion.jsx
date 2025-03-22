import { useNavigate } from "react-router-dom";

export const validarSesion = (error, navigate) => {
	// Capturamos el error de expiración del token enviado por el backend
	if (
		error.response &&
		error.response.data.message.includes("Token invalido o expirado")
	) {
		localStorage.removeItem("tokenLogin");
		localStorage.removeItem("userRole");
		alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
		navigate("/"); // Redirigir al home
		return true; // Indica que la sesión fue eliminada y redirigida
	}
	return false; // Indica que no es un error de expiración
};
