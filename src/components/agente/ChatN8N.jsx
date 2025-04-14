// ChatN8N.jsx
import { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

const ChatN8N = () => {
	useEffect(() => {
		createChat({
			webhookUrl:
				"https://criscoders.app.n8n.cloud/webhook/1756b34b-5de0-4ad2-a5b0-a3f32e5d15bb/chat", // reemplaza por tu webhook real
			mode: "embedded", // o 'embedded' si quieres que aparezca dentro de un div
			initialMessages: [
				"¡Hola! 👋",
				"Soy tu asistente, ¿en qué puedo ayudarte hoy?",
			],
			defaultLanguage: "es",
			i18n: {
				es: {
					title: "¡Hola! 👋",
					subtitle: "Inicia un chat. Estamos aquí para ayudarte.",
					getStarted: "Nueva conversación",
					inputPlaceholder: "Escribe tu pregunta...",
				},
			},
		});
	}, []);

	return null; // No necesitas renderizar nada si usas modo "window"
};

export default ChatN8N;
