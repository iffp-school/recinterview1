import React from 'react';

const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Besoin d'aide ?</h2>
                <p>Envoyez un email au support : <a href="mailto:support-it@iffp.school" className="text-blue-500">support-it@iffp.school</a></p>
                <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Fermer</button>
            </div>
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        </div>
    );
};

export default HelpModal;