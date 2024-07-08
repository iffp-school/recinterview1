import React from 'react';
import Modal from 'react-modal';

const ConfirmationModal = ({ isOpen, onRequestClose, confirmAction, message }) => (
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
      <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
      <p className="mb-4 text-gray-700">{message || "Êtes-vous sûr de vouloir supprimer cet élément ?"}</p>
      <div className="flex justify-end">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={confirmAction}
        >
          Supprimer
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={onRequestClose}
        >
          Annuler
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmationModal;
