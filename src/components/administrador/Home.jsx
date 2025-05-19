import React, { useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";
import usuariosAxios from "../../config/axios";

const Home = () => {
	const [eventosPorMes, setEventosPorMes] = useState([]);
	const [eventosPorTipo, setEventosPorTipo] = useState([]);
	const [asistenciasPorEvento, setAsistenciasPorEvento] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const eventosMesRes = await usuariosAxios.get(
					"/consultas/eventos-por-mes"
				);
				const eventosTipoRes = await usuariosAxios.get(
					"/consultas/eventos-por-tipo"
				);
				const asistenciasRes = await usuariosAxios.get(
					"/consultas/asistencias-por-evento"
				);

				setEventosPorMes(eventosMesRes.data);
				setEventosPorTipo(eventosTipoRes.data);

				const asistenciasAdaptadas = asistenciasRes.data.map((item) => ({
					titulo: item.evento.titulo,
					asistencias: item.asistencias,
				}));
				setAsistenciasPorEvento(asistenciasAdaptadas);
			} catch (error) {
				console.error("Error al obtener estadísticas:", error);
			}
		};

		fetchData();
	}, []);

	const colores = [
		"#0088FE",
		"#00C49F",
		"#FFBB28",
		"#FF8042",
		"#AF19FF",
		"#FF4560",
		"#3f51b5",
		"#f44336",
	];

	return (
		<div className="container py-4">
			<h2 className="mb-4 fw-bold text-center">📊 Estadísticas del Sistema</h2>

			<div className="row g-4">
				{/* Eventos por Mes */}
				<div className="col-md-6">
					<div className="card shadow-sm border-0">
						<div className="card-body">
							<h5 className="card-title text-center">📅 Eventos por Mes</h5>
							<p className="text-muted text-center">
								Muestra cuántos eventos se realizaron en los últimos 6 meses,
								agrupados por mes.
							</p>
							<div style={{ height: 300 }}>
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={eventosPorMes}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="mes" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar dataKey="total_eventos" fill="#8884d8" />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</div>

				{/* Eventos por Tipo */}
				<div className="col-md-6">
					<div className="card shadow-sm border-0">
						<div className="card-body">
							<h5 className="card-title text-center">
								🎭 Distribución de Tipos de Eventos
							</h5>
							<p className="text-muted text-center">
								Representa la cantidad de eventos culturales, deportivos,
								académicos y gastronómicos organizados recientemente.
							</p>
							<div style={{ height: 300 }}>
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={eventosPorTipo}
											dataKey="cantidad"
											nameKey="tipo"
											cx="50%"
											cy="50%"
											outerRadius={100}
											label
										>
											{eventosPorTipo.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={colores[index % colores.length]}
												/>
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</div>

				{/* Asistencias por Evento */}
				<div className="col-12">
					<div className="card shadow-sm border-0">
						<div className="card-body">
							<h5 className="card-title text-center">
								👥 Participación por Evento
							</h5>
							<p className="text-muted text-center">
								Indica cuántas personas asistieron a cada evento en los últimos
								6 meses. Ideal para medir el impacto de cada actividad.
							</p>
							<div style={{ height: 400 }}>
								<ResponsiveContainer width="100%" height="100%">
									<BarChart layout="vertical" data={asistenciasPorEvento}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis type="number" />
										<YAxis type="category" dataKey="titulo" width={200} />
										<Tooltip />
										<Legend />
										<Bar dataKey="asistencias" fill="#82ca9d" />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
