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

  // Fonction fetchCandidates qui est appelée pour récupérer les candidats
  const fetchCandidates = (page, searchTerm = '', sortBy = '', sortDirection = 'asc', postId = null) => {
    axiosClient.get(`/candidates`, {
      params: {
        page,
        limit: 10,
        search: searchTerm,
        sort_by: sortBy,
        sort_direction: sortDirection,
        post_id: postId
      }
    })
      .then(response => {
        setCandidates(response.data.candidates);
        setTotalPages(Math.ceil(response.data.total / 10));
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des candidats : ', error);
      });
  };

  // Appeler fetchCandidates lors du montage et lors des changements de page/recherche
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search); // Pour récupérer les query params
    const postId = queryParams.get('post_id'); // Obtenir le post_id si présent
    const postTitle = queryParams.get('post_title'); // Obtenir le post_title si présent

    // Si un titre de poste est passé dans l'URL, pré-remplir la recherche
    if (postTitle) {
      setRecherche(postTitle.toLowerCase());
    }

    fetchCandidates(currentPage, recherche, sortBy, sortDirection, postId); // Filtrer par post_id
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

  const handleVideoClick = (responses, questions) => {
    // Vérification que les deux tableaux existent et ont des éléments
    if (!responses || responses.length === 0) {
      console.error("Aucune réponse disponible pour ce candidat.");
      return;
    }

    if (!questions || questions.length === 0) {
      console.error("Aucune question disponible pour ce poste.");
      return;
    }

    // Associer chaque réponse à une question en fonction de leur index
    const responsesWithQuestions = responses.map((response, index) => ({
      video_url: response.video_url,
      question: questions[index] ? questions[index].question_text : 'Question non trouvée'
    }));

    setCurrentResponses(responsesWithQuestions);  // Mettre à jour les réponses avec les questions associées
    setCurrentVideoIndex(0);  // Réinitialiser à la première vidéo
    setIsModalOpen(true);  // Ouvrir la modal
  };



  const handleDownloadCV = (cvUrl) => {
    const downloadUrl = cvUrl;
    window.open(downloadUrl, '_blank');
  };

  const openConfirmModal = (id) => {
    setCandidateToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setCandidateToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const confirmDeleteCandidate = () => {
    axiosClient.delete(`/candidates/${candidateToDelete}`)
      .then(() => {
        fetchCandidates(currentPage, recherche, sortBy, sortDirection);
        closeConfirmModal();
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du candidat : ', error);
        closeConfirmModal();
      });
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col md:flex-row h-screen transition-colors duration-300`}>
      <SideBar theme={theme} />
      <div className="w-full">
        <NavBar theme={theme} toggleTheme={toggleTheme} />
        <div className="p-4">
          <CandidateSearchBar
            searchTerm={recherche}
            handleSearch={handleSearch}
          />
          <CandidateTable
            candidates={candidates}
            sortBy={sortBy}
            sortDirection={sortDirection}
            handleSort={handleSort}
            handleVideoClick={handleVideoClick}
            handleDownloadCV={handleDownloadCV}
            openConfirmModal={openConfirmModal}
            fetchCandidates={fetchCandidates}  // Passez fetchCandidates ici
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
      </div>
      <VideoModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentResponses={currentResponses}
        currentVideoIndex={currentVideoIndex}
        setCurrentVideoIndex={setCurrentVideoIndex}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onRequestClose={closeConfirmModal}
        confirmAction={confirmDeleteCandidate}
        message="Êtes-vous sûr de vouloir supprimer ce candidat et toutes ses réponses ?"
      />
    </div>
  );
}
