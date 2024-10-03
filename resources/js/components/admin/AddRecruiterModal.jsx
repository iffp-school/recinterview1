import React, { useState } from 'react';
import { axiosClient } from '../../api/axios';

const AddRecruiterModal = ({ isOpen, onClose, fetchUsers }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddRecruiter = async () => {
        setLoading(true);
        try {
            // Requête pour créer un utilisateur avec le rôle recruteur
            await axiosClient.post('/users', {
                name,
                email,
                password,
                role: 'recruiter',
                company_name: companyName
            });

            // Rafraîchir la liste des utilisateurs après l'ajout
            fetchUsers();
            onClose(); // Fermer la modal après l'ajout
        } catch (error) {
            console.error('Erreur lors de l\'ajout du recruteur', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null; // Ne pas afficher la modal si elle n'est pas ouverte

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    X {/* Bouton pour fermer la modal */}
                </button>
                <h2 className="text-xl font-bold mb-4 text-center">Ajouter un recruteur</h2>
                <input
                    type="text"
                    className="mb-4 w-full p-2 border rounded"
                    placeholder="Nom complet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    className="mb-4 w-full p-2 border rounded"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="mb-4 w-full p-2 border rounded"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="text"
                    className="mb-4 w-full p-2 border rounded"
                    placeholder="Nom de l'entreprise"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
                    onClick={handleAddRecruiter}
                    disabled={loading}
                >
                    {loading ? 'Ajout en cours...' : 'Ajouter'}
                </button>
            </div>
        </div>
    );
};

export default AddRecruiterModal;
