import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

function Home() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentDisplayPhrase, setCurrentDisplayPhrase] = useState('');
  const [afficherModal, setAfficherModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light'); // Ajout de l'état du thème

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
    }, 100); // Vitesse d'affichage des caractères (en millisecondes)
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
    const timeout = setTimeout(nextPhrase, phrases[currentPhraseIndex].length * 100 + 1000); // Délai entre chaque phrase (en millisecondes)
    return () => clearTimeout(timeout);
  }, [currentPhraseIndex]);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col min-h-screen transition-colors duration-300`}>
      <nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex justify-between items-center py-4 px-8 m-4 shadow-lg rounded-lg`}>
        <h1 className="text-4xl font-bold mb-4">
          Rec<span className="text-blue-500">Inter</span>View
        </h1>
        <div className="hidden md:flex items-center space-x-4">
          <a href="#home" className={`${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-700'} text-lg font-semibold`}>
            Home
          </a>
          <a href="#features" className={`${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-700'} text-lg font-semibold`}>
            Fonctionnalités
          </a>
          <a href="#about" className={`${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-700'} text-lg font-semibold`}>
            À propos de nous
          </a>
          <button onClick={toggleModal} className={`${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-700'} text-lg font-semibold`}>
            Contact
          </button>
          <Link to="/login" className="text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
            Espace Recruteur
          </Link>
          <button onClick={toggleTheme} className="text-lg font-semibold">
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
        </div>
        <button onClick={toggleMenu} className={`${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} block md:hidden text-lg font-semibold ml-4 border px-4 py-2 rounded-lg shadow`}>
          Menu
        </button>
      </nav>
      {isMenuOpen && (
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} md:hidden flex flex-col items-center py-4 space-y-2 shadow-lg rounded-lg`}>
          <a href="#home" className={`${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-700'} text-lg font-semibold`}>
            Home
          </a>
          <a href="#features" className={`${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-700'} text-lg font-semibold`}>
            Fonctionnalités
          </a>
          <a href="#about" className={`${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-700'} text-lg font-semibold`}>
            À propos de nous
          </a>
          <button onClick={toggleModal} className={`${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-700'} text-lg font-semibold border px-4 py-2 rounded-lg shadow`}>
            Contact
          </button>
          <Link to="/login" className="text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
            Espace Recruteur
          </Link>
        </div>
      )}
      <div className="flex flex-col md:flex-row flex-grow justify-center items-center m-4">
        <div className="w-full md:w-1/2 p-4">
          <h1 className="text-4xl font-bold mb-4">
            Vidéo pour toutes les étapes du{" "}
            <span className="text-blue-500">recrutement</span>.
          </h1>
          <h3 className="text-lg">RecInterview vous permet de :</h3>
          <div className="text-lg mb-6">
            <p>{currentDisplayPhrase}</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/3rxns3k9dws?si=xliYptPIEnFgL-lf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
      </div>
      <div id="features" className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'} flex justify-center items-center py-12 m-4 shadow-lg rounded-lg transition-colors duration-300`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
      <div id="about" className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900'} flex flex-col justify-center items-center py-12 m-4 shadow-lg rounded-lg transition-colors duration-300`}>
        <p className="text-lg mx-8 mb-4">
          Une équipe qui comprend le recrutement. Notre équipe est assez unique. Nous gérons également Start In Recruitment et plaçons des commerciaux dans des agences de recrutement. Cela signifie que nous avons construit RecView pour nous-mêmes, en fonction des retours de nos clients - qui se trouvent être des recruteurs.
        </p>
        <img src="/images/image.png" alt="Votre image" className="w-full h-auto shadow-lg rounded-lg" />
      </div>

      <footer className={`${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'} text-center text-sm py-4 shadow-inner transition-colors duration-300`}>
        <p>
          <a href="#" className={`${theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'} mx-2`}>Politique de confidentialité</a>
          {" | "}
          <a href="#" className={`${theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900'} mx-2`}>Conditions générales</a>
          {" | "}
          © 2024 RecInterView, Tous droits réservés
        </p>
      </footer>

      <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 transition-opacity duration-300 ${afficherModal ? 'flex' : 'hidden'}`}>
        <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-8 rounded-lg w-full max-w-md relative shadow-lg`}>
          <h2 className="text-2xl font-semibold mb-4">Formulaire de Contact</h2>
          <form className="w-full">
            <div className="mb-4 flex flex-col md:flex-row">
              <input type="text" placeholder="Prénom" className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} p-2 rounded-lg w-full md:w-1/2 mr-2 mb-2 md:mb-0`} />
              <input type="text" placeholder="Nom de famille" className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} p-2 rounded-lg w-full md:w-1/2 ml-2`} />
            </div>
            <div className="mb-4">
              <input type="text" placeholder="Entreprise" className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} p-2 rounded-lg w-full`} />
            </div>
            <div className="mb-4">
              <input type="email" placeholder="Email" className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} p-2 rounded-lg w-full`} />
            </div>
            <div className="mb-4">
              <input type="tel" placeholder="Numéro de téléphone" className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} p-2 rounded-lg w-full`} />
            </div>
            <div className="mb-4">
              <textarea placeholder="Message" className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} p-2 rounded-lg w-full h-24`}></textarea>
            </div>
            <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full shadow-lg">Envoyer</button>
            <button onClick={toggleModal} className="absolute top-0 right-0 bg-transparent hover:bg-red-500 text-white font-semibold hover:text-white py-1 px-2 rounded-full">X</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Composant pour une carte de fonctionnalité
function CardFonctionnalite({ titre, description, theme }) {
  return (
    <div className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-lg`}>
      <h2 className="text-xl font-semibold mb-4">{titre}</h2>
      <p className="text-lg">{description}</p>
    </div>
  );
}

export default Home;
