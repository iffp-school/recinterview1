import React, { useState } from 'react';
import { axiosClient } from '../../api/axios';

const EditUserModal = ({ isOpen, onClose, user, fetchUsers }) => {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState(user?.recruiter?.company_name || '');
    const [role, setRole] = useState(user?.role || 'recruteur');
    const [loading, setLoading] = useState(false);

    const handleUpdateUser = async () => {
        setLoading(true);
        try {
            await axiosClient.put(`/users/${user.id}`, {
                name,
                email,
                password: password || undefined, // Ne pas envoyer si vide
                company_name: role === 'recruteur' ? companyName : null,
                role,
            });

            fetchUsers(); // Rafraîchir les utilisateurs
            onClose(); // Fermer la modal
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
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
                <h2 className="text-xl font-bold mb-4 text-center">Modifier l'utilisateur</h2>
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
                    placeholder="Mot de passe (laisser vide pour ne pas changer)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <select
                    className="mb-4 w-full p-2 border rounded"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="recruteur">Recruteur</option>
                    <option value="administrateur">Administrateur</option>
                </select>
                {role === 'recruteur' && (
                    <input
                        type="text"
                        className="mb-4 w-full p-2 border rounded"
                        placeholder="Nom de l'entreprise"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                )}
                <button
                    className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
                    onClick={handleUpdateUser}
                    disabled={loading}
                >
                    {loading ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
            </div>
        </div>
    );
};

export default EditUserModal;
