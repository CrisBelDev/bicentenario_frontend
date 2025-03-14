import React from "react";

const HomePage = () => {
	return (
		<div className="index-page">
			{/* Main */}
			<main className="main">
				{/* Hero Section */}
				<section id="hero" className="hero section dark-background">
					<div
						id="hero-carousel"
						className="carousel slide carousel-fade"
						data-bs-ride="carousel"
						data-bs-interval="5000"
					>
						<div className="carousel-item active">
							<img src="/img/home.png" alt="" />
							<div className="carousel-container">
								<h2>
									BICENTENARIO DE BOLIVIA
									<br />
								</h2>
								<p>
									En este Bicentenario, celebramos 200 años de independencia,
									libertad y unidad. Bolivia ha construido un camino lleno de
									historia y lucha. Hoy, seguimos adelante con esperanza,
									abrazando nuestra cultura y diversidad. ¡Feliz Bicentenario,
									Bolivia!
								</p>
								<a href="#featured-services" className="btn-get-started">
									Get Started
								</a>
							</div>
						</div>
					</div>
				</section>

				{/* About Section */}
				<section id="about" className="about section">
					{/* Section Title */}
					<div className="container section-title" data-aos="fade-up">
						<h2>About</h2>
						<div>
							<span>Learn More</span>
							<span className="description-title">About Us</span>
						</div>
					</div>

					<div className="container">
						<div className="row gy-4">
							<div
								className="col-lg-6 content"
								data-aos="fade-up"
								data-aos-delay="100"
							>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor incididunt ut labore et dolore magna aliqua.
								</p>
								<ul>
									<li>
										<i className="bi bi-check2-circle"></i>
										<span>
											Ullamco laboris nisi ut aliquip ex ea commodo consequat.
										</span>
									</li>
									<li>
										<i className="bi bi-check2-circle"></i>
										<span>
											Duis aute irure dolor in reprehenderit in voluptate velit.
										</span>
									</li>
									<li>
										<i className="bi bi-check2-circle"></i>
										<span>Ullamco laboris nisi ut aliquip ex ea commodo</span>
									</li>
								</ul>
							</div>

							<div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
								<p>
									Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
									aute irure dolor in reprehenderit in voluptate velit esse
									cillum dolore eu fugiat nulla pariatur. Excepteur sint
									occaecat cupidatat non proident, sunt in culpa qui officia
									deserunt mollit anim id est laborum.
								</p>
								<a href="#" className="read-more">
									<span>Read More</span>
									<i className="bi bi-arrow-right"></i>
								</a>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
};

export default HomePage;
