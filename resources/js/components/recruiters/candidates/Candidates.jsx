// src/components/recruiter/Candidates/Candidates.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from '../SideBar';
import NavBar from '../NavBar';
import { axiosClient } from '../../../api/axios';
import CandidateTable from './CandidateTable';
import VideoModal from './VideoModal';
import ConfirmationModal from '../common/ConfirmationModal';
import CandidateSearchBar from './CandidateSearchBar';
import Pagination from '../common/Pagination';

// Import des 2 nouvelles modales
import InfoModal from './InfoModal';
import SendModal from './SendModal';

export default function Candidates({ theme, toggleTheme }) {
    const [candidates, setCandidates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [recherche, setRecherche] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentResponses, setCurrentResponses] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);
    const location = useLocation();
    const [videoRatings, setVideoRatings] = useState({});

    // Modale Info
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [currentCandidateForInfo, setCurrentCandidateForInfo] = useState(null);

    // Modale Send
    const [showSendModal, setShowSendModal] = useState(false);
    const [currentCandidateForSend, setCurrentCandidateForSend] = useState(null);

    const fetchCandidates = (
        page,
        searchTerm = '',
        sortBy = '',
        sortDirection = 'asc',
        postId = null
    ) => {
        axiosClient
            .get(`/candidates`, {
                params: {
                    page,
                    limit: 10,
                    search: searchTerm,
                    sort_by: sortBy,
                    sort_direction: sortDirection,
                    post_id: postId,
                },
            })
            .then((response) => {
                setCandidates(response.data.candidates);
                setTotalPages(Math.ceil(response.data.total / 10));
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des candidats : ', error);
            });
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const postId = queryParams.get('post_id');
        const postTitle = queryParams.get('post_title');

        if (postTitle) {
            setRecherche(postTitle.toLowerCase());
        }

        fetchCandidates(currentPage, recherche, sortBy, sortDirection, postId);
    }, [currentPage, recherche, sortBy, sortDirection, location.search]);

    const handleSearch = (e) => {
        setRecherche(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const handleSort = (column) => {
        const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortDirection(newSortDirection);
    };

    // Ouvrir la modal vidéo
    const handleVideoClick = (responses, questions) => {
        if (!responses || responses.length === 0) {
            console.error('Aucune réponse disponible pour ce candidat.');
            return;
        }
        if (!questions || questions.length === 0) {
            console.error('Aucune question disponible pour ce poste.');
            return;
        }

        const responsesWithQuestions = responses.map((response, index) => ({
            video_url: response.video_url,
            question: questions[index]
                ? questions[index].question_text
                : 'Question non trouvée',
            rating: response.rating,
        }));

        setCurrentResponses(responsesWithQuestions);
        setCurrentVideoIndex(0);
        setIsModalOpen(true);
    };

    // Télécharger le CV
    const handleDownloadCV = (cvUrl) => {
        window.open(cvUrl, '_blank');
    };

    // Supprimer un candidat
    const openConfirmModal = (id) => {
        setCandidateToDelete(id);
        setIsConfirmModalOpen(true);
    };
    const closeConfirmModal = () => {
        setCandidateToDelete(null);
        setIsConfirmModalOpen(false);
    };
    const confirmDeleteCandidate = () => {
        axiosClient
            .delete(`/candidates/${candidateToDelete}`)
            .then(() => {
                fetchCandidates(currentPage, recherche, sortBy, sortDirection);
                closeConfirmModal();
            })
            .catch((error) => {
                console.error('Erreur lors de la suppression du candidat : ', error);
                closeConfirmModal();
            });
    };

    // Actions pour ouvrir/fermer la modal Info
    const handleInfoClick = (candidate) => {
        setCurrentCandidateForInfo(candidate);
        setShowInfoModal(true);
    };
    const closeInfoModal = () => {
        setCurrentCandidateForInfo(null);
        setShowInfoModal(false);
    };

    // Actions pour ouvrir/fermer la modal Send
    const handleSendClick = (candidate) => {
        setCurrentCandidateForSend(candidate);
        setShowSendModal(true);
    };
    const closeSendModal = () => {
        setCurrentCandidateForSend(null);
        setShowSendModal(false);
    };

    const handleCandidateRating = async (candidateId, newRating) => {
        try {
          // Envoie la requête PUT vers /candidates/:id/rating
          await axiosClient.put(`/candidates/${candidateId}/rating`, {
            rating: newRating,
          });
          // Puis on rafraîchit la liste
          fetchCandidates(currentPage, recherche, sortBy, sortDirection);
        } catch (error) {
          console.error('Erreur lors de la mise à jour du rating candidat:', error);
        }
      };
      

    return (
        <div
            className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
                } flex flex-col md:flex-row h-screen transition-colors duration-300`}
        >
            <SideBar theme={theme} />
            <div className="w-full">
                <NavBar theme={theme} toggleTheme={toggleTheme} />
                <div className="p-4">
                    <CandidateSearchBar searchTerm={recherche} handleSearch={handleSearch} />
                    <CandidateTable
                        candidates={candidates}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                        handleVideoClick={handleVideoClick}
                        handleDownloadCV={handleDownloadCV}
                        openConfirmModal={openConfirmModal}
                        // Passer nos fonctions pour les modales
                        handleInfoClick={handleInfoClick}
                        handleSendClick={handleSendClick}
                        handleCandidateRating={handleCandidateRating}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>

            {/* Modal vidéo */}
            <VideoModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                currentResponses={currentResponses}
                currentVideoIndex={currentVideoIndex}
                setCurrentVideoIndex={setCurrentVideoIndex}
                videoRatings={videoRatings}
                setVideoRatings={setVideoRatings}
            />

            {/* Modal confirmation suppression */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onRequestClose={closeConfirmModal}
                confirmAction={confirmDeleteCandidate}
                message="Êtes-vous sûr de vouloir supprimer ce candidat et toutes ses réponses ?"
            />

            {/* Modal Info */}
            <InfoModal
                isOpen={showInfoModal}
                onRequestClose={closeInfoModal}
                candidate={currentCandidateForInfo}
            />

            {/* Modal Send */}
            <SendModal
                isOpen={showSendModal}
                onRequestClose={closeSendModal}
                candidate={currentCandidateForSend}
            />
        </div>
    );
}
