import React, { useState } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { Outlet } from "react-router-dom"; // Importa el Outlet

const AdminDashboard = () => {
	const [sidebarVisible, setSidebarVisible] = useState(false);

	const toggleSidebar = () => {
		setSidebarVisible(!sidebarVisible);
	};

	return (
		<div id="wrapper">
			{/* Sidebar */}
			<Sidebar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />

			{/* Content Wrapper */}
			<div id="content-wrapper" className="d-flex flex-column">
				{/* Main Content */}
				<div id="content">
					{/* Topbar */}
					<Topbar toggleSidebar={toggleSidebar} />

					{/* Aquí se renderiza el contenido específico de cada ruta */}
					<Outlet />
				</div>

				{/* Footer */}
				<footer className="sticky-footer bg-white">
					<div className="container my-auto">
						<div className="copyright text-center my-auto">
							<span>Copyright &copy; Your Website 2021</span>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
};

export default AdminDashboard;
