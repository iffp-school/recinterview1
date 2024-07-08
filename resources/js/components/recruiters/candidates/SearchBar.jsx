import React from 'react';

const CandidateSearchBar = ({ searchTerm, handleSearch }) => (
  <div className="flex items-center mb-4">
    <input
      type="text"
      className="border border-gray-800 text-black rounded px-4 py-2 w-full md:w-64 bg-white mb-2 md:mb-0"
      placeholder="Nom, Email, Poste"
      value={searchTerm}
      onChange={handleSearch}
    />
  </div>
);

export default CandidateSearchBar;
