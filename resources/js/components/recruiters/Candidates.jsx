import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import SideBar from './SideBar';
import { axiosClient } from '../../api/axios';
import { FaTrash, FaVideo } from 'react-icons/fa';
import ReactPlayer from 'react-player';

export default function Candidates() {
    const [candidates, setCandidates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [recherche, setRecherche] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);

    const fetchCandidates = (page, searchTerm = '') => {
        axiosClient.get(`/candidates?page=${page}&limit=10&search=${searchTerm}`)
            .then(response => {
                setCandidates(response.data.candidates);
                setTotalPages(Math.ceil(response.data.total / 10));
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des candidats : ', error);
            });
    };

    useEffect(() => {
        fetchCandidates(currentPage, recherche);
    }, [currentPage, recherche]);

    const handleSearch = (e) => {
        setRecherche(e.target.value.toLowerCase());
        setCurrentPage(1); // Reset to first page when search term changes
    };

    const handleVideoClick = (videoUrl, question) => {
        setCurrentVideoUrl(videoUrl);
        setCurrentQuestion(question ? question.question_text : 'Question not found');
        setIsModalOpen(true);
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
                fetchCandidates(currentPage);
                closeConfirmModal();
            })
            .catch(error => {
                console.error('Erreur lors de la suppression du candidat : ', error);
                closeConfirmModal();
            });
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-800">
            <SideBar />
            <div className="w-full md:w-3/4 p-4">
                <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-4 py-2 w-full md:w-64  mb-2 md:mb-0"
                        placeholder="nom, email ou poste"
                        value={recherche}
                        onChange={handleSearch}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Nom
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Téléphone
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Poste
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Réponses
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {candidates.map((candidate, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-800">{candidate.first_name} {candidate.last_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-800">{candidate.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-800">{candidate.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-800">{candidate.post.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-2">
                                            {candidate.responses.map((response, index) => {
                                                const question = candidate.post.questions[index];
                                                return (
                                                    <div key={index} className="cursor-pointer" onClick={() => handleVideoClick(response.video_url, question)}>
                                                        <FaVideo className="text-blue-500 text-2xl" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => openConfirmModal(candidate.id)} className="text-red-500 hover:text-red-700">
                                            <FaTrash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-center">
                    <nav className="inline-flex">
                        {[...Array(totalPages)].map((_, page) => (
                            <button
                                key={page}
                                className={`px-4 py-2 mx-1 bg-blue-500 text-white rounded ${currentPage === page + 1 ? 'bg-blue-700' : ''}`}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                {page + 1}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
            >
                <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/2 lg:w-1/3 relative">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-0 right-0 m-2 text-black text-2xl font-bold"
                    >
                        &times;
                    </button>
                    <h2 className="text-xl font-bold mb-2">{currentQuestion}</h2>
                    <ReactPlayer url={currentVideoUrl} width="100%" height="100%" controls />
                </div>
            </Modal>

            <Modal
                isOpen={isConfirmModalOpen}
                onRequestClose={closeConfirmModal}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
            >
                <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/2 lg:w-1/3 relative">
                    <button
                        onClick={closeConfirmModal}
                        className="absolute top-0 right-0 m-2 text-black text-2xl font-bold"
                    >
                        &times;
                    </button>
                    <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
                    <p className="mb-4 text-gray-700">Êtes-vous sûr de vouloir supprimer ce candidat et toutes ses réponses ?</p>
                    <div className="flex justify-end">
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={confirmDeleteCandidate}
                        >
                            Supprimer
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            onClick={closeConfirmModal}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
