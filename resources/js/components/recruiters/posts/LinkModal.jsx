import React from 'react';
import Modal from 'react-modal';

const LinkModal = ({ isLinkModalOpen, setIsLinkModalOpen, linkToSend, handleCopyLink, isLinkCopied }) => (
  <Modal
    isOpen={isLinkModalOpen}
    onRequestClose={() => setIsLinkModalOpen(false)}
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
  >
    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 relative">
      <button
        onClick={() => setIsLinkModalOpen(false)}
        className="absolute top-0 right-0 m-2 text-black text-2xl font-bold"
      >
        &times;
      </button>
      <h2 className="text-xl font-semibold mb-4">Envoyer le lien</h2>
      <p className="mb-4">Copiez le lien ci-dessous et envoyez-le au candidat :</p>
      <div className="border border-gray-300 rounded px-4 py-2 mb-4 w-full bg-gray-100 text-gray-800">
        {linkToSend}
      </div>
      <button
        className={`px-4 py-2 rounded-md ${isLinkCopied ? 'bg-green-600' : 'bg-blue-600'} text-white`}
        onClick={handleCopyLink}
      >
        {isLinkCopied ? 'Lien copié!' : 'Copier le lien'}
      </button>
    </div>
  </Modal>
);

export default LinkModal;
