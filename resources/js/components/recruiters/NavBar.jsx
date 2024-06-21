import React from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Ajouter votre logique de déconnexion ici
        navigate('/');
    };

    return (
        <nav className="w-full bg-gray-900 p-4 flex justify-end items-center">
            <button
                className="text-white text-2xl mx-2 hover:text-gray-400"
                // onClick={() => navigate('/profile')}
            >
                <FaUserCircle />
            </button>
            <button
                className="text-white text-2xl mx-2 hover:text-gray-400"
                onClick={handleLogout}
            >
                <FaSignOutAlt />
            </button>
        </nav>
    );
}
