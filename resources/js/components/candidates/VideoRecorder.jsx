import React, { useRef, useEffect } from 'react';

const VideoRecorder = ({
    recording,
    handleDataAvailable,
    isFinalModalOpen,
    setRecording,
    isPractice,
    setIsPractice,
    attemptsLeft,
    setAttemptsLeft,
}) => {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    useEffect(() => {
        if (recording) {
            startRecording();
        }
    }, [recording]);

    const startRecording = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    mediaRecorderRef.current = new MediaRecorder(stream);
                    mediaRecorderRef.current.ondataavailable = handleDataAvailable;
                    mediaRecorderRef.current.start();
                })
                .catch(error => console.error('Erreur lors de l\'accès à la webcam : ', error));
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const handlePracticeStop = () => {
        stopRecording();
        setIsPractice(false);
    };

    const handleReRecord = () => {
        if (attemptsLeft > 1) {
            setAttemptsLeft(attemptsLeft - 1);
            setRecording(false);
            startRecording();
        } else {
            alert('Vous avez atteint le nombre maximum de tentatives.');
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative mb-4">
                <video ref={videoRef} className="mb-2 w-full" muted autoPlay />
                {!isFinalModalOpen && recording && (
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-4 rounded"
                        onClick={stopRecording}
                    >
                        Arrêter l'enregistrement
                    </button>
                )}
                {!isFinalModalOpen && !recording && attemptsLeft > 0 && (
                    <button
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 mt-4 rounded"
                        onClick={handleReRecord}
                    >
                        Recommencer l'enregistrement ({attemptsLeft}/3)
                    </button>
                )}
                {recording && (
                    <div className="absolute top-0 left-0 mt-2 ml-2">
                        <span className="bg-blue-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                            Enregistrement en cours...
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoRecorder;
