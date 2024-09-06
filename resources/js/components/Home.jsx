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

	const toggleModal = () => {
		setAfficherModal(!afficherModal);
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
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
			{/* Navigation Bar */}
			<nav className="flex justify-between items-center py-4 px-6 m-2 shadow-lg rounded-lg md:px-8">
				<h1 className="text-3xl sm:text-4xl font-bold">
					Rec<span className="text-blue-500">Inter</span>View
				</h1>
				{/* Masquer les autres éléments de la navbar sauf le menu sur les grands écrans mobiles */}
				<div className="hidden lg:flex items-center space-x-6">
					{/* Les éléments à masquer sur les grands mobiles */}
					<div className="hidden xl:flex items-center space-x-6">
						<a href="#home" className="text-base md:text-lg lg:text-xl font-semibold">Home</a>
						<a href="#features" className="text-base md:text-lg lg:text-xl font-semibold">Fonctionnalités</a>
						<a href="#about" className="text-base md:text-lg lg:text-xl font-semibold">À propos de nous</a>
						<button onClick={toggleModal} className="text-base md:text-lg lg:text-xl font-semibold">Contact</button>
						<Link to="/login" className="text-base md:text-lg lg:text-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">Espace Recruteur</Link>
					</div>
					{/* Menu toggle button visible on smaller screens */}
					<button onClick={toggleTheme} className="text-lg font-semibold">
						{theme === 'dark' ? <FaSun /> : <FaMoon />}
					</button>
				</div>
				{/* Menu visible on small to large screens */}
				<button onClick={toggleMenu} className="block lg:hidden text-lg ml-4 border border-gray-300 px-4 py-2 rounded-lg shadow">
					Menu
				</button>
			</nav>

			{isMenuOpen && (
				<div className="lg:hidden flex flex-col items-center py-4 space-y-2 shadow-lg rounded-lg bg-white">
					<a href="#home" className="text-lg sm:text-xl">Home</a>
					<a href="#features" className="text-lg sm:text-xl">Fonctionnalités</a>
					<a href="#about" className="text-lg sm:text-xl">À propos de nous</a>
					<button onClick={toggleModal} className="text-lg sm:text-xl border px-4 py-2 rounded-lg">Contact</button>
					<Link to="/login" className="text-lg sm:text-xl bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">Espace Recruteur</Link>
				</div>
			)}

			{/* Hero Section */}
			<div className="flex flex-col md:flex-row flex-grow justify-center items-center m-4">
				<div className="w-full md:w-1/2 p-4">
					<h1 className="text-3xl sm:text-4xl font-bold mb-4">
						Vidéo pour toutes les étapes du{" "}
						<span className="text-blue-500">recrutement</span>.
					</h1>
					<h3 className="text-lg md:text-xl">RecInterview vous permet de :</h3>
					<div className="text-lg mb-6">
						<p>{currentDisplayPhrase}</p>
					</div>
				</div>
				<div className="w-full md:w-1/2 p-4">
					<iframe className="w-full aspect-video" src="https://www.youtube.com/embed/3rxns3k9dws" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
				</div>
			</div>

			{/* Features Section */}
			<div id="features" className="bg-gray-200 text-gray-900 flex justify-center items-center py-12 m-4 shadow-lg rounded-lg transition-colors duration-300">
				{/* Chaque carte prendra toute la largeur sur mobile */}
				<div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-1 xl:grid-cols-1">
					<CardFonctionnalite
						theme={theme}
						titre="Entièrement personnalisable"
						description="RecView permet une personnalisation complète pour correspondre à votre marque. Votre nom, votre logo, votre couleur."
					/>
					<CardFonctionnalite
						theme={theme}
						titre="Entretiens vidéo en direct"
						description="Salles de visioconférence illimitées pour enregistrer les entretiens avec vos clients et candidats. Transcription automatique des entretiens."
					/>
					<CardFonctionnalite
						theme={theme}
						titre="Portails client"
						description="Permettez à vos clients de regarder les entretiens de candidats dans leur propre portail de marque. Ils peuvent également demander des entretiens et ajouter des offres d'emploi."
					/>
					<CardFonctionnalite
						theme={theme}
						titre="Extension Chrome"
						description="Utilisez notre extension Chrome pour enregistrer des vidéos de prospection et de présentation pour les envoyer à vos clients et candidats potentiels."
					/>
					<CardFonctionnalite
						theme={theme}
						titre="Pages de réservation"
						description="Permettez à vos clients et candidats de réserver directement dans votre calendrier, sans de longs échanges d'e-mails."
					/>
					<CardFonctionnalite
						theme={theme}
						titre="Solutions économiques"
						description="Pas de contrats contraignants, tarification flexible. Parfait pour les agences de recrutement."
					/>
				</div>
			</div>

			{/* About Section */}
			<div id="about" className="flex flex-col items-center text-center py-12 px-4">
				<p className="text-lg sm:text-xl mx-8 mb-4">
					Une équipe qui comprend le recrutement. Notre équipe est assez unique. Nous gérons également Start In Recruitment et plaçons des commerciaux dans des agences de recrutement. Cela signifie que nous avons construit RecView pour nous-mêmes, en fonction des retours de nos clients - qui se trouvent être des recruteurs.
				</p>
				<img src="/images/image.png" alt="About Us" className="w-full h-auto shadow-lg rounded-lg" />
			</div>

			{/* Footer */}
			<footer className="bg-gray-800 text-gray-400 text-center text-lg py-4">
				<p>
					<a href="#" className="mx-2 hover:text-white">Politique de confidentialité</a>
					{" | "}
					<a href="#" className="mx-2 hover:text-white">Conditions générales</a>
					{" | "}
					© 2024 RecInterView, Tous droits réservés
				</p>
			</footer>
		</div>
	);
}

// Functional Component for Feature Cards
function CardFonctionnalite({ titre, description, theme }) {
	return (
		<div className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-lg`}>
			<h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">{titre}</h2>
			<p className="text-base sm:text-lg md:text-xl">{description}</p>
		</div>
	);
}

export default Home;
