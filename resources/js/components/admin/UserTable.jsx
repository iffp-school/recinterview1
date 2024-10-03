import React, { useState } from 'react';
import { BsTrash, BsSend } from 'react-icons/bs';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import EmailModal from './EmailModal'; // Importation de la modal d'envoi d'email

const UserTable = ({ users, sortBy, sortDirection, handleSort, openConfirmModal, theme }) => {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState('');

    const openEmailModal = (user) => {
        setSelectedUserEmail(user.email); // Préremplir l'email de l'utilisateur sélectionné
        setIsEmailModalOpen(true);
    };

    const closeEmailModal = () => {
        setIsEmailModalOpen(false);
        setSelectedUserEmail('');
    };

    return (
        <>
            {/* Tableau pour les écrans larges */}
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
                                        {/* Bouton pour supprimer l'utilisateur */}
                                        <button className="text-red-600 hover:text-red-900" onClick={() => openConfirmModal(user.id)}>
                                            <BsTrash />
                                        </button>
                                        {/* Bouton pour envoyer un email */}
                                        <button className="text-blue-600 hover:text-blue-900" onClick={() => openEmailModal(user)}>
                                            <BsSend />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vue pour mobile et tablette */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden p-4">
                {users.map(user => (
                    <div key={user.id} className={`bg-white shadow-md rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
                        <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
                        <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {user.email}</p>
                        <p className="text-sm text-gray-600 mb-1"><strong>Rôle:</strong> {user.role}</p>
                        <div className="flex justify-end mt-4">
                            <button className="text-blue-600 hover:text-blue-900" onClick={() => openEmailModal(user)}>
                                <BsSend />
                            </button>
                        </div>
                    </div>
                ))}
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
