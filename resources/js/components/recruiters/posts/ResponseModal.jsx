import React, { useState } from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';

const ResponseModal = ({ isOpen, onRequestClose, responseDetails }) => {
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  if (!responseDetails || !responseDetails.responses || responseDetails.responses.length === 0) {
    return null;
  }


  const currentCandidate = responseDetails.responses[currentCandidateIndex];
  const currentResponse = currentCandidate.responses[currentVideoIndex];
  const currentVideoUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/${currentResponse.video_url}`;
  const currentQuestion = currentResponse.question || 'Question non trouvée';

  const handleNextVideo = () => {
    if (currentVideoIndex < currentCandidate.responses.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else if (currentCandidateIndex < responseDetails.responses.length - 1) {
      // Passer au prochain candidat et réinitialiser l'index des vidéos
      setCurrentCandidateIndex(currentCandidateIndex + 1);
      setCurrentVideoIndex(0);
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    } else if (currentCandidateIndex > 0) {
      // Revenir au candidat précédent et aller à sa dernière vidéo
      setCurrentCandidateIndex(currentCandidateIndex - 1);
      const previousCandidate = responseDetails.responses[currentCandidateIndex - 1];
      setCurrentVideoIndex(previousCandidate.responses.length - 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
    >
      <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/2 lg:w-1/3 relative">
        <button
          onClick={onRequestClose}
          className="absolute top-0 right-0 m-2 text-black text-2xl font-bold"
        >
          &times;
        </button>

        {/* Informations du candidat avec numéro et poste */}
        <h2 className="text-lg font-semibold mb-1 flex justify-between items-center">
          <span>Candidat {currentCandidateIndex + 1}/{responseDetails.responses.length}: {currentCandidate.candidate.first_name} {currentCandidate.candidate.last_name}</span>
          <span className="mx-auto text-gray-500">Poste: {responseDetails.post_title}</span>
        </h2>

        {/* Afficher la question avec numéro */}
        <h3 className="text-md font-medium mb-2">
          Question {currentVideoIndex + 1}/{currentCandidate.responses.length}: {currentQuestion}
        </h3>

        {/* Afficher la vidéo */}
        <div className="mb-4">
          <ReactPlayer url={currentVideoUrl} width="100%" height="100%" controls />
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousVideo}
            disabled={currentCandidateIndex === 0 && currentVideoIndex === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={handleNextVideo}
            disabled={currentCandidateIndex === responseDetails.responses.length - 1 && currentVideoIndex === currentCandidate.responses.length - 1}
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
