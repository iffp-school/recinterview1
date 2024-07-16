import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import SideBar from './SideBar';
import NavBar from './NavBar';
import 'chart.js/auto';

export default function Dashboard({ theme, toggleTheme }) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md rounded px-8 pt-6 pb-8 mb-4 h-96`}>
              <h5 className="text-lg font-bold mb-4">Candidats par poste</h5>
              <Bar data={candidatesPerPostData} options={chartOptions} />
            </div>
            <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md rounded px-8 pt-6 pb-8 mb-4 h-96`}>
              <h5 className="text-lg font-bold mb-4">Taux de réussite des candidats</h5>
              <Pie data={successRatesData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
