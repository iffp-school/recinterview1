// pages/Enregistrement.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import { axiosClient } from '../../api/axios';
import VideoRecording from './VideoRecording';
import FinalModal from './FinalModal';

function Enregistrement() {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, selectedPostId } = location.state;
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [post, setPost] = useState(null);
    const [candidateId, setCandidateId] = useState(null);
    const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);
    const [isPractice, setIsPractice] = useState(true);
    const [attemptsLeft, setAttemptsLeft] = useState(3);
    const [preparationTime, setPreparationTime] = useState(0);
    const [responseTime, setResponseTime] = useState(0);
    const [isPreparation, setIsPreparation] = useState(true);
    const [theme, setTheme] = useState('light');

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
        axiosClient.post('/execute-storage-script')
            .then(response => {
                console.log('Script exécuté avec succès :', response.data);
                stopCamera();
                closeFinalModal();
                navigate('/');
            })
            .catch(error => {
                console.error('Erreur lors de l\'exécution du script :', error.response ? error.response.data : error.message);
            });
    };

    const handleReRecord = () => {
        if (attemptsLeft > 1) {
            setAttemptsLeft(attemptsLeft - 1);
            setElapsedTime(0);
            setRecording(false);
            startRecording();
        } else {
            alert('Vous avez atteint le nombre maximum de tentatives.');
        }
    };

    if (!post || !candidateId) {
        return <div className="text-white">Loading...</div>;
    }

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    return (
        <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen flex items-center justify-center transition-colors duration-300 p-4`}>
            <div className="absolute top-4 right-4">
                <button onClick={toggleTheme} className="text-lg font-semibold">
                    {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
            </div>
            <div className="container mx-auto">
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} text-black shadow-md rounded px-4 md:px-8 pt-6 pb-8 mb-4 transition-colors duration-300 animate__animated animate__fadeIn`}>
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 p-4">
                            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} mb-6 p-6 rounded-lg shadow-lg`}>
                                <h3 className={`text-3xl font-bold mb-2 text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{post.title}</h3>
                                <p className={`text-center ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} style={{ whiteSpace: 'pre-wrap' }}>{post.description}</p>
                            </div>
                        </div>
                        <VideoRecording
                            theme={theme}
                            post={post}
                            currentQuestionIndex={currentQuestionIndex}
                            recording={recording}
                            isFinalModalOpen={isFinalModalOpen}
                            responseTime={responseTime}
                            elapsedTime={elapsedTime}
                            isPreparation={isPreparation}
                            preparationTime={preparationTime}
                            videoRef={videoRef}
                            startRecording={startRecording}
                            stopRecording={stopRecording}
                            handleDataAvailable={handleDataAvailable}
                            handleReRecord={handleReRecord}
                            attemptsLeft={attemptsLeft}
                        />
                    </div>
                </div>
            </div>
            <FinalModal
                isFinalModalOpen={isFinalModalOpen}
                closeFinalModal={closeFinalModal}
                handleQuit={handleQuit}
                theme={theme}
            />
        </div>
    );
}

export default Enregistrement;
