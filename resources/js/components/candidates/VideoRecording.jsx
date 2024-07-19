import React from 'react';
import Webcam from 'react-webcam';
import { axiosClient } from '../../api/axios';

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
  webcamRef,
  startPreparation,
  startRecording,
  stopRecording,
  handleNextQuestion,
  handleReRecord,
  attemptsLeft,
  buttonLabel,
  testVideoURL,
  setTestVideoURL,
  isPractice,
  openFinalModal,
  submitVideo,
  mediaRecorderRef,
  candidateId,
}) => {
  // Fonction pour formater le temps en MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const preparationColor = theme === 'dark' ? '#1abc9c' : '#e74c3c'; // Teal for dark mode, red for light mode
  const responseColor = theme === 'dark' ? '#3498db' : '#f39c12'; // Blue for dark mode, orange for light mode

  // Fonction pour calculer strokeDasharray
  const calculateStrokeDasharray = (elapsedTime, totalTime) => {
    const proportion = (elapsedTime / totalTime) * 100;
    return `${proportion}, 100`;
  };

  return (
    <div className="w-full md:w-1/2 p-4">
      <div className="relative mb-4">
        <div className="flex justify-between items-center mb-4">
          {Array.from({ length: post.questions.length }).map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 ${currentQuestionIndex > index ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-500`}
              style={{ width: `${100 / post.questions.length}%` }}
            />
          ))}
        </div>
        {currentQuestionIndex < post.questions.length && (
          <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} mb-6 p-6 rounded-lg shadow-lg relative transition-colors duration-300`}>
            <div className="flex justify-center items-center mb-4">
              <span className={`text-base font-bold bg-blue-500 text-white px-2 py-1 rounded-full`}>
                {isPractice ? 'Question Test: Parlez de vos compétences et expériences' : `Question ${currentQuestionIndex + 1}: ${post.questions[currentQuestionIndex]?.question_text || ''}`}
              </span>
            </div>
            {isPreparation && buttonLabel.includes('Enregistrer') && (
              <div className="relative flex flex-row items-center justify-center mb-4">
                <span className={`m-2 text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Temps de préparation :</span>
                <div className="relative flex justify-center items-center ml-2">
                  <div className={`absolute ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{formatTime(preparationTime)}</div>
                  <svg className="w-16 h-16" viewBox="0 0 36 36">
                    <path
                      className="stroke-current"
                      strokeWidth="4"
                      strokeDasharray={calculateStrokeDasharray(30 - preparationTime, 30)}
                      d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                      style={{ stroke: preparationColor }}
                    />
                  </svg>
                </div>
              </div>
            )}
            {recording && (
              <div className="relative flex flex-row items-center justify-center mb-4">
                <span className={`m-2 text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Temps de réponse :</span>
                <div className="relative flex justify-center items-center ml-2">
                  <div className={`absolute ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{formatTime(responseTime - elapsedTime)}</div>
                  <svg className="w-16 h-16" viewBox="0 0 36 36">
                    <path
                      className="stroke-current"
                      strokeWidth="4"
                      strokeDasharray={calculateStrokeDasharray(elapsedTime, responseTime)}
                      d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                      style={{ stroke: responseColor }}
                    />
                  </svg>
                </div>
              </div>
            )}
            {testVideoURL && isPractice ? (
              <video src={testVideoURL} className="mb-2 w-full" controls />
            ) : (
              <Webcam audio ref={webcamRef} className="mb-2 w-full" />
            )}
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {buttonLabel === 'Tester' && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={startPreparation}
          >
            {buttonLabel}
          </button>
        )}
        {buttonLabel.includes('Enregistrer') && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={startRecording}
          >
            {buttonLabel}
          </button>
        )}
        {buttonLabel === 'Arrêter' && (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={stopRecording}
          >
            {buttonLabel}
          </button>
        )}
        {buttonLabel === 'Soumettre' && !isPractice && (
          <>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded"
              onClick={submitVideo}
            >
              {buttonLabel}
            </button>
            {attemptsLeft[currentQuestionIndex] > 0 && (
              <button
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 mx-2 rounded"
                onClick={handleReRecord}
              >
                Ré-enregistrer ({attemptsLeft[currentQuestionIndex]} tentatives restantes)
              </button>
            )}
          </>
        )}
        {buttonLabel.startsWith('Passer à Q') && currentQuestionIndex < post.questions.length - 1 && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={handleNextQuestion}
          >
            {buttonLabel}
          </button>
        )}
        {buttonLabel === 'Terminer' && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={openFinalModal}
          >
            {buttonLabel}
          </button>
        )}
      </div>
      {!recording && !isPreparation && buttonLabel === 'Soumettre' && !isPractice && (
        <div className="mt-2 text-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Tentatives restantes : {attemptsLeft[currentQuestionIndex]}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoRecording;
