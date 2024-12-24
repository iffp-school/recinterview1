import React from 'react';
import Webcam from 'react-webcam';
import ReactPlayer from 'react-player';

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
  isMuted,
  setIsMuted,
  showReplay // ← on passe le nouvel état en prop
}) => {
  // Fonction pour formater le temps en MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const preparationColor = theme === 'dark' ? '#1abc9c' : '#e74c3c'; // Couleur du cercle de préparation
  const responseColor = theme === 'dark' ? '#3498db' : '#f39c12';    // Couleur du cercle de réponse
  const textColor = theme === 'dark' ? 'text-white' : 'text-black';
  const backgroundColor = theme === 'dark' ? '#2c3e50' : '#ecf0f1';

  // Fonction pour calculer strokeDasharray (pour diminuer dans le sens des aiguilles d'une montre)
  const calculateStrokeDasharray = (elapsed, total) => {
    const proportion = ((total - elapsed) / total) * 100;
    return `${proportion}, 100`;
  };

  return (
    <div className="w-full md:w-1/2 p-4">
      <div className="relative mb-4">
        {/* Barre de progression de questions */}
        <div className="flex justify-between items-center mb-4">
          {Array.from({ length: post.questions.length }).map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 ${
                !isPractice && currentQuestionIndex > index - 1 ? 'bg-green-500' : 'bg-gray-300'
              } transition-colors duration-500`}
              style={{ width: `${100 / post.questions.length}%` }}
            />
          ))}
        </div>

        {/* Affichage de la question OU de REPLAY */}
        {currentQuestionIndex < post.questions.length && (
          <div
            className={`${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            } mb-6 p-6 rounded-lg shadow-lg relative transition-colors duration-300`}
          >
            <div className="flex justify-center items-center mb-4">
              {/* Si on doit afficher REPLAY après "Envoyer" */}
              {showReplay ? (
                <span className="text-base font-bold bg-blue-500 text-white px-2 py-1 rounded-lg">
                  REPLAY
                </span>
              ) : (
                <span className="text-base font-bold bg-blue-500 text-white px-2 py-1 rounded-lg">
                  {isPractice
                    ? 'Question Test: Donnez votre identité et vos coordonnées'
                    : `Question ${currentQuestionIndex + 1}: ${
                        post.questions[currentQuestionIndex]?.question_text || ''
                      }`}
                </span>
              )}
            </div>

            {/* Timer de préparation */}
            {isPreparation && buttonLabel.includes('Enregistrer') && (
              <div className="relative flex flex-row items-center justify-center mb-4">
                <span className={`m-2 text-sm font-bold ${textColor}`}>Temps de préparation :</span>
                <div className="relative flex justify-center items-center ml-2">
                  <div
                    className={`absolute ${textColor} flex justify-center items-center`}
                    style={{ backgroundColor, borderRadius: '50%', width: '48px', height: '48px' }}
                  >
                    {formatTime(preparationTime)}
                  </div>
                  <svg className="w-16 h-16" viewBox="0 0 36 36">
                    <path
                      className="stroke-current"
                      strokeWidth="4"
                      strokeDasharray={calculateStrokeDasharray(30 - preparationTime, 30)}
                      strokeLinecap="round"
                      d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      style={{ stroke: preparationColor, transition: 'stroke-dasharray 1s linear' }}
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Timer de réponse */}
            {recording && (
              <div className="relative flex flex-row items-center justify-center mb-4">
                <span className={`m-2 text-sm font-bold ${textColor}`}>Temps de réponse :</span>
                <div className="relative flex justify-center items-center ml-2">
                  <div
                    className={`absolute ${textColor} flex justify-center items-center`}
                    style={{ backgroundColor, borderRadius: '50%', width: '48px', height: '48px' }}
                  >
                    {formatTime(responseTime - elapsedTime)}
                  </div>
                  <svg className="w-16 h-16" viewBox="0 0 36 36">
                    <path
                      className="stroke-current"
                      strokeWidth="4"
                      strokeDasharray={calculateStrokeDasharray(elapsedTime, responseTime)}
                      strokeLinecap="round"
                      d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      style={{ stroke: responseColor, transition: 'stroke-dasharray 1s linear' }}
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Affichage de la webcam ou du test video */}
            {testVideoURL && isPractice ? (
              <ReactPlayer
                url={testVideoURL}
                className="mb-2 w-full"
                controls
                onPlay={() => setIsMuted(false)}
                onPause={() => setIsMuted(true)}
              />
            ) : (
              <Webcam audio ref={webcamRef} muted={isMuted} className="mb-2 w-full" />
            )}
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-center">
        {/* Bouton Tester */}
        {buttonLabel === 'Tester' && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={startPreparation}
          >
            {buttonLabel}
          </button>
        )}

        {/* Bouton Enregistrer (pendant la préparation) */}
        {buttonLabel.includes('Enregistrer') && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={startRecording}
          >
            {buttonLabel}
          </button>
        )}

        {/* Bouton Envoyer (fin de l'enregistrement) */}
        {buttonLabel === 'Envoyer' && (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={stopRecording}
          >
            {buttonLabel}
          </button>
        )}

        {/* Bouton Suivant (remplace Soumettre) */}
        {buttonLabel === 'Suivant' && !isPractice && (
          <>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded flex items-center"
              onClick={() => {
                submitVideo();
                handleNextQuestion(); // on passe directement à la question suivante
              }}
            >
              <span className="mr-2">Suivant</span>
              {/* Petite flèche à droite → */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {attemptsLeft[currentQuestionIndex] > 0 && (
              <button
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 mx-2 rounded flex items-center"
                onClick={handleReRecord}
              >
                <span className="mr-2">Refaire</span>
                {/* Icône reload */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v6h6M20 20v-6h-6
                       M5.09 19.91a10 10 0 1 1 0-15.82"
                  />
                </svg>
              </button>
            )}

            <span className="text-red-500 mt-2">
              ({attemptsLeft[currentQuestionIndex]} tentatives restantes)
            </span>
          </>
        )}

        {/* Bouton pour passer à la question suivante (pendant la pratique ou autre) */}
        {buttonLabel.startsWith('Passer à Q') && currentQuestionIndex < post.questions.length - 1 && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={handleNextQuestion}
          >
            {buttonLabel}
          </button>
        )}

        {/* Bouton Terminer */}
        {buttonLabel === 'Terminer' && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded"
            onClick={openFinalModal}
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoRecording;
