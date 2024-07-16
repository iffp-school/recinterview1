import React, { useState } from 'react';
import { FaUserCircle, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../../api/axios';
import ProfileModal from './candidates/ProfileModal';

export default function NavBar({ theme, toggleTheme }) {
    const navigate = useNavigate();
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axiosClient.post('/logout', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const handleProfile = () => {
        setProfileModalOpen(true);
    };

    return (
        <>
            <nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} w-full p-4 flex justify-end items-center transition-colors duration-300 shadow-lg rounded-lg`}>
                <button
                    className={`${theme === 'dark' ? 'text-white hover:text-gray-400' : 'text-gray-900 hover:text-gray-700'} text-xl mx-2`}
                    onClick={handleProfile}
                >
                    <FaUserCircle />
                </button>
                <button
                    className={`${theme === 'dark' ? 'text-white hover:text-gray-400' : 'text-gray-900 hover:text-gray-700'} text-xl mx-2`}
                    onClick={handleLogout}
                >
                    <FaSignOutAlt />
                </button>
                <button
                    className={`${theme === 'dark' ? 'text-white hover:text-gray-400' : 'text-gray-900 hover:text-gray-700'} text-xl mx-2`}
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
            </nav>
            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
        </>
    );
}
