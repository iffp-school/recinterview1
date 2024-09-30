import React, { useEffect, useState } from 'react';
import { axiosClient } from '../../api/axios';
import Pagination from '../recruiters/common/Pagination'; // Assure-toi que le chemin est correct
import UserSearchBar from '../recruiters/candidates/SearchBar'; // Assure-toi que le chemin est correct
import NavBar from '../recruiters/NavBar';
import SideBar from '../recruiters/SideBar';

const Interviews = ({ theme, toggleTheme }) => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await axiosClient.get('/admin/interviews', {
                    params: {
                        page: currentPage,
                        per_page: 10, // Nombre d'éléments par page
                        search: searchTerm
                    }
                });
                setInterviews(response.data.interviews || []);
                setTotalPages(response.data.total_pages || 1);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des entretiens", error);
            }
        };
        fetchInterviews();
    }, [currentPage, searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };

    const handleViewResponses = (id) => {
        console.log(`Voir les réponses pour l'entretien avec ID: ${id}`);
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <SideBar theme={theme} />

            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Navbar */}
                <NavBar theme={theme} toggleTheme={toggleTheme} />

                {/* Title */}
                <h2 className="text-2xl font-bold mb-4">Gestion des Entretiens Terminés</h2>

                {/* Search Bar */}
                <UserSearchBar searchTerm={searchTerm} handleSearch={handleSearch} />

                {loading ? (
                    <p>Chargement...</p>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {interviews.map((interview) => (
                                <div key={interview.id} className={`shadow-lg rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}>
                                    <h3 className="text-lg font-bold mb-2">{interview.candidate_name}</h3>
                                    <p className="mb-2">
                                        <strong>Poste :</strong> {interview.post_title}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Recruteur :</strong> {interview.recruiter_name}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Statut :</strong> {interview.status}
                                    </p>
                                    <p className="text-sm mb-4 text-gray-500">
                                        <strong>Date :</strong> {new Date(interview.created_at).toLocaleDateString()}
                                    </p>
                                    <div className="flex justify-center">
                                        {/* Bouton pour voir les réponses */}
                                        <button
                                            onClick={() => handleViewResponses(interview.id)}
                                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                                        >
                                            Voir réponses
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Interviews;
