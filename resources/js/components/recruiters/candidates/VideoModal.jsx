import React from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';

const VideoModal = ({ isModalOpen, setIsModalOpen, currentVideoUrl, currentQuestion }) => (
  <Modal
    isOpen={isModalOpen}
    onRequestClose={() => setIsModalOpen(false)}
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
  >
    <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/2 lg:w-1/3 relative">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-0 right-0 m-2 text-black text-2xl font-bold"
      >
        &times;
      </button>
      <h2 className="text-xl font-bold mb-2">{currentQuestion}</h2>
      <ReactPlayer url={currentVideoUrl} width="100%" height="100%" controls />
    </div>
  </Modal>
);

export default VideoModal;
