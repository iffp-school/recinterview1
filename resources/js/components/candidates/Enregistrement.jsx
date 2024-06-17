import React, { useRef, useState, useEffect } from 'react';
import { FaRegClock } from 'react-icons/fa';
import { axiosClient } from '../../api/axios'; // Utilisation de axiosClient

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
                setElapsedTime(prevTime => {
                    if (prevTime >= 60) {
                        stopRecording();
                        clearInterval(timer);
                        return prevTime;
                    }
                    return prevTime + 1;
                });
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

        if (videoFile.type !== 'video/mp4') {
            console.log('Le format du fichier vidéo est incorrect. Veuillez sélectionner un fichier au format MP4.');
            return;
        }
        console.log('Fichier vidéo : ', videoFile);

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('candidate_id', 2); // Remplacez par l'ID du candidat approprié
        formData.append('question_id', posteData.questions[currentQuestionIndex].id); // Ajoutez l'ID de la question

        axiosClient.post('/responses', formData)
            .then(response => {
                console.log(response.data);
                setSubmitted(true);
            })
            .catch(error => console.log('Erreur lors de l\'envoi de la vidéo : ', error.response.data));
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSubmitted(false);
        setElapsedTime(0); // Réinitialiser le timer pour la question suivante
        startRecording(); // Démarrer l'enregistrement pour la question suivante
    };

    const posteData = {
        "id": 22,
        "recruiter_id": 1,
        "title": "Développeur Full Stack",
        "description": "Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe dynamique. Le candidat idéal possède des compétences dans les technologies front-end et back-end, ainsi qu'une solide expérience en développement web.\n\nCompétences demandées :\n- JavaScript (React, Node.js)\n- HTML/CSS\n- Bases de données (SQL, NoSQL)\n- API REST\n- Git et contrôle de version",
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
        <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
            <div className="container mx-auto">
                <div className="bg-gray-900 text-white shadow-md rounded px-4 md:px-8 pt-6 pb-8 mb-4 animate__animated animate__fadeIn">
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 p-4">
                            <div className="mb-6 p-6 bg-white rounded-lg shadow-lg">
                                <h3 className="text-3xl font-bold mb-2 text-center text-black">{posteData.title}</h3>
                                <p className="text-gray-700 text-center" style={{ whiteSpace: 'pre-wrap' }}>{posteData.description}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 p-4">
                            <div className="relative mb-4">
                                <div className="flex justify-between items-center mb-4">
                                    {posteData.questions.map((_, index) => (
                                        <div key={index} className={`w-1/4 h-2 ${currentQuestionIndex >= index ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-500`} />
                                    ))}
                                </div>
                                <div className="mb-6 p-6 bg-white rounded-lg shadow-lg relative">
                                    <div className="flex justify-center items-center mb-4">
                                        <span className="bg-blue-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                                            {currentQuestionIndex < posteData.questions.length && posteData.questions[currentQuestionIndex].question_text}
                                        </span>
                                    </div>
                                    <video ref={videoRef} className="mb-2 w-full" muted autoPlay />
                                    {recording && (
                                        <div className="absolute top-0 right-0 mt-2 mr-2">
                                            <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full flex items-center">
                                                <FaRegClock className="mr-1" />
                                                {Math.floor(elapsedTime / 60)}:{elapsedTime % 60 < 10 ? '0' : ''}{elapsedTime % 60}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded"
                                    onClick={startRecording}
                                    disabled={recording} // Désactiver le bouton pendant l'enregistrement
                                >
                                    Commencer
                                </button>
                                <button
                                    className={`bg-${submitted ? 'green-500 hover:bg-green-700' : 'yellow-500 hover:bg-yellow-700'} text-white font-bold py-2 px-4 mx-2 rounded`}
                                    onClick={submitted ? handleNextQuestion : stopRecording}
                                    disabled={!recording && !submitted} // Désactiver si pas d'enregistrement ou déjà soumis
                                >
                                    {submitted ? 'Suivant' : 'Soumettre'}
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
