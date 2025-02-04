import React, { useState } from 'react';
import { axiosClient } from '../../api/axios';

const AddRecruiterModal = ({ isOpen, onClose, fetchUsers }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('IFFP'); // Valeur par défaut
    const [role, setRole] = useState('recruteur'); // Valeur par défaut
    const [loading, setLoading] = useState(false);

    const handleAddRecruiter = async () => {
        setLoading(true);
        try {
            // Requête pour créer un utilisateur avec le rôle et l'entreprise
            await axiosClient.post('/users', {
                name,
                email,
                password,
                role: role.toLowerCase(), // 'recruiter' ou 'admin'
                company_name: companyName,
            });

            // Rafraîchir la liste des utilisateurs après l'ajout
            fetchUsers();
            onClose(); // Fermer la modal après l'ajout
        } catch (error) {
            console.error("Erreur lors de l'ajout du recruteur", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    X
                </button>
                <h2 className="text-xl font-bold mb-4 text-center">Ajouter un utilisateur</h2>
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
                <select
                    className="mb-4 w-full p-2 border rounded"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                >
                    <option value="IFFP">IFFP</option>
                    <option value="TechIT">TechIT</option>
                    <option value="ISGI">ISGI</option>
                </select>
                <select
                    className="mb-4 w-full p-2 border rounded"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="recruteur">Recruteur</option>
                    <option value="administrateur">Administrateur</option>
                </select>
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
