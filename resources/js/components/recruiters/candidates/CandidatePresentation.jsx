// src/components/recruiters/candidates/CandidatePresentation.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaPlayCircle } from 'react-icons/fa';
import VideoModal from './VideoModal';

export default function CandidatePresentation() {
    const { id } = useParams();  // Récupérer l'ID du candidat depuis l'URL
    const [candidate, setCandidate] = useState(null);  // État pour stocker les informations du candidat
    const [loading, setLoading] = useState(true);  // État pour l'affichage de chargement
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    useEffect(() => {
        // Requête pour récupérer les données du candidat
        axios.get(`/candidates/${id}/data`)
            .then(response => {
                setCandidate(response.data);
                console.log('Données du candidat :', response.data);
                setLoading(false);  // Désactiver l'affichage de chargement
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données du candidat :', error);
                setLoading(false);
            });
    }, [id]);

    const openModal = (index) => {
        setCurrentVideoIndex(index);
        setIsModalOpen(true);
    };

    if (loading) {
        return <p className="text-center text-gray-500 mt-8">Chargement des données du candidat...</p>;
    }

    if (!candidate) {
        return <p className="text-center text-red-500 mt-8">Erreur : Candidat non trouvé.</p>;
    }

    return (
        <div className="p-4 sm:p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10">
            {/* Informations générales */}
            <div className="flex flex-col items-center text-center mb-6">
                <img
                    src={candidate.photo_url || '/default-photo.png'}
                    alt="Photo du candidat"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-4 border border-gray-300"
                />
                <h2 className="text-xl sm:text-2xl font-bold">{candidate.first_name} {candidate.last_name}</h2>
                <p className="text-gray-600 text-sm mt-1">{candidate.post?.title || 'Poste non spécifié'}</p>
                <p className="text-gray-500 text-sm">Date de candidature : {new Date(candidate.created_at).toLocaleString("fr-FR")}</p>
            </div>

            {/* Section des vidéos de réponses */}
            <div className="mt-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Réponses Vidéo</h3>
                {candidate.responses && candidate.responses.length > 0 ? (
                    candidate.responses.map((response, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-4">
                            <p className="text-gray-700 font-medium">Question : {response.question || 'Question non trouvée'}</p>
                            <p className="text-gray-700 font-medium">Réponse : </p>
                            <FaPlayCircle
                                className="text-4xl text-blue-500 cursor-pointer hover:text-blue-700"
                                onClick={() => openModal(index)}
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Aucune réponse vidéo disponible pour ce candidat.</p>
                )}
            </div>

            {/* Modal pour afficher la vidéo */}
            <VideoModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                currentResponses={candidate.responses}
                currentVideoIndex={currentVideoIndex}
                setCurrentVideoIndex={setCurrentVideoIndex}
            />
        </div>
    );
}
