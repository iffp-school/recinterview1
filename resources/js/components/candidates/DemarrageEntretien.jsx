import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DemarrageEntretien() {
    const navigate = useNavigate();

    const [accesWebcamAutorise, setAccesWebcamAutorise] = useState(false);

    const demarrerEnregistrement = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => {
                setAccesWebcamAutorise(true);
                navigate('/enregistrement');
            })
            .catch((error) => {
                console.error('Erreur lors de l\'accès à la webcam : ', error);
                alert('Erreur lors de l\'accès à la webcam. Veuillez autoriser l\'accès pour démarrer l\'enregistrement.');
            });
    };

    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center">
            <div className="max-w-md w-full bg-gray-800 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-2xl font-bold mb-4">Bienvenue dans notre processus d'entretien asynchrone</h2>
                <p className="text-gray-300 text-base mb-4">
                    Prenez votre temps pour enregistrer vos réponses aux questions suivantes. Suivez les instructions fournies pour un enregistrement réussi.
                    Vous trouverez une suite de questions suivie de vos réponses enregistrées. Les questions du recruteur sont  présentées sous forme de textes.
                    Après avoir enregistré une réponse, vous aurez la possibilité de la réenregistrer si nécessaire avant de la soumettre.
                </p>
                <button
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={demarrerEnregistrement}
                >
                    Démarrer l'enregistrement
                </button>
            </div>
        </div>
    );
}

export default DemarrageEntretien;
