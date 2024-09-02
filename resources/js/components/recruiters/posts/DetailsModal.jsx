import React from 'react';
import Modal from 'react-modal';

const convertSecondsToMinutes = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `${remainingSeconds} secondes`;
  if (remainingSeconds === 0) return `${minutes} minutes`;
  return `${minutes} minutes et ${remainingSeconds} secondes`;
};

const DetailsModal = ({ showDetailsModal, handleCloseDetailsModal, currentPost }) => (
  <Modal
    isOpen={showDetailsModal}
    onRequestClose={handleCloseDetailsModal}
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
  >
    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 relative">
      <button
        onClick={handleCloseDetailsModal}
        className="absolute top-0 right-0 m-2 text-black text-2xl font-bold"
      >
        &times;
      </button>
      <h2 className="text-xl font-semibold mb-4">{currentPost.title}</h2>
      <p className="text-gray-600 mb-4">Date de création:
        {new Date(currentPost.created_at).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <h3 className="text-lg font-semibold mb-2">Description</h3>
      <div className="text-gray-800 mb-4" dangerouslySetInnerHTML={{ __html: currentPost.description }} />
      <h3 className="text-lg font-semibold mb-2">Questions</h3>
      <ul>
        {currentPost.questions && currentPost.questions.map((question, index) => (
          <li key={index} className="text-gray-800 mb-2">
            Question {index + 1}: {question.question_text} <br />
            Temps de préparation: {convertSecondsToMinutes(question.preparation_time)} <br />
            Temps de réponse: {convertSecondsToMinutes(question.response_time)}
          </li>
        ))}
      </ul>
    </div>
  </Modal>
);

export default DetailsModal;
