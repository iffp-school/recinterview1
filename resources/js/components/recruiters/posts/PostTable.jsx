import React from 'react';
import { BsPencilSquare, BsTrash, BsInfoCircleFill, BsSend } from 'react-icons/bs';
import { FaPlayCircle, FaUsers, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

const PostTable = ({ posts, sortBy, sortDirection, handleSort, handleOpenResponsesModal, fetchCandidatesByPost, setCurrentPost, setIsModalOpen, setPostIdToDelete, setShowConfirmationModal, handleDetails, handleSendLink }) => (
	<>
		{/* Affichage en tableau pour les grands écrans */}
		<div className="hidden lg:block overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-blue-700">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('title')}>
							Titre
							{sortBy === 'title' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
							Réponses
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
							Candidats
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('created_at')}>
							Date de création
							{sortBy === 'created_at' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{posts.map(post => (
						<tr key={post.id}>
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="text-sm font-medium text-gray-800">{post.title}</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<button className="text-blue-600 hover:text-blue-900 text-xl" onClick={() => handleOpenResponsesModal(post)}>
									<FaPlayCircle />
								</button>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<button className="text-blue-600 hover:text-blue-900 text-xl" onClick={() => fetchCandidatesByPost(post.id, post.title)}>
									<FaUsers />
								</button>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="text-sm font-medium text-gray-800">
									{new Date(post.created_at).toLocaleDateString("fr-FR", {
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit"
									})}
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<button className="text-blue-600 hover:text-blue-900 mr-2" onClick={() => {
									setCurrentPost(post);
									setIsModalOpen(true);
								}}>
									<BsPencilSquare />
								</button>
								<button className="text-red-600 hover:text-red-900 mr-2" onClick={() => {
									setPostIdToDelete(post.id);
									setShowConfirmationModal(true);
								}}>
									<BsTrash />
								</button>
								<button className="text-green-600 hover:text-green-900 mr-2" onClick={() => handleDetails(post)}>
									<BsInfoCircleFill />
								</button>
								<button className="text-blue-600 hover:text-blue-900" onClick={() => handleSendLink(post.random_string)}>
									<BsSend />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>

		{/* Affichage en cartes pour les petits écrans */}
		<div className="lg:hidden grid grid-cols-1 gap-4 p-4">
			{posts.map(post => (
				<div key={post.id} className="bg-white shadow-md rounded-lg p-4">
					<h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
					<div className="flex gap-2 mb-2">
						<button className="text-blue-600 hover:text-blue-900 text-xl" onClick={() => handleOpenResponsesModal(post)}>
							<FaPlayCircle />
						</button>
						<button className="text-blue-600 hover:text-blue-900 text-xl" onClick={() => fetchCandidatesByPost(post.id, post.title)}>
							<FaUsers />
						</button>
					</div>
					<div className="text-sm text-gray-600 mb-2">
						{new Date(post.created_at).toLocaleDateString("fr-FR", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit"
						})}
					</div>
					<div className="flex gap-2 mt-2">
						<button className="text-blue-600 hover:text-blue-900" onClick={() => {
							setCurrentPost(post);
							setIsModalOpen(true);
						}}>
							<BsPencilSquare />
						</button>
						<button className="text-red-600 hover:text-red-900" onClick={() => {
							setPostIdToDelete(post.id);
							setShowConfirmationModal(true);
						}}>
							<BsTrash />
						</button>
						<button className="text-green-600 hover:text-green-900" onClick={() => handleDetails(post)}>
							<BsInfoCircleFill />
						</button>
						<button className="text-blue-600 hover:text-blue-900" onClick={() => handleSendLink(post.random_string)}>
							<BsSend />
						</button>
					</div>
				</div>
			))}
		</div>
	</>
);

export default PostTable;
