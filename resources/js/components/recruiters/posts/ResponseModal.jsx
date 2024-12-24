import React, { useState } from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';

const ResponseModal = ({ isOpen, onRequestClose, responseDetails }) => {
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // 1) Vérifier que responseDetails.responses existe et n'est pas vide
  if (!responseDetails || !responseDetails.responses || responseDetails.responses.length === 0) {
    return null;
  }

  // 2) Récupérer le candidat courant et sa réponse courante
  const currentCandidate = responseDetails.responses[currentCandidateIndex];
  if (!currentCandidate || !currentCandidate.responses || currentCandidate.responses.length === 0) {
    return null; 
  }

  const currentResponse = currentCandidate.responses[currentVideoIndex];
  // Petite sécurité pour éviter qu'un clic rapide ne cause un out-of-bound
  if (!currentResponse) {
    return null;
  }

  // 3) Construire l'URL de la vidéo et récupérer la question
  const currentVideoUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/${currentResponse.video_url}`;
  const currentQuestion = currentResponse.question || 'Question non trouvée';

  // 4) Gestion du clic sur "Suivant"
  const handleNextVideo = () => {
    // Si on n'est pas à la fin des vidéos du candidat courant
    if (currentVideoIndex < currentCandidate.responses.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } 
    // Sinon, si on n'est pas au dernier candidat, passer au candidat suivant
    else if (currentCandidateIndex < responseDetails.responses.length - 1) {
      setCurrentCandidateIndex(currentCandidateIndex + 1);
      setCurrentVideoIndex(0);
    }
    // Sinon on est au tout dernier candidat et à sa dernière réponse
    else {
      // On peut décider de ne rien faire ou d'afficher un message
      // console.log("Aucune vidéo suivante !");
    }
  };

  // 5) Gestion du clic sur "Précédent"
  const handlePreviousVideo = () => {
    // Si on peut encore revenir en arrière dans les vidéos
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
    // Sinon, si on n'est pas au premier candidat, revenir au candidat précédent
    else if (currentCandidateIndex > 0) {
      setCurrentCandidateIndex(currentCandidateIndex - 1);
      const previousCandidate = responseDetails.responses[currentCandidateIndex - 1];
      setCurrentVideoIndex(previousCandidate.responses.length - 1);
    }
    // Sinon, on est déjà à la première vidéo du premier candidat
    else {
      // On peut décider de ne rien faire ou d'afficher un message
      // console.log("Aucune vidéo précédente !");
    }
  };

  // 6) Détermination des états "disabled" des boutons
  const isFirstVideoOverall = currentCandidateIndex === 0 && currentVideoIndex === 0;
  const isLastVideoOverall =
    currentCandidateIndex === responseDetails.responses.length - 1 &&
    currentVideoIndex === currentCandidate.responses.length - 1;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
    >
      <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/2 lg:w-1/3 relative">
        
        {/* Bouton fermer (croix) */}
        <button
          onClick={onRequestClose}
          className="absolute top-0 right-0 m-2 text-black text-2xl font-bold"
        >
          &times;
        </button>

        {/* Informations du candidat avec numéro et poste */}
        <h2 className="text-lg font-semibold mb-1 flex justify-between items-center">
          <span>
            Candidat {currentCandidateIndex + 1}/{responseDetails.responses.length} :
            {' '} {currentCandidate.candidate.first_name} {currentCandidate.candidate.last_name}
          </span>
          <span className="mx-auto text-gray-500">
            Poste: {responseDetails.post_title}
          </span>
        </h2>

        {/* Afficher la question avec numéro */}
        <h3 className="text-md font-medium mb-2">
          Question {currentVideoIndex + 1}/{currentCandidate.responses.length} : {currentQuestion}
        </h3>

        {/* Afficher la vidéo */}
        <div className="mb-4">
          <ReactPlayer 
            url={currentVideoUrl}
            width="100%"
            height="100%"
            controls 
          />
        </div>

        {/* Boutons Précédent / Suivant */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousVideo}
            disabled={isFirstVideoOverall}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={handleNextVideo}
            disabled={isLastVideoOverall}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default ResponseModal;
