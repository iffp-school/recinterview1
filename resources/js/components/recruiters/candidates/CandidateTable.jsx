// src/components/recruiter/Candidates/CandidateTable.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTrash,
  FaPlayCircle,
  FaFilePdf,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaStar,
} from 'react-icons/fa';
import {
  BsPencilSquare,
  BsTrash,
  BsInfoCircleFill,
  BsSend,
} from 'react-icons/bs';

const CandidateTable = ({
  candidates,
  sortBy,
  sortDirection,
  handleSort,
  handleVideoClick,
  handleDownloadCV,
  openConfirmModal,
  handleInfoClick,
  handleSendClick,
  // ==> La nouvelle fonction pour noter le candidat globalement
  handleCandidateRating,
}) => {
  return (
    <>
      {/* -- Tableau pour écrans larges -- */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('first_name')}
              >
                Nom
                {sortBy === 'first_name' ? (
                  sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                ) : (
                  <FaSort className="inline ml-1" />
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('post')}
              >
                Poste
                {sortBy === 'post' ? (
                  sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                ) : (
                  <FaSort className="inline ml-1" />
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('email')}
              >
                Email
                {sortBy === 'email' ? (
                  sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                ) : (
                  <FaSort className="inline ml-1" />
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('phone')}
              >
                Téléphone
                {sortBy === 'phone' ? (
                  sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                ) : (
                  <FaSort className="inline ml-1" />
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                Date d'inscription
                {sortBy === 'created_at' ? (
                  sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />
                ) : (
                  <FaSort className="inline ml-1" />
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                CV
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Réponses
              </th>

              {/* -- Nouvelle colonne Note globale -- */}
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
              <tr
                key={candidate.id || index}
                className={index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-50'}
              >
                {/* -- NOM => lien vers /candidates/:id/presentation -- */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/candidates/${candidate.id}/presentation`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {candidate.first_name} {candidate.last_name}
                  </Link>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-800">
                    {candidate.post ? candidate.post.title : 'Non spécifié'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-800">
                    {candidate.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-800">
                    {candidate.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-800">
                    {new Date(candidate.created_at).toLocaleString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {candidate.cv && (
                    <button
                      onClick={() => handleDownloadCV(candidate.cv_url)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaFilePdf size={18} />
                    </button>
                  )}
                </td>

                {/* -- Icône pour voir les vidéos (s'il y en a) -- */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {candidate.responses.length > 0 &&
                    candidate.post &&
                    candidate.post.questions &&
                    candidate.post.questions.length > 0 && (
                      <FaPlayCircle
                        className="text-blue-500 text-2xl cursor-pointer"
                        onClick={() =>
                          handleVideoClick(
                            candidate.responses,
                            candidate.post.questions
                          )
                        }
                      />
                    )}
                </td>

                {/* -- Note globale du candidat -- */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, starIndex) => (
                      <FaStar
                        key={starIndex}
                        className={
                          starIndex < candidate.rating
                            ? 'text-yellow-500 cursor-pointer'
                            : 'text-gray-300 cursor-pointer'
                        }
                        onClick={() =>
                          handleCandidateRating(candidate.id, starIndex + 1)
                        }
                      />
                    ))}
                  </div>
                </td>

                {/* -- Actions (Modifier, Supprimer, Info, Envoyer) -- */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Modifier */}
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-2"
                    onClick={() => {
                      console.log('TODO: fonction handleEditCandidate');
                    }}
                  >
                    <BsPencilSquare />
                  </button>

                  {/* Supprimer */}
                  <button
                    className="text-red-600 hover:text-red-900 mr-2"
                    onClick={() => openConfirmModal(candidate.id)}
                  >
                    <BsTrash />
                  </button>

                  {/* Info => ouvre la modale InfoModal */}
                  <button
                    className="text-green-600 hover:text-green-900 mr-2"
                    onClick={() => handleInfoClick(candidate)}
                  >
                    <BsInfoCircleFill />
                  </button>

                  {/* Envoyer => ouvre la modale SendModal */}
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => handleSendClick(candidate)}
                  >
                    <BsSend />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* -- Version cartes (petits écrans) -- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {candidates.map((candidate, index) => (
          <div
            key={candidate.id || index}
            className="bg-white shadow-md rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              {/* Nom => lien présentation */}
              <Link
                to={`/candidates/${candidate.id}/presentation`}
                className="text-lg font-bold text-blue-600 hover:underline"
              >
                {candidate.first_name} {candidate.last_name}
              </Link>

              {/* Supprimer */}
              <button
                onClick={() => openConfirmModal(candidate.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash size={18} />
              </button>
            </div>

            <p>
              <strong>Poste:</strong>{' '}
              {candidate.post ? candidate.post.title : 'Non spécifié'}
            </p>
            <p>
              <strong>Email:</strong> {candidate.email}
            </p>
            <p>
              <strong>Téléphone:</strong> {candidate.phone}
            </p>
            <p>
              <strong>Date d'inscription:</strong>{' '}
              {new Date(candidate.created_at).toLocaleString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>

            <div className="flex items-center justify-between mt-3">
              {/* CV */}
              {candidate.cv && (
                <button
                  onClick={() => handleDownloadCV(candidate.cv_url)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaFilePdf size={18} />
                </button>
              )}

              {/* Vidéo */}
              {candidate.responses.length > 0 &&
                candidate.post &&
                candidate.post.questions &&
                candidate.post.questions.length > 0 && (
                  <FaPlayCircle
                    className="text-blue-500 text-2xl cursor-pointer"
                    onClick={() =>
                      handleVideoClick(candidate.responses, candidate.post.questions)
                    }
                  />
                )}
            </div>

            {/* Note globale (Rating) */}
            <div className="flex items-center space-x-1 mt-2">
              {[...Array(5)].map((_, starIndex) => (
                <FaStar
                  key={starIndex}
                  className={
                    starIndex < candidate.rating
                      ? 'text-yellow-500 cursor-pointer'
                      : 'text-gray-300 cursor-pointer'
                  }
                  onClick={() => handleCandidateRating(candidate.id, starIndex + 1)}
                />
              ))}
            </div>
            <p className="text-sm text-gray-700 mt-1">
              Note: {candidate.rating || 0}
            </p>

            {/* Actions (Modifier, Info, Envoyer) */}
            <div className="flex gap-2 mt-3">
              {/* Modifier */}
              <button
                className="text-blue-600 hover:text-blue-900"
                onClick={() => {
                  console.log('TODO: handleEditCandidate');
                }}
              >
                <BsPencilSquare />
              </button>

              {/* Info -> ouvre InfoModal */}
              <button
                className="text-green-600 hover:text-green-900"
                onClick={() => handleInfoClick(candidate)}
              >
                <BsInfoCircleFill />
              </button>

              {/* Envoyer -> ouvre SendModal */}
              <button
                className="text-blue-600 hover:text-blue-900"
                onClick={() => handleSendClick(candidate)}
              >
                <BsSend />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CandidateTable;
