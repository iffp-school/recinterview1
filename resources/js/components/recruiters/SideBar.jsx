import React from 'react';
import { Link } from 'react-router-dom';

export default function SideBar() {
    return (
        <div className="w-full md:w-1/4 bg-gray-700 p-4">
            <h1 className="text-4xl font-bold mb-4">
                Rec<span className="text-blue-500">Inter</span>View
            </h1>
            <ul>
            <li className="mb-2">
                    <Link to="/recruteur/dashboard" className="block w-full bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded mb-1">Dashboard</Link>
                </li>
                <li className="mb-2">
                    <Link to="/recruteur/posts" className="block w-full bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded mb-1">Posts</Link>
                </li>
                <li className="mb-2">
                    <Link to="/recruteur/candidats" className="block w-full bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded mb-1">Candidats</Link>
                </li>
            </ul>
        </div>
    );
}
