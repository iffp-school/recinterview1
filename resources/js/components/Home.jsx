import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

function Home() {
	const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
	const [currentDisplayPhrase, setCurrentDisplayPhrase] = useState('');
	const [afficherModal, setAfficherModal] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [theme, setTheme] = useState('light');

	const phrases = [
		"Impressionnez plus de clients",
		"Prenez moins de notes",
		"Placez plus de candidats",
		"Gagnez plus d'affaires"
	];

	const displayPhrase = (phrase) => {
		let currentDisplayed = '';
		let currentIndex = 0;
		const interval = setInterval(() => {
			if (currentIndex < phrase.length) {
				currentDisplayed += phrase[currentIndex];
				setCurrentDisplayPhrase(currentDisplayed);
				currentIndex++;
			} else {
				clearInterval(interval);
			}
		}, 100);
	};

	const nextPhrase = () => {
		setCurrentPhraseIndex((prevIndex) =>
			prevIndex === phrases.length - 1 ? 0 : prevIndex + 1
		);
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const toggleModal = () => {
		setAfficherModal(!afficherModal);
	};

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	useEffect(() => {
		displayPhrase(phrases[currentPhraseIndex]);
		const timeout = setTimeout(nextPhrase, phrases[currentPhraseIndex].length * 100 + 1000);
		return () => clearTimeout(timeout);
	}, [currentPhraseIndex]);

	return (
		<div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col min-h-screen transition-colors duration-300`}>
			{/* NavBar */}
			<nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex justify-between items-center py-6 px-8 m-4 shadow-lg rounded-lg`}>
				<h1 className="text-3xl sm:text-5xl font-bold">
					Rec<span className="text-blue-500">Inter</span>View
				</h1>
				<div className="hidden lg:flex items-center space-x-8">
					<a href="#home" className="text-xl font-semibold hover:text-blue-500">Home</a>
					<a href="#features" className="text-xl font-semibold hover:text-blue-500">Fonctionnalités</a>
					<a href="#about" className="text-xl font-semibold hover:text-blue-500">À propos de nous</a>
					<a onClick={toggleModal} className="cursor-pointer text-xl font-semibold hover:text-blue-500">Contact</a>
					<Link to="/login" className="text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow">
						Espace Recruteur
					</Link>
					<Link to="/login" className="text-xl font-semibold bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow">
						Espace Administrateur
					</Link>
					{/* Dark/Light Mode Toggle */}
					<button onClick={toggleTheme} className="ml-4 text-xl p-2 border rounded-lg">
						{theme === 'dark' ? <FaSun /> : <FaMoon />}
					</button>
				</div>
				{/* Bouton Menu pour mobile */}
				<button onClick={toggleMenu} className="lg:hidden text-3xl ml-4 border px-6 py-3 rounded-lg shadow">
					Menu
				</button>
			</nav>

			{/* Menu Responsive */}
			{isMenuOpen && (
				<div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex flex-col items-center py-4 space-y-4 shadow-lg rounded-lg lg:hidden`}>
					<a href="#home" className="text-xl font-semibold">Home</a>
					<a href="#features" className="text-xl font-semibold">Fonctionnalités</a>
					<a href="#about" className="text-xl font-semibold">À propos de nous</a>
					<a onClick={toggleModal} className="cursor-pointer text-xl font-semibold">Contact</a>
					<Link to="/login" className="text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow">
						Espace Recruteur
					</Link>
					<Link to="/admin" className="text-xl font-semibold bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow">
						Espace Administrateur
					</Link>
					{/* Dark/Light Mode Toggle */}
					<button onClick={toggleTheme} className="text-xl p-2 border rounded-lg">
						{theme === 'dark' ? <FaSun /> : <FaMoon />}
					</button>
				</div>
			)}

			{/* Modal de contact */}
			{afficherModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
						<h2 className="text-2xl font-bold mb-4">Contactez-nous</h2>
						<form>
							<div className="mb-4">
								<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
								<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Votre email" />
							</div>
							<div className="mb-4">
								<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">Message</label>
								<textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Votre message"></textarea>
							</div>
							<div className="flex justify-end">
								<button type="button" onClick={toggleModal} className="mr-4 bg-gray-500 text-white px-4 py-2 rounded-lg">Annuler</button>
								<button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Envoyer</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Section principale */}
			<div className="flex flex-col md:flex-row flex-grow justify-center items-center m-4">
				<div className="w-full md:w-1/2 p-4">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
						Vidéo pour toutes les étapes du <span className="text-blue-500">recrutement</span>.
					</h1>
					<h3 className="text-xl sm:text-2xl mb-4">RecInterview vous permet de :</h3>
					<div className="text-lg sm:text-xl mb-6">
						<p>{currentDisplayPhrase}</p>
					</div>
				</div>
				<div className="w-full md:w-1/2 p-4">
					<iframe className="w-full aspect-video" src="https://www.youtube.com/embed/3rxns3k9dws?si=xliYptPIEnFgL-lf" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
				</div>
			</div>

			{/* Section Fonctionnalités */}
			<div id="features" className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'} py-16 px-4`}>
				<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<CardFonctionnalite
						theme={theme}
						titre="Entièrement personnalisable"
						description="RecView permet une personnalisation complète pour correspondre à votre marque."
					/>
					<CardFonctionnalite
						theme={theme}
						titre="Entretiens vidéo en direct"
						description="Salles de visioconférence illimitées pour enregistrer les entretiens avec vos clients et candidats."
					/>
					<CardFonctionnalite
						theme={theme}
						titre="Portails client"
						description="Permettez à vos clients de regarder les entretiens de candidats dans leur propre portail de marque."
					/>
					<CardFonctionnalite
						theme={theme}
						titre="Extension Chrome"
						description="Utilisez notre extension Chrome pour enregistrer des vidéos de prospection et de présentation."
					/>
					<CardFonctionnalite
						theme={theme}
						titre="Pages de réservation"
						description="Permettez à vos clients et candidats de réserver directement dans votre calendrier."
					/>
					<CardFonctionnalite
						theme={theme}
						titre="Solutions économiques"
						description="Pas de contrats contraignants, tarification flexible."
					/>
				</div>
			</div>

			{/* Section À propos */}
			<div id="about" className="flex flex-col items-center text-center py-16 px-6">
				<p className="text-lg sm:text-xl md:text-2xl mx-8 mb-4">
					Une équipe qui comprend le recrutement.
				</p>
				<img src="/images/image.png" alt="Votre image" className="w-full h-auto shadow-lg rounded-lg" />
			</div>

			{/* Footer */}
			<footer className="bg-gray-800 text-gray-400 text-center text-base py-4">
				<p>
					<a href="#" className="mx-4 hover:text-white">Politique de confidentialité</a>
					{" | "}
					<a href="#" className="mx-4 hover:text-white">Conditions générales</a>
					{" | "}
					© 2024 RecInterView, Tous droits réservés
				</p>
			</footer>
		</div>
	);
}

function CardFonctionnalite({ titre, description, theme }) {
	return (
		<div className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} p-8 rounded-lg shadow-lg`}>
			<h2 className="text-2xl sm:text-3xl font-semibold mb-6">{titre}</h2>
			<p className="text-lg sm:text-xl">{description}</p>
		</div>
	);
}

export default Home;
