import React from 'react';
import { FaTrash, FaPlayCircle, FaFilePdf, FaSort, FaSortUp, FaSortDown, FaStar } from 'react-icons/fa';
import { axiosClient } from '../../../api/axios';  // Assurez-vous d'importer axiosClient

const CandidateTable = ({ candidates, sortBy, sortDirection, handleSort, handleVideoClick, handleDownloadCV, openConfirmModal, fetchCandidates }) => {

  const handleRatingChange = async (candidateId, newRating) => {
    try {
      await axiosClient.put(`/candidates/${candidateId}/rating`, { rating: newRating });
      fetchCandidates(); // Appel à fetchCandidates après la mise à jour de la note
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la note:', error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('first_name')}>
              Nom
              {sortBy === 'first_name' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
              Email
              {sortBy === 'email' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('phone')}>
              Téléphone
              {sortBy === 'phone' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('created_at')}>
              Date d'inscription
              {sortBy === 'created_at' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              CV
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Réponses
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Note
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Actions
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
                <div className="text-sm font-medium text-gray-800">
                  {new Date(candidate.created_at).toLocaleString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {candidate.cv && (
                  <button
                    onClick={() => handleDownloadCV(candidate.cv_url)}  // Utiliser cv_url
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaFilePdf size={18} />
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {candidate.responses.length > 0 && (
                  <FaPlayCircle
                    className="text-blue-500 text-2xl cursor-pointer"
                    onClick={() => handleVideoClick(candidate.responses)}  // Envoie toutes les vidéos à handleVideoClick
                  />
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, starIndex) => (
                    <FaStar
                      key={starIndex}
                      className={`cursor-pointer ${starIndex < candidate.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      onClick={() => handleRatingChange(candidate.id, starIndex + 1)} // Gestion du changement de rating
                    />
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => openConfirmModal(candidate.id)} className="text-red-500 hover:text-red-700">
                  <FaTrash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTable;
