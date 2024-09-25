import React from 'react';
import { BsTrash } from 'react-icons/bs';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

const UserTable = ({ users, sortBy, sortDirection, handleSort, openConfirmModal, theme }) => (
    <>
        {/* Affichage en tableau pour les grands écrans */}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('totalCandidates')}>
                            Nb de Candidats
                            {sortBy === 'totalCandidates' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('totalPosts')}>
                            Nb de Postes
                            {sortBy === 'totalPosts' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-800">{user.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-800">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.totalCandidates}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.totalPosts}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button className="text-red-600 hover:text-red-900" onClick={() => openConfirmModal(user.id)}>
                                    <BsTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Affichage en mode cartes pour les écrans mobiles et tablettes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden p-4">
            {users.map(user => (
                <div key={user.id} className={`bg-white shadow-md rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
                    <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {user.email}</p>
                    <p className="text-sm text-gray-600 mb-1"><strong>Rôle:</strong> {user.role}</p>
                    <p className="text-sm text-gray-600 mb-1"><strong>Nb de Candidats:</strong> {user.totalCandidates}</p>
                    <p className="text-sm text-gray-600 mb-1"><strong>Nb de Postes:</strong> {user.totalPosts}</p>
                    <div className="flex justify-end mt-4">
                        <button className="text-red-600 hover:text-red-900" onClick={() => openConfirmModal(user.id)}>
                            <BsTrash />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </>
);

export default UserTable;
