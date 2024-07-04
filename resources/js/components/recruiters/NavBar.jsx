import React, { useState } from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../../api/axios';
import ProfileModal from './ProfileModal'; // Assurez-vous que le chemin est correct

export default function NavBar() {
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
            <nav className="w-full bg-gray-900 p-4 flex justify-end items-center">
                <button
                    className="text-white text-2xl mx-2 hover:text-gray-400"
                    onClick={handleProfile}
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
            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
        </>
    );
}
