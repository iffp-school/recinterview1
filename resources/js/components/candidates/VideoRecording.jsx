import React from 'react';
import { FaRegClock } from 'react-icons/fa';

const VideoRecording = ({
  theme,
  post,
  currentQuestionIndex,
  recording,
  isFinalModalOpen,
  responseTime,
  elapsedTime,
  isPreparation,
  preparationTime,
  videoRef,
  startRecording,
  stopRecording,
  handleDataAvailable,
  handleReRecord,
  attemptsLeft
}) => {
  return (
    <div className="w-full md:w-1/2 p-4">
      <div className="relative mb-4">
        <div className="flex justify-between items-center mb-4">
          {post.questions.map((_, index) => (
            <div key={index} className={`w-1/4 h-2 ${currentQuestionIndex >= index ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-500`} />
          ))}
        </div>
        <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} mb-6 p-6 rounded-lg shadow-lg relative transition-colors duration-300`}>
          <div className="flex justify-center items-center mb-4">
            <span className="bg-blue-500 text-white text-sm font-bold px-2 py-1 rounded-full">
              {currentQuestionIndex < post.questions.length && post.questions[currentQuestionIndex].question_text}
            </span>
          </div>
          <video ref={videoRef} className="mb-2 w-full" muted autoPlay />
          {!isFinalModalOpen && recording ? (
            <div className="absolute top-0 right-0 mt-2 mr-2">
              <span className={`bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full flex items-center ${responseTime - elapsedTime <= 15 ? 'animate-pulse' : ''}`}>
                <FaRegClock className="mr-1" />
                Réponse : {Math.floor((responseTime - elapsedTime) / 60)}:{(responseTime - elapsedTime) % 60 < 10 ? '0' : ''}{(responseTime - elapsedTime) % 60}
              </span>
            </div>
          ) : (
            !isFinalModalOpen && isPreparation && (
              <div className="absolute top-0 right-0 mt-2 mr-2">
                <span className="bg-yellow-500 text-white text-sm font-bold px-2 py-1 rounded-full flex items-center">
                  <FaRegClock className="mr-1" />
                  Préparation : {Math.floor(preparationTime / 60)}:{preparationTime % 60 < 10 ? '0' : ''}{preparationTime % 60}
                </span>
              </div>
            )
          )}
        </div>
      </div>
      <div className="flex justify-center">
        {recording ? (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={stopRecording}
          >
            Arrêter l'enregistrement
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={startRecording}
          >
            Recommencer l'enregistrement
          </button>
        )}
        {!recording && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={handleDataAvailable}
          >
            Passer à la question {currentQuestionIndex + 1}/{post.questions.length}
          </button>
        )}
        {!recording && !isPreparation && attemptsLeft > 0 && (
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={handleReRecord}
          >
            Ré-enregistrer ({attemptsLeft} tentatives restantes)
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoRecording;
