import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';
import { FaStar } from 'react-icons/fa';
import { axiosClient } from '../../../api/axios'; // Assurez-vous d'importer axiosClient

const VideoModal = ({ isModalOpen, setIsModalOpen, currentResponses, currentVideoIndex, setCurrentVideoIndex, fetchCandidates }) => {
  const [videoRating, setVideoRating] = useState(0);

  useEffect(() => {
    if (currentResponses && currentResponses[currentVideoIndex]) {
      setVideoRating(currentResponses[currentVideoIndex].rating || 0); // Charger la note existante ou 0
    }
  }, [currentVideoIndex, currentResponses]);

  if (!currentResponses || currentResponses.length === 0 || !currentResponses[currentVideoIndex]) {
    return null;
  }

  const currentVideo = currentResponses[currentVideoIndex];
  const currentVideoUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/${currentVideo.video_url}`;
  const currentQuestion = currentVideo.question || 'Question non trouvée';

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

  const handleRatingChange = async (newRating) => {
    setVideoRating(newRating); // Mettre à jour l'affichage en local

    try {
      const response = await axiosClient.put(`/responses/${currentVideo.id}/rating`, { rating: newRating });
      
      // Afficher un message de succès ou mettre à jour la note moyenne
      console.log('Nouvelle note moyenne du candidat:', response.data.candidate_average_rating);
      
      // Rafraîchir la liste des candidats (mise à jour du tableau des candidats)
      fetchCandidates();

    } catch (error) {
      console.error('Erreur lors de la mise à jour de la note :', error);
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
        <h2 className="text-xl font-bold mb-2">{currentQuestion}</h2>
        <ReactPlayer url={currentVideoUrl} width="100%" height="100%" controls />
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentVideoIndex === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Précédent
          </button>

          {/* Section des étoiles pour noter la vidéo */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, starIndex) => (
              <FaStar
                key={starIndex}
                className={`cursor-pointer ${starIndex < videoRating ? 'text-yellow-500' : 'text-gray-300'}`}
                onClick={() => handleRatingChange(starIndex + 1)}
              />
            ))}
          </div>

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
