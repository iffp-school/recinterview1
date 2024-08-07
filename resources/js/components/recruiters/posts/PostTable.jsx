import React from 'react';
import { BsPencilSquare, BsTrash, BsInfoCircleFill, BsSend } from 'react-icons/bs';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const PostTable = ({ posts, sortBy, sortDirection, handleSort, setCurrentPost, setIsModalOpen, setPostIdToDelete, setShowConfirmationModal, handleDetails, handleSendLink }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-blue-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('title')}>
            Titre
            {sortBy === 'title' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1" />}
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
              <button
                className="text-blue-600 hover:text-blue-900 mr-2"
                onClick={() => {
                  setCurrentPost(post);
                  setIsModalOpen(true);
                }}
              >
                <BsPencilSquare />
              </button>
              <button
                className="text-red-600 hover:text-red-900 mr-2"
                onClick={() => {
                  setPostIdToDelete(post.id);
                  setShowConfirmationModal(true);
                }}
              >
                <BsTrash />
              </button>
              <button
                className="text-green-600 hover:text-green-900 mr-2"
                onClick={() => handleDetails(post)}
              >
                <BsInfoCircleFill />
              </button>
              <button
                className="text-blue-600 hover:text-blue-900 mr-2"
                onClick={() => handleSendLink(post.random_string)}
              >
                <BsSend />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PostTable;
