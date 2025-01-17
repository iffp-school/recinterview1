import React, { useState } from 'react';
import { BsTrash, BsSend, BsPencilSquare } from 'react-icons/bs'; // Icône de modification
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import EmailModal from './EmailModal';

const UserTable = ({ users, sortBy, sortDirection, handleSort, openConfirmModal, openEditModal, theme }) => {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState('');

    const openEmailModal = (user) => {
        setSelectedUserEmail(user.email);
        setIsEmailModalOpen(true);
    };

    const closeEmailModal = () => {
        setIsEmailModalOpen(false);
        setSelectedUserEmail('');
    };

    return (
        <>
            <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                                Nom
                                {sortBy === 'name' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                                Email
                                {sortBy === 'email' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('role')}>
                                Rôle
                                {sortBy === 'role' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        {/* Bouton pour supprimer */}
                                        <button className="text-red-600 hover:text-red-900" onClick={() => openConfirmModal(user.id)}>
                                            <BsTrash />
                                        </button>
                                        {/* Bouton pour envoyer un email */}
                                        <button className="text-blue-600 hover:text-blue-900" onClick={() => openEmailModal(user)}>
                                            <BsSend />
                                        </button>
                                        {/* Bouton pour modifier */}
                                        <button className="text-green-600 hover:text-green-900" onClick={() => openEditModal(user)}>
                                            <BsPencilSquare />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Modal d'envoi d'email */}
            <EmailModal
                isOpen={isEmailModalOpen}
                onClose={closeEmailModal}
                recipientEmail={selectedUserEmail}
            />
        </>
    );
};

export default UserTable;
