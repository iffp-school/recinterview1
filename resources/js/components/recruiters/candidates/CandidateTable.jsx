import React from 'react';
import { FaTrash, FaPlayCircle, FaFilePdf, FaSort, FaSortUp, FaSortDown, FaStar, FaFileAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CandidateTable = ({ candidates, sortBy, sortDirection, handleSort, handleVideoClick, handleDownloadCV, openConfirmModal }) => {

	// Fonction pour calculer la moyenne des notes des vidéos pour chaque candidat
	const calculateAverageRating = (responses) => {
		const totalRating = responses.reduce((sum, response) => sum + (response.rating || 0), 0);
		const totalRatedResponses = responses.filter(response => response.rating).length;
		return totalRatedResponses > 0 ? (totalRating / totalRatedResponses).toFixed(1) : 0;
	};

	return (
		<>
			{/* Affichage en tableau pour les grands écrans */}
			<div className="hidden lg:block overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-blue-700">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('first_name')}>
								Nom
								{sortBy === 'first_name' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
								onClick={() => handleSort('post')}>
								Poste
								{sortBy === 'post' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
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
								Moyenne
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
								Présentation
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
									<div className="text-sm font-medium text-gray-800">{candidate.post ? candidate.post.title : 'Non spécifié'}</div>
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
										<button onClick={() => handleDownloadCV(candidate.cv_url)} className="text-blue-500 hover:text-blue-700">
											<FaFilePdf size={18} />
										</button>
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{candidate.responses.length > 0 && candidate.post.questions.length > 0 && (
										<FaPlayCircle className="text-blue-500 text-2xl cursor-pointer" onClick={() => handleVideoClick(candidate.responses, candidate.post.questions)} />
									)}
								</td>
								{/* Affichage de la moyenne des étoiles */}
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center space-x-1">
										{[...Array(5)].map((_, starIndex) => (
											<FaStar
												key={starIndex}
												className={`cursor-pointer ${starIndex < calculateAverageRating(candidate.responses) ? 'text-yellow-500' : 'text-gray-300'}`}
											// Les étoiles ne sont pas cliquables ici
											/>
										))}
									</div>
									<p className="text-sm text-gray-700 mt-1">Moyenne: {calculateAverageRating(candidate.responses)}</p>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<Link to={`/candidates/${candidate.id}/presentation`}>
										<FaFileAlt className="text-blue-500 hover:text-blue-700" />
									</Link>
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

			{/* Affichage en cartes pour les écrans de taille moyenne et petite */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
				{candidates.map((candidate, index) => (
					<div key={index} className="bg-white shadow-md rounded-lg p-4">
						<div className="flex justify-between items-center">
							<h2 className="text-lg font-bold">{candidate.first_name} {candidate.last_name}</h2>
							<button onClick={() => openConfirmModal(candidate.id)} className="text-red-500 hover:text-red-700">
								<FaTrash size={18} />
							</button>
						</div>
						<div className="mt-2">
							<p><strong>Poste:</strong> {candidate.post ? candidate.post.title : 'Non spécifié'}</p>
							<p><strong>Email:</strong> {candidate.email}</p>
							<p><strong>Téléphone:</strong> {candidate.phone}</p>
							<p><strong>Date d'inscription:</strong> {new Date(candidate.created_at).toLocaleString("fr-FR", {
								year: "numeric",
								month: "long",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}</p>
						</div>
						<div className="flex justify-between items-center mt-4">
							<button onClick={() => handleDownloadCV(candidate.cv_url)} className="text-blue-500 hover:text-blue-700">
								<FaFilePdf size={18} />
							</button>
							{candidate.responses.length > 0 && candidate.post.questions.length > 0 && (
								<FaPlayCircle className="text-blue-500 text-2xl cursor-pointer" onClick={() => handleVideoClick(candidate.responses, candidate.post.questions)} />
							)}
							<div className="flex items-center space-x-1">
								{[...Array(5)].map((_, starIndex) => (
									<FaStar
										key={starIndex}
										className={`cursor-pointer ${starIndex < calculateAverageRating(candidate.responses) ? 'text-yellow-500' : 'text-gray-300'}`}
									/>
								))}
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default CandidateTable;
