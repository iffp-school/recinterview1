import React from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';

const VideoModal = ({ isModalOpen, setIsModalOpen, currentResponses, currentVideoIndex, setCurrentVideoIndex }) => {
  if (!currentResponses || currentResponses.length === 0 || !currentResponses[currentVideoIndex]) {
    return null;
  }

  const currentVideo = currentResponses[currentVideoIndex];
  const currentVideoUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/${currentVideo.video_url}`;
  const currentQuestion = currentVideo.question || 'Question non trouvée';  // Récupérer la question ou afficher un message d'erreur

  const handleNext = () => {
    if (currentVideoIndex < currentResponses.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
    >
      <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/2 lg:w-1/3 relative">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-0 right-0 m-2 text-black text-2xl font-bold"
        >
          &times;
        </button>
        {/* Afficher la question */}
        <h2 className="text-xl font-bold mb-2">{currentQuestion}</h2>
        {/* Afficher la vidéo */}
        <ReactPlayer url={currentVideoUrl} width="100%" height="100%" controls />
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentVideoIndex === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={handleNext}
            disabled={currentVideoIndex === currentResponses.length - 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VideoModal;
