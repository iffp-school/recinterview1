import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import SideBar from './SideBar';
import NavBar from './NavBar';
import 'chart.js/auto';
import { useLocation } from 'react-router-dom';

export default function Dashboard({ theme, toggleTheme }) {
    const [dashboardData, setDashboardData] = useState({
        totalRecruiters: 0,
        totalCandidates: 0,
        totalPosts: 0,
        totalInterviews: 0,
        candidatesPerPost: [],
        successRates: { successful: 0, failed: 0 },
    });

    const location = useLocation();
    const isRecruiterDashboard = location.pathname.includes('/recruiter/dashboard');
    const apiUrl = isRecruiterDashboard ? '/dashboard-data-recruiter' : '/dashboard-data-admin';

    useEffect(() => {
        axios.get(apiUrl)
            .then(response => {
                setDashboardData(response.data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des données du tableau de bord", error);
            });
    }, [apiUrl]);

    const candidatesPerPostData = {
        labels: dashboardData.candidatesPerPost.map(item => item.title),
        datasets: [
            {
                label: 'Candidats',
                data: dashboardData.candidatesPerPost.map(item => item.candidates_count),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    const successRatesData = {
        labels: ['Réussi', 'Échoué'],
        datasets: [
            {
                data: [dashboardData.successRates.successful, dashboardData.successRates.failed],
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                ticks: {
                    color: theme === 'dark' ? 'white' : 'black',
                },
            },
            y: {
                ticks: {
                    color: theme === 'dark' ? 'white' : 'black',
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: theme === 'dark' ? 'white' : 'black',
                },
            },
        },
    };

    return (
        <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col md:flex-row h-screen transition-colors duration-300`}>
            <SideBar theme={theme} />
            <div className="w-full">
                <NavBar theme={theme} toggleTheme={toggleTheme} />
                <div className="p-4">
                    {/* Section des 4 cartes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {!isRecruiterDashboard && (
                            <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : 'bg-gradient-to-r from-blue-300 to-blue-500 text-white'} shadow-md rounded px-4 py-6 text-center transform transition hover:scale-105`}>
                                <h5 className="text-md font-bold">Total nb de recruteurs</h5>
                                <p className="text-2xl mt-2 font-semibold">{dashboardData.totalRecruiters}</p>
                            </div>
                        )}
                        <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-green-600 to-green-800 text-white' : 'bg-gradient-to-r from-green-300 to-green-500 text-white'} shadow-md rounded px-4 py-6 text-center transform transition hover:scale-105`}>
                            <h5 className="text-md font-bold">Total nb de candidats</h5>
                            <p className="text-2xl mt-2 font-semibold">{dashboardData.totalCandidates}</p>
                        </div>
                        <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white' : 'bg-gradient-to-r from-purple-300 to-purple-500 text-white'} shadow-md rounded px-4 py-6 text-center transform transition hover:scale-105`}>
                            <h5 className="text-md font-bold">Nombre total de postes</h5>
                            <p className="text-2xl mt-2 font-semibold">{dashboardData.totalPosts}</p>
                        </div>
                        <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-red-600 to-red-800 text-white' : 'bg-gradient-to-r from-red-300 to-red-500 text-white'} shadow-md rounded px-4 py-6 text-center transform transition hover:scale-105`}>
                            <h5 className="text-md font-bold">Nb d'entretiens passés</h5>
                            <p className="text-2xl mt-2 font-semibold">{dashboardData.totalInterviews}</p>
                        </div>
                    </div>

                    {/* Section des graphiques */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                        <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md rounded px-8 pt-6 pb-8 mb-4 h-96 transition-transform transform hover:scale-105`}>
                            <h5 className="text-lg font-bold mb-4">Candidats par poste</h5>
                            <Bar data={candidatesPerPostData} options={chartOptions} />
                        </div>
                        <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md rounded px-8 pt-6 pb-8 mb-4 h-96 transition-transform transform hover:scale-105`}>
                            <h5 className="text-lg font-bold mb-4">Taux de réussite des candidats</h5>
                            <Pie data={successRatesData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
