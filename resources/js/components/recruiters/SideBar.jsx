import React from 'react';
import { Link } from 'react-router-dom';

export default function SideBar({ theme }) {
    // Récupérer le rôle de l'utilisateur depuis le localStorage
    const userRole = localStorage.getItem('role');

    return (
        <div className={`w-full md:w-1/4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} p-4 flex flex-col items-center md:items-start transition-colors duration-300 shadow-lg`}>
            <Link to={userRole === 'administrateur' ? "/admin/dashboard" : "/recruiter/home"}>
                <h1 className="text-4xl font-bold mb-4 text-center md:text-left">
                    Rec<span className="text-blue-500">Inter</span>View
                </h1>
            </Link>
            <ul className="w-full">
                {userRole !== 'administrateur' ? (
                    <>
                        {/* Liens spécifiques au recruteur */}
                        <li className="mb-2">
                            <Link to="/recruiter/dashboard" className={`block w-full ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'} py-2 px-4 rounded mb-1 text-center md:text-left transition-colors duration-300 font-bold text-white`}>
                                Dashboard
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/recruiter/posts" className={`block w-full ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'} py-2 px-4 rounded mb-1 text-center md:text-left transition-colors duration-300 font-bold text-white`}>
                                Posts
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/recruiter/candidates" className={`block w-full ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'} py-2 px-4 rounded mb-1 text-center md:text-left transition-colors duration-300 font-bold text-white`}>
                                Candidates
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        {/* Liens spécifiques à l'administrateur */}
                        <li className="mb-2">
                            <Link to="/admin/dashboard" className={`block w-full ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'} py-2 px-4 rounded mb-1 text-center md:text-left transition-colors duration-300 font-bold text-white`}>
                                Dashboard
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/admin/users" className={`block w-full ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'} py-2 px-4 rounded mb-1 text-center md:text-left transition-colors duration-300 font-bold text-white`}>
                                Utilisateurs
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/recruiter/posts" className={`block w-full ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'} py-2 px-4 rounded mb-1 text-center md:text-left transition-colors duration-300 font-bold text-white`}>
                                Posts
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/recruiter/candidates" className={`block w-full ${theme === 'dark' ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-400'} py-2 px-4 rounded mb-1 text-center md:text-left transition-colors duration-300 font-bold text-white`}>
                                Candidates
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}
