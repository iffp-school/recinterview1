import React from 'react';
import SideBar from './SideBar';

export default function Dashboard() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800 text-white">
      <SideBar />
      <div className="w-full md:w-3/4 p-4">
        <h5 className="text-2xl font-bold">
          Dashboard
        </h5>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="w-full md:w-1/2">
            <div className="bg-gray-800 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4 relative">
              <h5 className="text-lg font-bold mb-4">Nombre de candidats</h5>
              <h6 className="text-gray-300 mb-4"> 10 </h6>
              <h5 className="text-lg font-bold mb-4">Nombre de posts</h5>
              <h6 className="text-gray-300 mb-4"> 5 </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
