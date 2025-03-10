# Proyecto del Bicentenario

## Para Inf-281

Este es el repositorio del proyecto del Bicentenario. A continuación se detallan los pasos para ejecutar el proyecto en tu entorno local.

### Requisitos previos

Asegúrate de tener instalado en tu máquina:

- [Node.js](https://nodejs.org/)
- [React](https://reactjs.org/) (Este proyecto está hecho con React)
- [Vite](https://vitejs.dev/) (Herramienta de construcción para aplicaciones modernas de JavaScript)

### Instrucciones para ejecutar el proyecto

1. **Instalar dependencias**

   Una vez clonado el proyecto, navega al directorio del proyecto y ejecuta el siguiente comando para instalar las dependencias:

   Si usas **npm**:

   ```bash
   npm install
   ```

   Si usas **Yarn**:

   ```bash
   yarn install
   ```

2. **Configurar las variables de entorno**

   En la raíz del proyecto encontrarás un archivo llamado `.env.example`. Copia este archivo y renómbralo a `.env`:

   ```bash
   cp .env.example .env
   ```

   Luego, abre el archivo `.env` y reemplaza las claves de las variables de entorno según corresponda:

   ```env
   VITE_BACKEND_URL=http://localhost:5000
   VITE_RECAPTCHA_SITE_KEY=your-site-key-here
   ```

3. **Ejecutar el proyecto**

   Después de configurar las variables de entorno, puedes iniciar el servidor de desarrollo ejecutando:

   Si usas **npm**:

   ```bash
   npm run dev
   ```

   Si usas **Yarn**:

   ```bash
   yarn dev
   ```

### Dependencias

- **React**: Framework principal para la interfaz de usuario.
- **Vite**: Herramienta de construcción.
- **ReCAPTCHA v2**: Para la validación de CAPTCHA en el formulario de inicio de sesión.
