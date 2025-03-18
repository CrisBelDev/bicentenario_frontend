import React from "react";
import Sidebar from "./sidebar";
import Footer from "./Footer";
import "../assets/styles/app.scss"; // Importa los estilos
import "../assets/styles/app-dark.scss"; // Tema oscuro

const Layout = ({ children }) => {
	return (
		<div id="app">
			<div id="sidebar">
				<Sidebar />
			</div>
			<div id="main">
				<header className="mb-3">
					<a href="#" className="burger-btn d-block d-xl-none">
						<i className="bi bi-justify fs-3"></i>
					</a>
				</header>

				{/* Aquí va el contenido de cada página */}
				<main>{children}</main>

				<Footer />
			</div>
		</div>
	);
};

export default Layout;
