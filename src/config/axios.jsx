import axios from "axios";

// Crear instancia de axios personalizada
const usuariosAxios = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL, // La URL de tu backend
});

// Agregar un interceptor para agregar el token a las cabeceras de las solicitudes
usuariosAxios.interceptors.request.use(
	(config) => {
		const user = JSON.parse(localStorage.getItem("user"));
		if (user && user.token) {
			// Agregar el token a la cabecera Authorization si está presente
			config.headers["Authorization"] = `Bearer ${user.token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default usuariosAxios;
