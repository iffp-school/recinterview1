import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import SideBar from './SideBar';

const HomeRec = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();

    return (
        <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col md:flex-row h-screen transition-colors duration-300`}>
            <SideBar theme={theme} />
            <div className="w-full">
                <NavBar theme={theme} toggleTheme={toggleTheme} />
                <div className="p-4">
                    <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-md max-w-4xl mx-auto transition-colors duration-300`}>
                        <h2 className="text-2xl font-bold text-blue-500 mb-4">
                            Evaluez le potentiel de vos candidats grâce aux entretiens vidéos différés
                        </h2>
                        <div className="flex flex-col md:flex-row justify-between mb-6">
                            <div className="flex flex-col w-full md:w-3/5">
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold mb-2">Evaluer l'entretien vidéo</h2>
                                    <div className="relative w-full h-64 bg-gray-200 rounded-md overflow-hidden mb-4">
                                        <img src="/images/home-rec.png" alt="Video Thumbnail" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-full md:w-2/5 items-center justify-center">
                                <div className="text-center mb-4">
                                    <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
                                        Pour créer un entretien vidéo différé, paramétrez un questionnaire auquel le candidat répondra devant sa webcam.
                                    </p>
                                    <button
                                        className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2 hover:bg-blue-600 transition-colors duration-300"
                                        onClick={() => navigate('/recruiter/new-post')}
                                    >
                                        Créer un poste
                                    </button>
                                </div>
                                <div className="text-center mb-4">
                                    <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
                                        Vous voulez accéder à l'ensemble de vos questionnaires ?
                                    </p>
                                    <button
                                        className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2 hover:bg-blue-600 transition-colors duration-300"
                                        onClick={() => navigate('/recruiter/posts')}
                                    >
                                        Liste des postes
                                    </button>
                                </div>
                                <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'} text-center`}>
                                    Une fois l'entretien vidéo différé réalisé, vous pouvez le visionner depuis la fiche candidat.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeRec;
