import React, { useRef, useState, useEffect } from 'react';
import { FaRegClock } from 'react-icons/fa';
import axios from 'axios'; // Importation d'axios

function Enregistrement() {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // État pour suivre l'index de la question actuelle

    useEffect(() => {
        let timer;
        if (recording) {
            timer = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [recording]);

    const startRecording = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    mediaRecorderRef.current = new MediaRecorder(stream);
                    mediaRecorderRef.current.ondataavailable = handleDataAvailable;
                    mediaRecorderRef.current.start();
                    setRecording(true);
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

    const handleDataAvailable = (event) => {
        const blob = new Blob([event.data], { type: 'video/mp4' });
        const videoFile = new File([blob], 'enregistrement.mp4', { type: 'video/mp4' });

        // Vérification du format du fichier vidéo
        if (videoFile.type !== 'video/mp4') {
            console.log('Le format du fichier vidéo est incorrect. Veuillez sélectionner un fichier au format MP4.');
            return;
        }
        console.log('Fichier vidéo : ', videoFile);

        // Envoi de la vidéo à l'API Laravel
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('candidate_id', 2); // Remplacez 1 par l'ID du candidat approprié

        axios.post('http://localhost:8000/api/responses', formData)
            .then(response => {
                console.log(response.data);
                setSubmitted(true);
            })
            .catch(error => console.log('Erreur lors de l\'envoi de la vidéo : ', error.response.data));
    };

    const restartRecording = () => {
        if (!recording) {
            setElapsedTime(0);
            startRecording();
        }
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1); // Passer à la question suivante
        setSubmitted(false); // Réinitialiser l'état de soumission
    };

    const posteData = {
        "id": 22,
        "recruiter_id": 1,
        "title": "Développeur Full Stack",
        "description": "Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe dynamique. Le candidat idéal possède des compétences dans les technologies front-end et back-end, ainsi qu'une solide expérience en développement web.",
        "created_at": "2024-06-10T07:55:37.000000Z",
        "updated_at": "2024-06-10T07:55:37.000000Z",
        "questions": [
            {
                "id": 30,
                "post_id": 22,
                "question_text": "Quelle est votre expérience en développement web ?",
                "created_at": "2024-06-10T05:55:37.000000Z",
                "updated_at": "2024-06-10T05:55:37.000000Z"
            },
            {
                "id": 31,
                "post_id": 22,
                "question_text": "Pouvez-vous citer quelques projets web auxquels vous avez contribué ?",
                "created_at": "2024-06-10T05:55:37.000000Z",
                "updated_at": "2024-06-10T05:55:37.000000Z"
            },
            {
                "id": 32,
                "post_id": 22,
                "question_text": "Quels sont les langages de programmation que vous maîtrisez pour le développement back-end ?",
                "created_at": "2024-06-10T05:55:37.000000Z",
                "updated_at": "2024-06-10T05:55:37.000000Z"
            },
            {
                "id": 33,
                "post_id": 22,
                "question_text": "Avez-vous déjà travaillé avec des bases de données relationnelles ?",
                "created_at": "2024-06-10T05:55:37.000000Z",
                "updated_at": "2024-06-10T05:55:37.000000Z"
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center">
            <div className="container mx-auto mt-4">
                <div className="flex justify-center">
                    <div className="w-full md:w-1/2">
                        <div className="bg-gray-800 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4 relative">
                            {/* Titre et description du poste */}
                            <div className="mb-6 p-6 bg-white rounded-lg shadow-lg animate__animated animate__fadeIn">
                                <h3 className="text-3xl font-bold mb-2 text-center text-black">{posteData.title}</h3>
                                <p className="text-gray-700 text-center">{posteData.description}</p>
                            </div>

                            {/* Affichage de la question actuelle */}
                            <h5 className="text-lg font-bold mb-4">Question</h5>
                            <h6 className="text-gray-300 mb-4">{currentQuestionIndex < posteData.questions.length && posteData.questions[currentQuestionIndex].question_text}</h6>
                            <h5 className="text-lg font-bold mb-4">Enregistrement vidéo</h5>
                            <video ref={videoRef} className="mb-2 w-full" muted autoPlay />
                            {recording && (
                                <div className="absolute top-0 right-0 mt-2 mr-2 flex items-center">
                                    <FaRegClock className="mr-1 text-red-500" />
                                    {Math.floor(elapsedTime / 60)}:{elapsedTime % 60 < 10 ? '0' : ''}{elapsedTime % 60}
                                </div>
                            )}
                            <div className="flex justify-center">
                                <button
                                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 mx-2 rounded`}
                                    onClick={startRecording}
                                >
                                    Commencer
                                </button>
                                <button
                                    className={`bg-${submitted ? 'green' : 'yellow'}-500 hover:bg-${submitted ? 'green' : 'yellow'}-700 text-white font-bold py-2 px-4 mx-2 rounded`}
                                    onClick={submitted ? handleNextQuestion : (recording ? stopRecording : null)}
                                    disabled={recording && elapsedTime >= 180}
                                >
                                    {submitted ? 'Suivant' : 'Soumettre'}
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 mx-2 rounded"
                                    onClick={restartRecording}
                                >
                                    Refaire
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Enregistrement;
