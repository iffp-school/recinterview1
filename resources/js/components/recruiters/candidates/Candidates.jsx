import React, { useState, useEffect } from 'react';
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
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);

  const fetchCandidates = (page, searchTerm = '', sortBy = '', sortDirection = 'asc') => {
    axiosClient.get(`/candidates`, {
      params: {
        page,
        limit: 10,
        search: searchTerm,
        sort_by: sortBy,
        sort_direction: sortDirection
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

  useEffect(() => {
    fetchCandidates(currentPage, recherche, sortBy, sortDirection);
  }, [currentPage, recherche, sortBy, sortDirection]);

  const handleSearch = (e) => {
    setRecherche(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortDirection(newSortDirection);
  };

  const handleVideoClick = (videoUrl, question) => {
    const newVideoUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/${videoUrl}`;
    setCurrentVideoUrl(newVideoUrl);
    setCurrentQuestion(question ? question.question_text : 'Question not found');
    setIsModalOpen(true);
  };

  const handleDownloadCV = (cvUrl) => {
    const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/${cvUrl}`;
    window.open(downloadUrl, '_blank');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
      </div>
      <VideoModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentVideoUrl={currentVideoUrl}
        currentQuestion={currentQuestion}
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
