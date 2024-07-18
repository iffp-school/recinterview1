import React from 'react';
import Modal from 'react-modal';
import { FaCamera, FaMicrophone, FaClock, FaQuestionCircle, FaRedo, FaListAlt } from 'react-icons/fa';
import { SiGooglechrome, SiFirefoxbrowser } from 'react-icons/si';

export default function ProfilModal({ isOpen, post, startRecording, closeModal }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className="fixed inset-0 flex items-center justify-center z-50 overflow-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            contentLabel="Demarrage Entretien"
            closeTimeoutMS={300}
            ariaHideApp={false}
        >
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-4xl w-full transform transition-transform duration-300 ease-in-out translate-y-0 overflow-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Votre entretien vidéo différé</h2>
                <p className="text-center mb-8">{post ? post.title : "Post titre H/F"}</p>
                <p className="mb-4 text-gray-700 text-center">
                    Attention, pour enregistrer votre entretien vidéo différé, votre ordinateur doit être équipé de :
                </p>
                <div className="flex flex-wrap justify-around mb-4 text-blue-500">
                    <div className="flex flex-col items-center text-center m-2">
                        <FaCamera className="text-3xl mb-2" />
                        <p>1 webcam</p>
                    </div>
                    <div className="flex flex-col items-center text-center m-2">
                        <FaMicrophone className="text-3xl mb-2" />
                        <p>1 microphone</p>
                    </div>
                    <div className="flex flex-col items-center text-center m-2">
                        <div className="flex justify-center items-center space-x-2 mb-2">
                            <SiGooglechrome className="text-3xl" />
                            <SiFirefoxbrowser className="text-3xl" />
                        </div>
                        <p>Chrome ou Firefox</p>
                    </div>
                </div>
                <div className="text-center font-bold text-lg mb-2 bg-gray-100 p-2 rounded-lg">Comment cela se passe ?</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 text-gray-700 text-center">
                    <div className="relative flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
                        <div className="flex items-center justify-center w-12 h-12 bg-white border-4 border-blue-500 text-blue-500 rounded-full text-2xl font-bold mb-2">1</div>
                        <p className="mb-2">Une première question fictive va vous être posée afin de vous présenter les conditions d'enregistrement.</p>
                    </div>
                    <div className="relative flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
                        <div className="flex items-center justify-center w-12 h-12 bg-white border-4 border-blue-500 text-blue-500 rounded-full text-2xl font-bold mb-2">2</div>
                        <p className="mb-2">Chaque question de l'entretien vidéo différé va vous être présentée pendant quelques instants. Sans action de votre part, l'enregistrement démarrera automatiquement après la fin de temps d'attente.</p>
                    </div>
                    <div className="relative flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md">
                        <div className="flex items-center justify-center w-12 h-12 bg-white border-4 border-blue-500 text-blue-500 rounded-full text-2xl font-bold mb-2">3</div>
                        <p className="mb-2">Vous avez la possibilité de relancer l'enregistrement jusqu'à 3 fois par question.</p>
                    </div>
                </div>
                <div className="flex justify-around items-center mb-8 text-red-500 bg-gray-100 p-4 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <FaQuestionCircle className="text-3xl" />
                        <span className="ml-2 text-lg">Parlez de votre parcours et vos experiences ?</span>
                    </div>
                    <div className="flex items-center">
                        <FaClock className="text-3xl" />
                        <span className="ml-2 text-lg">2 mn</span>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={startRecording}
                    >
                        Testez-vous !
                    </button>
                </div>
            </div>
        </Modal>
    );
}
