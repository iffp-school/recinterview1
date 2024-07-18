import React, { useEffect } from 'react';
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
    mediaRecorderRef,
    candidateId,
}) => {
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 3600);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const preparationColor = theme === 'dark' ? '#FFD700' : '#FFC107'; // Golden color for dark mode, amber for light mode
    const responseColor = theme === 'dark' ? '#FF4500' : '#FF5722'; // OrangeRed for dark mode, deep orange for light mode

    const submitVideo = () => {
        const blob = new Blob([mediaRecorderRef.current.blob], { type: 'video/mp4' });
        const videoURL = URL.createObjectURL(blob);
        setTestVideoURL(videoURL);

        const videoFile = new File([blob], 'enregistrement.mp4');
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('candidate_id', candidateId);

        axiosClient.post('/responses', formData)
            .then(response => {
                handleNextQuestion(); // Appeler handleNextQuestion après une soumission réussie
            })
            .catch(error => console.log('Erreur lors de l\'envoi de la vidéo : ', error.response.data));
    };

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
                            {isPractice ? 'Parlez de vos compétences et expériences' : (currentQuestionIndex < post.questions.length && post.questions[currentQuestionIndex].question_text)}
                        </span>
                    </div>
                    {testVideoURL && isPractice ? (
                        <video src={testVideoURL} className="mb-2 w-full" controls />
                    ) : (
                        <Webcam ref={webcamRef} className="mb-2 w-full" />
                    )}
                    {!isFinalModalOpen && (
                        <div className="absolute top-0 right-0 mt-2 mr-2 flex space-x-2">
                            {isPreparation && buttonLabel === 'Enregistrer' && (
                                <div className="relative flex flex-col items-center">
                                    <span className={`mb-1 text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Temps de préparation</span>
                                    <div className="relative flex justify-center items-center">
                                        <div className={`absolute ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{formatTime(preparationTime)}</div>
                                        <svg className="w-16 h-16" viewBox="0 0 36 36">
                                            <path
                                                className="stroke-current"
                                                strokeWidth="4"
                                                strokeDasharray={`${(preparationTime / 30) * 100}, 100`}
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
                                <div className="relative flex flex-col items-center">
                                    <span className={`mb-1 text-sm font-bold text-white`}>Temps de réponse</span>
                                    <div className="relative flex justify-center items-center">
                                        <div className="absolute text-white">{formatTime(responseTime - elapsedTime)}</div>
                                        <svg className="w-16 h-16" viewBox="0 0 36 36">
                                            <path
                                                className="stroke-current"
                                                strokeWidth="4"
                                                strokeDasharray={`${((responseTime - elapsedTime) / 120) * 100}, 100`}
                                                d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                                                style={{ stroke: responseColor }}
                                            />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
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
                {buttonLabel === 'Enregistrer' && (
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
                        {attemptsLeft > 0 && (
                            <button
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 mx-2 rounded"
                                onClick={handleReRecord}
                            >
                                Ré-enregistrer ({attemptsLeft} tentatives restantes)
                            </button>
                        )}
                    </>
                )}
                {buttonLabel.startsWith('Passer à Q') && (
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
                        Tentatives restantes : {attemptsLeft}
                    </p>
                </div>
            )}
        </div>
    );
};

export default VideoRecording;
