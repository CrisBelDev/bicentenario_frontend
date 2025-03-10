import usuariosAxios from "../../config/axios";

// Función para iniciar sesión
export const login = async (correo, password) => {
	try {
		const response = await usuariosAxios.post("/login", { correo, password });
		if (response.data.token) {
			// Guardamos el usuario y el token en el localStorage
			localStorage.setItem("user", JSON.stringify(response.data));
		}
		return response.data;
	} catch (error) {
		console.error("Error en el login:", error);
		throw new Error("Credenciales incorrectas o problema de servidor");
	}
};

// Función para cerrar sesión
export const logout = () => {
	// Eliminamos el usuario y el token del localStorage
	localStorage.removeItem("user");
};

// Función para obtener el token del usuario
export const getToken = () => {
	const user = JSON.parse(localStorage.getItem("user"));
	return user?.token;
};
