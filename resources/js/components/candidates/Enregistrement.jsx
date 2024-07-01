import React, { useRef, useState, useEffect } from 'react';
import { FaRegClock } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { axiosClient } from '../../api/axios';

function Enregistrement() {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, selectedPostId } = location.state;
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [post, setPost] = useState(null);
    const [candidateId, setCandidateId] = useState(null);
    const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);

    const [preparationTime, setPreparationTime] = useState(0);
    const [responseTime, setResponseTime] = useState(0);
    const [isPreparation, setIsPreparation] = useState(true);

    const openFinalModal = () => setIsFinalModalOpen(true);
    const closeFinalModal = () => setIsFinalModalOpen(false);

    useEffect(() => {
        const fetchPostAndCandidate = async () => {
            try {
                const response = await axiosClient.get(`/posts/${selectedPostId}`);
                setPost(response.data);

                const candidateResponse = await axiosClient.get(`/candidates/email/${email}`);
                if (candidateResponse.data) {
                    setCandidateId(candidateResponse.data.id);
                }

                if (response.data.questions.length > 0) {
                    setPreparationTime(response.data.questions[0].preparation_time * 60);
                    setResponseTime(response.data.questions[0].response_time * 60);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données du poste ou du candidat:", error);
            }
        };

        fetchPostAndCandidate();
    }, [email, selectedPostId]);

    useEffect(() => {
        let timer;
        if (recording) {
            timer = setInterval(() => {
                setElapsedTime(prevTime => {
                    if (prevTime >= responseTime) {
                        stopRecording();
                        clearInterval(timer);
                        return prevTime;
                    }
                    return prevTime + 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [recording, responseTime]);

    useEffect(() => {
        let timer;
        if (isPreparation && preparationTime > 0) {
            timer = setInterval(() => {
                setPreparationTime(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        startRecording();
                        setIsPreparation(false);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isPreparation, preparationTime]);

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

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('candidate_id', candidateId);

        axiosClient.post('/responses', formData)
            .then(response => {
                if (currentQuestionIndex + 1 < post.questions.length) {
                    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                    setSubmitted(false);
                    setElapsedTime(0);
                    setIsPreparation(true);
                    setPreparationTime(post.questions[currentQuestionIndex + 1].preparation_time * 60);
                    setResponseTime(post.questions[currentQuestionIndex + 1].response_time * 60);
                } else {
                    openFinalModal();
                }
            })
            .catch(error => console.log('Erreur lors de l\'envoi de la vidéo : ', error.response.data));
    };

    const stopCamera = () => {
        let stream = videoRef.current.srcObject;
        let tracks = stream.getTracks();

        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
    };

    const handleQuit = () => {
        stopCamera();
        closeFinalModal();
        navigate('/');
    };

    if (!post || !candidateId) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
            <div className="container mx-auto">
                <div className="bg-gray-900 text-white shadow-md rounded px-4 md:px-8 pt-6 pb-8 mb-4 animate__animated animate__fadeIn">
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 p-4">
                            <div className="mb-6 p-6 bg-white rounded-lg shadow-lg">
                                <h3 className="text-3xl font-bold mb-2 text-center text-black">{post.title}</h3>
                                <p className="text-gray-700 text-center" style={{ whiteSpace: 'pre-wrap' }}>{post.description}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 p-4">
                            <div className="relative mb-4">
                                <div className="flex justify-between items-center mb-4">
                                    {post.questions.map((_, index) => (
                                        <div key={index} className={`w-1/4 h-2 ${currentQuestionIndex >= index ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-500`} />
                                    ))}
                                </div>
                                <div className="mb-6 p-6 bg-white rounded-lg shadow-lg relative">
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
                                {currentQuestionIndex < post.questions.length && (
                                    <button
                                        className={`bg-${recording ? 'green' : 'blue'}-500 hover:bg-${recording ? 'green' : 'blue'}-700 text-white font-bold py-2 px-4 mx-2 rounded`}
                                        onClick={recording ? stopRecording : startRecording}
                                    >
                                        {recording ? 'Soumettre' : 'Enregistrer'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isFinalModalOpen}
                onRequestClose={closeFinalModal}
                className="fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                contentLabel="Fin de l'entretien"
                closeTimeoutMS={300}
                ariaHideApp={false}
            >
                <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full transform transition-transform duration-300 ease-in-out translate-y-0">
                    <h2 className="text-2xl font-bold mb-4">Merci d'avoir passé l'entretien</h2>
                    <p className="mb-4 text-gray-700">
                        Vos réponses ont été enregistrées avec succès. Nous vous contacterons dès que possible avec les résultats. Merci de votre patience.
                    </p>
                    <button
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleQuit}
                    >
                        Quitter
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default Enregistrement;
