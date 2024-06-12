import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import image from 'images/image.png';

function Home() {
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [currentDisplayPhrase, setCurrentDisplayPhrase] = useState('');
    const [afficherModal, setAfficherModal] = useState(false);

    // Liste des phrases
    const phrases = [
        "Impressionnez plus de clients",
        "Prenez moins de notes",
        "Placez plus de candidats",
        "Gagnez plus d'affaires"
    ];

    // Fonction pour afficher progressivement chaque phrase
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
    }

    // Fonction pour passer à la phrase suivante après un délai
    const nextPhrase = () => {
        setCurrentPhraseIndex((prevIndex) =>
            prevIndex === phrases.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Toggle de la modal
    const toggleModal = () => {
        setAfficherModal(!afficherModal);
    };

    // Afficher la phrase suivante lorsqu'on change l'index de phrase
    useEffect(() => {
        displayPhrase(phrases[currentPhraseIndex]);
        const timeout = setTimeout(nextPhrase, phrases[currentPhraseIndex].length * 100 + 1000); // Délai entre chaque phrase (en millisecondes)
        return () => clearTimeout(timeout);
    }, [currentPhraseIndex]);

    return (
        <div>
            <div className="flex flex-col min-h-screen bg-gray-800 text-white">
                <nav className="flex justify-between items-center py-4 px-8 m-8">
                    <h1 className="text-4xl font-bold mb-4">
                        Rec<span className="text-blue-500">Inter</span>View
                    </h1>
                    <div className="flex items-center">
                        <a href="" className="text-lg font-semibold ml-4">
                            Home
                        </a>
                        <a href="#features" className="text-lg font-semibold ml-4">
                            Fonctionnalités
                        </a>
                        <Link to="/profil"> {/* Utilisation de Link pour créer un lien vers la page de profil */}
                            <span className="text-lg font-semibold ml-4"> Candidat ? </span>
                        </Link>
                        <a href="#about" className="text-lg font-semibold ml-4">
                            À propos de nous
                        </a>
                    </div>
                    <button onClick={toggleModal} className="text-lg font-semibold ml-4 border border-white px-4 py-2 rounded-lg">
                        Contact
                    </button>
                </nav>
                <div className="flex flex-grow justify-center items-center m-8">
                    <div className="w-1/2 p-8">
                        <h1 className="text-4xl font-bold mb-4">
                            Vidéo pour toutes les étapes du{" "}
                            <span className="text-blue-500">recrutement</span>.
                        </h1>
                        <p className="text-lg">RecInterview vous permet de :</p>
                        <div className="text-lg mb-6">
                            <p>{currentDisplayPhrase}</p>
                        </div>
                        <Link to="/login"> {/* Utilisation de Link pour créer un lien vers la page de profil */}
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full">
                                Commencez votre essai gratuit de 3 semaines dès aujourd'hui
                            </button>
                        </Link>
                    </div>
                    <div className="w-1/2 p-8">
                        <div >
                            <iframe
                                width="560"
                                height="300"
                                src="https://www.youtube.com/embed/4UyH7SoA5l8?si=cBL-6PpyuyRPau9l"
                                title="Vidéo de présentation"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerpolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
                <div id="features" className="flex justify-center items-center bg-gray-800 py-12 m-8 ">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        <CardFonctionnalite
                            titre="Entièrement personnalisable"
                            description="RecView permet une personnalisation complète pour correspondre à votre marque. Votre nom, votre logo, votre couleur."
                        />
                        <CardFonctionnalite
                            titre="Entretiens vidéo en direct"
                            description="Salles de visioconférence illimitées pour enregistrer les entretiens avec vos clients et candidats. Transcription automatique des entretiens."
                        />
                        <CardFonctionnalite
                            titre="Portails client"
                            description="Permettez à vos clients de regarder les entretiens de candidats dans leur propre portail de marque. Ils peuvent également demander des entretiens et ajouter des offres d'emploi."
                        />
                        <CardFonctionnalite
                            titre="Extension Chrome"
                            description="Utilisez notre extension Chrome pour enregistrer des vidéos de prospection et de présentation pour les envoyer à vos clients et candidats potentiels."
                        />
                        <CardFonctionnalite
                            titre="Pages de réservation"
                            description="Permettez à vos clients et candidats de réserver directement dans votre calendrier, sans de longs échanges d'e-mails."
                        />
                        <CardFonctionnalite
                            titre="Solutions économiques"
                            description="Pas de contrats contraignants, tarification flexible. Parfait pour les agences de recrutement."
                        />
                    </div>
                </div>
                <div id="about" className="flex flex-col justify-center items-center bg-gray-700 py-12 m-8">
                    <p className="text-lg text-white mx-8 mb-4">
                        Une équipe qui comprend le recrutement. Notre équipe est assez unique. Nous gérons également Start In Recruitment et plaçons des commerciaux dans des agences de recrutement. Cela signifie que nous avons construit RecView pour nous-mêmes, en fonction des retours de nos clients - qui se trouvent être des recruteurs.
                    </p>
                    <img src="/images/image.png" alt="Votre image" className="w-1024 h-256" />

                </div>

                <footer className="text-center text-gray-400 text-sm py-4">
                    <p>
                        <a href="#" className="hover:text-white">Politique de confidentialité</a>
                        {" | "}
                        <a href="#" className="hover:text-white">Conditions générales</a>
                        {" | "}
                        © 2024 RecInterView, Tous droits réservés
                    </p>
                </footer>
            </div>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 transition-opacity duration-300" style={{ display: afficherModal ? 'flex' : 'none' }}>
                <div className="bg-black p-8 rounded-lg w-96 relative">
                    <h2 className="text-2xl font-semibold text-white mb-4">Formulaire de Contact</h2>
                    <form className="w-full">
                        <div className="mb-4 flex">
                            <input type="text" placeholder="Prénom" className="bg-gray-100 p-2 rounded-lg w-1/2 mr-2" />
                            <input type="text" placeholder="Nom de famille" className="bg-gray-100 p-2 rounded-lg w-1/2 ml-2" />
                        </div>
                        <div className="mb-4">
                            <input type="text" placeholder="Entreprise" className="bg-gray-100 p-2 rounded-lg w-full" />
                        </div>
                        <div className="mb-4">
                            <input type="email" placeholder="Email" className="bg-gray-100 p-2 rounded-lg w-full" />
                        </div>
                        <div className="mb-4">
                            <input type="tel" placeholder="Numéro de téléphone" className="bg-gray-100 p-2 rounded-lg w-full" />
                        </div>
                        <div className="mb-4">
                            <textarea placeholder="Message" className="bg-gray-100 p-2 rounded-lg w-full h-24"></textarea>
                        </div>
                        <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Envoyer</button>
                        <button onClick={toggleModal} className="absolute top-0 right-0 bg-transparent hover:bg-red-500 text-white font-semibold hover:text-white py-1 px-2 rounded-full">X</button> {/* Positionné absolument */}
                    </form>
                </div>
            </div>
        </div>
    );
}

// Composant pour une carte de fonctionnalité
function CardFonctionnalite({ titre, description }) {
    return (
        <div className="bg-white bg-opacity-20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{titre}</h2>
            <p className="text-lg">{description}</p>
        </div>
    );
}

export default Home;
