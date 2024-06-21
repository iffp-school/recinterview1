import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import SideBar from './SideBar';
import NavBar from './NavBar';
import 'chart.js/auto';

export default function Dashboard() {
  // Exemple de données pour les graphiques
  const candidatesPerPostData = {
    labels: ['Poste 1', 'Poste 2', 'Poste 3', 'Poste 4'],
    datasets: [
      {
        label: 'Candidats',
        data: [12, 19, 3, 5],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const successRatesData = {
    labels: ['Réussi', 'Échoué'],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(2, 255, 255, 0.5)'],
      },
    ],
  };


  // Options pour les graphiques avec texte en blanc
  const chartOptions = {
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800 text-white">
      <SideBar />
      <div className="w-full">
        <NavBar />
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            <div className="bg-gray-700 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4 h-96">
              <h5 className="text-lg font-bold mb-4">Candidats par poste</h5>
              <Bar data={candidatesPerPostData} options={chartOptions} />
            </div>
            <div className="bg-gray-700 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4 h-96">
              <h5 className="text-lg font-bold mb-4">Taux de réussite des candidats</h5>
              <Pie data={successRatesData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
