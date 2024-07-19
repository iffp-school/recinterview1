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
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [post, setPost] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);
  const [isPractice, setIsPractice] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState([]);
  const [preparationTime, setPreparationTime] = useState(30);
  const [responseTime, setResponseTime] = useState(120);
  const [isPreparation, setIsPreparation] = useState(true);
  const [testVideoURL, setTestVideoURL] = useState(null);
  const [theme, setTheme] = useState('light');
  const [buttonLabel, setButtonLabel] = useState('Tester');
  const [videoBlob, setVideoBlob] = useState(null); // Store the video blob

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

        // Initialiser les tentatives pour chaque question
        setAttemptsLeft(Array(response.data.questions.length).fill(3));
      } catch (error) {
        console.error("Erreur lors de la récupération des données du poste ou du candidat:", error);
      }
    };

    fetchPostAndCandidate();
  }, [email, selectedPostId]);

  useEffect(() => {
    let timer;
    if (isPreparation && preparationTime > 0 && buttonLabel === 'Enregistrer') {
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
  }, [isPreparation, preparationTime, buttonLabel]);

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

  const startPreparation = () => {
    setButtonLabel('Enregistrer');
  };

  const startRecording = () => {
    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.srcObject) {
      const stream = webcamRef.current.video.srcObject;
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
      setRecording(true);
      setButtonLabel('Arrêter');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setButtonLabel(isPractice ? `Passer à Q1/${post.questions.length}` : 'Soumettre');
    }
  };

  const handleDataAvailable = (event) => {
    const blob = new Blob([event.data], { type: 'video/mp4' });
    const videoURL = URL.createObjectURL(blob);
    setTestVideoURL(videoURL);
    setVideoBlob(blob); // Store the video blob
  };

  const submitVideo = () => {
    if (videoBlob && !isPractice) {
      const videoFile = new File([videoBlob], 'enregistrement.mp4', { type: 'video/mp4' });
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('candidate_id', candidateId);

      axiosClient.post('/responses', formData)
        .then(response => {
          if (currentQuestionIndex + 1 < post.questions.length) {
            setButtonLabel(`Passer à Q${currentQuestionIndex + 2}/${post.questions.length}`);
          } else {
            setButtonLabel('Terminer');
          }
        })
        .catch(error => console.log('Erreur lors de l\'envoi de la vidéo : ', error.response.data));
    }
  };

  const handleNextQuestion = () => {
    if (isPractice) {
      setIsPractice(false);
      setTestVideoURL(null);
      setPreparationTime(post.questions[0].preparation_time * 60);
      setResponseTime(post.questions[0].response_time * 60);
      setButtonLabel('Enregistrer');
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setElapsedTime(0);
      setIsPreparation(true);
      if (currentQuestionIndex + 1 < post.questions.length) {
        setPreparationTime(post.questions[currentQuestionIndex + 1].preparation_time * 60);
        setResponseTime(post.questions[currentQuestionIndex + 1].response_time * 60);
        setButtonLabel('Enregistrer');
      } else {
        setButtonLabel('Terminer');
        openFinalModal();
      }
    }
  };

  const handleReRecord = () => {
    if (attemptsLeft[currentQuestionIndex] > 0) {
      setAttemptsLeft(attemptsLeft => {
        const newAttempts = [...attemptsLeft];
        newAttempts[currentQuestionIndex] -= 1;
        return newAttempts;
      });
      setElapsedTime(0);
      setRecording(false);
      startRecording();
    }
  };

  const handleQuit = () => {
    axiosClient.post('/execute-storage-script')
      .then(response => {
        console.log('Script exécuté avec succès :', response.data);
        closeFinalModal();
        navigate('/');
      })
      .catch(error => {
        console.error('Erreur lors de l\'exécution du script :', error.response ? error.response.data : error.message);
      });
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  if (!post || !candidateId) {
    return <div className="text-white">Loading...</div>;
  }

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
              webcamRef={webcamRef}
              startPreparation={startPreparation}
              startRecording={startRecording}
              stopRecording={stopRecording}
              handleDataAvailable={handleDataAvailable}
              handleNextQuestion={handleNextQuestion}
              handleReRecord={handleReRecord}
              attemptsLeft={attemptsLeft}
              buttonLabel={buttonLabel}
              testVideoURL={testVideoURL}
              setTestVideoURL={setTestVideoURL}
              isPractice={isPractice}
              openFinalModal={openFinalModal}
              submitVideo={submitVideo}
              mediaRecorderRef={mediaRecorderRef}
              candidateId={candidateId}
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
