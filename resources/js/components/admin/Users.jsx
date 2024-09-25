import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import SideBar from '../recruiters/SideBar';
import NavBar from '../recruiters/NavBar';
import { axiosClient } from '../../api/axios';
import UserTable from './UserTable';
import ConfirmationModal from '../recruiters/common/ConfirmationModal';
import UserSearchBar from './UserSearchBar';
import Pagination from '../recruiters/common/Pagination';

export default function Users({ theme, toggleTheme }) {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = (page, searchTerm = '', sortBy = '', sortDirection = 'asc') => {
        axiosClient.get(`/users`, {
            params: {
                page,
                limit: 10,
                search: searchTerm,
                sort_by: sortBy,
                sort_direction: sortDirection,
            }
        })
            .then(response => {
                setUsers(response.data.users);
                setTotalPages(Math.ceil(response.data.total / 10));
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des utilisateurs : ', error);
            });
    };

    useEffect(() => {
        fetchUsers(currentPage, searchTerm, sortBy, sortDirection);
    }, [currentPage, searchTerm, sortBy, sortDirection]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const handleSort = (column) => {
        const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortDirection(newSortDirection);
    };

    const openConfirmModal = (id) => {
        setUserToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setUserToDelete(null);
        setIsConfirmModalOpen(false);
    };

    const confirmDeleteUser = () => {
        axiosClient.delete(`/users/${userToDelete}`)
            .then(() => {
                fetchUsers(currentPage, searchTerm, sortBy, sortDirection);
                closeConfirmModal();
            })
            .catch(error => {
                console.error("Erreur lors de la suppression de l'utilisateur : ", error);
                closeConfirmModal();
            });
    };

    return (
        <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col md:flex-row h-screen transition-colors duration-300`}>
            <SideBar theme={theme} />
            <div className="w-full">
                <NavBar theme={theme} toggleTheme={toggleTheme} />
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        {/* Conteneur flex pour la barre de recherche et l'icône plus */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <UserSearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
                            <button className="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-600 flex items-center gap-1 text-lg">
                                <FaPlus />
                            </button>
                        </div>
                    </div>
                    <UserTable
                        users={users}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                        openConfirmModal={openConfirmModal}
                        theme={theme}  // Passer la prop theme ici
                    />
                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </div>
            </div>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onRequestClose={closeConfirmModal}
                confirmAction={confirmDeleteUser}
                message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
            />
        </div>
    );
}
