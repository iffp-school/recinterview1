import React from 'react';
import { Link } from 'react-router-dom';

export default function SideBar() {
  return (
    <div className="w-full md:w-1/4 bg-gray-900 p-4 flex flex-col items-center md:items-start">
      <Link to="/recruiter/home" >
        <h1 className="text-4xl font-bold mb-4 text-center md:text-left">
          Rec<span className="text-blue-500">Inter</span>View
        </h1>
      </Link>
      <ul className="w-full">
        <li className="mb-2">
          <Link to="/recruiter/dashboard" className="block w-full bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded mb-1 text-center md:text-left">Dashboard</Link>
        </li>
        <li className="mb-2">
          <Link to="/recruiter/posts" className="block w-full bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded mb-1 text-center md:text-left">Posts</Link>
        </li>
        <li className="mb-2">
          <Link to="/recruiter/candidates" className="block w-full bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded mb-1 text-center md:text-left">Candidats</Link>
        </li>
      </ul>
    </div>
  );
}
