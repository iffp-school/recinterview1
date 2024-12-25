// src/components/recruiter/Candidates/SendModal.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';

const SendModal = ({ isOpen, onRequestClose, candidate }) => {
  const [message, setMessage] = useState('');

  if (!candidate) return null;

  const handleSend = () => {
    // Ici tu mets la logique d'envoi (email, lien, etc.)
    console.log('Envoi en cours...', { to: candidate.email, message });
    onRequestClose();
  };

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
        <h2 className="text-xl font-bold mb-2">Envoyer un message</h2>
        <p>À : {candidate.email}</p>
        <textarea
          className="border mt-2 w-full p-2"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ton message ici..."
        />
        <button 
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
        >
          Envoyer
        </button>
      </div>
    </Modal>
  );
};

export default SendModal;
