// FinalModal.jsx
import React from 'react';
import Modal from 'react-modal';

const FinalModal = ({ isFinalModalOpen, closeFinalModal, handleQuit, theme, messageEnd }) => {
  return (
    <Modal
      isOpen={isFinalModalOpen}
      onRequestClose={closeFinalModal}
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      contentLabel="Fin de l'entretien"
      closeTimeoutMS={300}
      ariaHideApp={false}
    >
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg p-8 shadow-lg max-w-md w-full transition-colors duration-300`}>
        <h2 className="text-2xl font-bold mb-4">Merci d'avoir passé l'entretien</h2>
        <p className="mb-4">
          {messageEnd}
        </p>
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleQuit}
        >
          Quitter
        </button>
      </div>
    </Modal>
  );
};

export default FinalModal;
