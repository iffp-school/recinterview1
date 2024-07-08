import React from 'react';

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => (
  <div className="mt-4 flex justify-center">
    <nav className="inline-flex">
      {[...Array(totalPages)].map((_, page) => (
        <button
          key={page}
          className={`px-4 py-2 mx-1 bg-blue-500 text-white rounded ${currentPage === page + 1 ? 'bg-blue-700' : ''}`}
          onClick={() => setCurrentPage(page + 1)}
        >
          {page + 1}
        </button>
      ))}
    </nav>
  </div>
);

export default Pagination;
