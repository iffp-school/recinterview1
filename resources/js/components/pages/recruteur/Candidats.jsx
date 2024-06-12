import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player'
import axios from 'axios';
import Modal from 'react-modal';
import SideBar from './SideBar';

Modal.setAppElement('#root');

const baseURL = 'http://localhost:8000/'; // URL de base de votre API

export default function Candidats() {
  const videoInternalURL = '/videos/video.mp4'
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recherche, setRecherche] = useState('');
  const [etiquetteFiltre, setEtiquetteFiltre] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  useEffect(() => {
    axios.get(baseURL + 'api/candidates')
      .then(response => {
        setCandidates(response.data.candidates);
        setTotalPages(Math.ceil(response.data.candidates.length / 10));
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des candidats : ', error);
      });
  }, []);

  const handleVideoClick = () => {
    //const absoluteUrl = baseURL + videoUrl;
    setCurrentVideoUrl(videoInternalURL);
    setIsModalOpen(true);
  };

  // const filteredCandidates = candidates.filter(candidate => {
  //   const fullName = candidate.first_name.toLowerCase() + ' ' + candidate.last_name.toLowerCase();
  //   return fullName.includes(recherche.toLowerCase()) && candidate.responses.some(response => response.video_url.toLowerCase().includes(etiquetteFiltre.toLowerCase()));
  // });

  // const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * 10, currentPage * 10);

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800 text-white">
      <SideBar />
      <div className="w-full md:w-3/4 p-4">
        <h5 className="text-2xl font-bold">
          Liste des Candidats
        </h5>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <input
            type="text"
            className="border border-gray-300 rounded px-4 py-2 w-full md:w-64 bg-white mb-2 md:mb-0"
            placeholder="Rechercher par nom"
          // value={recherche}
          // onChange={(e) => setRecherche(e.target.value)}
          />
          <div className="w-full md:w-auto">
            <h2 className="text-xl font-semibold mb-2">Filtrer par étiquette :</h2>
            <select
              className="border border-gray-300 rounded px-4 py-2 w-full md:w-auto bg-black text-white"
            // value={etiquetteFiltre}
            // onChange={(e) => setEtiquetteFiltre(e.target.value)}
            >
              <option value="">Toutes les étiquettes</option>
              <option value="JavaScript">Backend</option>
              <option value="React">Comptabilité</option>
              <option value="IT">IT</option>
              <option value="RH">RH</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Téléphone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Réponses
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates.map((candidate, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800">{candidate.first_name} {candidate.last_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800">{candidate.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800">{candidate.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {candidate.responses.map((response, index) => (
                        <div key={index} className="cursor-pointer" onClick={() => handleVideoClick(currentVideoUrl)}>
                          <ReactPlayer url={videoInternalURL} width={30} height={30} />
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center">
          <nav className="inline-flex">
            {[...Array(totalPages)].map((_, page) => (
              <button
                key={page}
                className={`px-4 py-2 mx-1 bg-blue-500 text-white rounded ${currentPage === page + 1 ? 'bg-blue-700' : ''}`}
              // onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      >
        <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/2 lg:w-1/3 relative">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-0 right-0 m-2 text-black text-2xl font-bold"
          >
            &times;
          </button>
          <ReactPlayer url={videoInternalURL} width={450} height={300} />
        </div>
      </Modal>
    </div>
  );
}
