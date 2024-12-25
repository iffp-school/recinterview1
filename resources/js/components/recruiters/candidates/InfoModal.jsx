// src/components/recruiter/Candidates/InfoModal.jsx
import React from 'react';
import Modal from 'react-modal';

const InfoModal = ({ isOpen, onRequestClose, candidate }) => {
  if (!candidate) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
    >
      <div className="bg-white p-4 rounded w-96 relative">
        <button 
          className="absolute top-0 right-0 m-2 text-xl font-bold" 
          onClick={onRequestClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-2">Informations</h2>
        <p><strong>Nom :</strong> {candidate.first_name} {candidate.last_name}</p>
        <p><strong>Email :</strong> {candidate.email}</p>
        <p><strong>Téléphone :</strong> {candidate.phone}</p>
        {/* Autres champs si besoin */}
      </div>
    </Modal>
  );
};

export default InfoModal;
