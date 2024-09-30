import React, { useEffect, useState } from 'react';
import { axiosClient } from '../../api/axios';

const Interviews = ({ theme }) => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await axiosClient.get('/admin/interviews'); // Assure-toi que ton endpoint Laravel est configuré
                setInterviews(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des entretiens", error);
            }
        };
        fetchInterviews();
    }, []);

    return (
        <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <h2 className="text-xl font-bold mb-4">Gestion des Entretiens</h2>
            {loading ? (
                <p>Chargement...</p>
            ) : (
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 border">ID</th>
                            <th className="py-2 border">Candidat</th>
                            <th className="py-2 border">Poste</th>
                            <th className="py-2 border">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interviews.map((interview) => (
                            <tr key={interview.id}>
                                <td className="border px-4 py-2">{interview.id}</td>
                                <td className="border px-4 py-2">{interview.candidate_name}</td>
                                <td className="border px-4 py-2">{interview.position}</td>
                                <td className="border px-4 py-2">{interview.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Interviews;
