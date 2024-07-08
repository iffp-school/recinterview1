import React from 'react';
import { RiAddFill } from 'react-icons/ri';

const PostSearchBar = ({ searchTerm, handleSearch, onAddClick }) => (
  <div className="flex items-center mb-4">
    <input
      type="text"
      className="border border-gray-800 text-black rounded px-4 py-2 w-full md:w-64 bg-white mb-2 md:mb-0"
      placeholder="Rechercher par titre"
      value={searchTerm}
      onChange={handleSearch}
    />
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded-md ml-2"
      onClick={onAddClick}
    >
      <RiAddFill className="mr-1 " />
    </button>
  </div>
);

export default PostSearchBar;
