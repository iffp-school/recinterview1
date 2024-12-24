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

  // --- États ------------------------------------------------------------------
  const [recording, setRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [post, setPost] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);

  // On démarre en mode "practice"
  const [isPractice, setIsPractice] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState([]);

  // On initialise volontairement à 15 et 30
  const [preparationTime, setPreparationTime] = useState(15);
  const [responseTime, setResponseTime] = useState(30);

  const [isPreparation, setIsPreparation] = useState(true);
  const [testVideoURL, setTestVideoURL] = useState(null);

  const [theme, setTheme] = useState('light');
  const [buttonLabel, setButtonLabel] = useState('Tester');
  const [videoBlob, setVideoBlob] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  // Pour afficher REPLAY
  const [showReplay, setShowReplay] = useState(false);

  const openFinalModal = () => setIsFinalModalOpen(true);
  const closeFinalModal = () => setIsFinalModalOpen(false);

  // --- useEffect : Récupération du post et du candidat -----------------------
  useEffect(() => {
    const fetchPostAndCandidate = async () => {
      try {
        // Pour contourner le cache
        const response = await axiosClient.get(`/posts/${selectedPostId}`, {
          headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
        });
        setPost(response.data);

        const candidateResponse = await axiosClient.get(`/candidates/email/${email}`, {
          headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
        });
        if (candidateResponse.data) {
          setCandidateId(candidateResponse.data.id);
        }

        // Initialiser les tentatives pour chaque question
        setAttemptsLeft(Array(response.data.questions.length).fill(3));

        // IMPORTANT : on NE fixe plus preparationTime / responseTime ici pour la question test.
        // Car on veut forcer 15 et 30, donc on laisse le useEffect suivant ou handleNextQuestion gérer ça.
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des données du poste ou du candidat:',
          error
        );
      }
    };

    fetchPostAndCandidate();
  }, [email, selectedPostId]);

  // --- useEffect : Mise à jour des temps (preparation/response) selon isPractice et question courante
  useEffect(() => {
    if (!post) return; // On attend d'avoir le post

    if (isPractice) {
      // 1) Mode practice : impose toujours 15 et 30
      setPreparationTime(15);
      setResponseTime(30);
    } else {
      // 2) Mode "vraies questions"
      //    On applique la durée de la question courante (si existante)
      if (currentQuestionIndex < post.questions.length) {
        const q = post.questions[currentQuestionIndex];
        setPreparationTime(q.preparation_time);
        setResponseTime(q.response_time);
      }
    }
  }, [isPractice, currentQuestionIndex, post]);

  // --- useEffect : Timer pour la préparation ----------------------------------
  useEffect(() => {
    let timer;
    if (isPreparation && preparationTime > 0 && buttonLabel === 'Enregistrer') {
      timer = setInterval(() => {
        setPreparationTime((prevTime) => {
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

  // --- useEffect : Timer pour l’enregistrement --------------------------------
  useEffect(() => {
    let timer;
    if (recording) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => {
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

  // --- Fonctions de contrôle --------------------------------------------------
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
      setButtonLabel('Envoyer');
      setIsMuted(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setShowReplay(true);

      // Si c'était la pratique, on passe au bouton "Passer à Q1" sinon "Suivant"
      setButtonLabel(isPractice ? `Passer à Q1/${post.questions.length}` : 'Suivant');
      setIsMuted(true);
    }
  };

  const handleDataAvailable = (event) => {
    const blob = new Blob([event.data], { type: 'video/mp4' });
    const videoURL = URL.createObjectURL(blob);
    setTestVideoURL(videoURL);
    setVideoBlob(blob);
  };

  // Soumettre la vidéo (uniquement en mode "vrai" test, pas en practice)
  const submitVideo = () => {
    if (videoBlob && !isPractice) {
      const videoFile = new File([videoBlob], 'enregistrement.mp4', { type: 'video/mp4' });
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('candidate_id', candidateId);

      axiosClient
        .post('/responses', formData)
        .then(() => {
          console.log('Vidéo envoyée, vous pouvez passer à la question suivante.');
        })
        .catch((error) =>
          console.log("Erreur lors de l'envoi de la vidéo : ", error.response?.data)
        );
    }
  };

  const handleNextQuestion = () => {
    if (isPractice) {
      // Fin de la partie "pratique" : on passe en mode vrai test
      setIsPractice(false);
      setTestVideoURL(null);
      setElapsedTime(0);
      setIsPreparation(true);
      setShowReplay(false);
      setButtonLabel('Enregistrer');
    } else {
      // Passer à la question suivante (vraie question)
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setElapsedTime(0);
      setIsPreparation(true);
      setShowReplay(false);

      if (nextIndex < post.questions.length) {
        setButtonLabel('Enregistrer');
      } else {
        // plus de questions => Terminer
        setButtonLabel('Terminer');
        openFinalModal();
      }
    }
  };

  const handleReRecord = () => {
    if (attemptsLeft[currentQuestionIndex] > 0) {
      setAttemptsLeft((attempts) => {
        const newAttempts = [...attempts];
        newAttempts[currentQuestionIndex] -= 1;
        return newAttempts;
      });
      setElapsedTime(0);
      setRecording(false);
      setShowReplay(false);
      startRecording();
    }
  };

  const handleQuit = () => {
    axiosClient
      .post('/execute-storage-script')
      .then((response) => {
        console.log('Script exécuté avec succès :', response.data);
        closeFinalModal();
        navigate('/');
      })
      .catch((error) => {
        console.error(
          "Erreur lors de l'exécution du script :",
          error.response ? error.response.data : error.message
        );
      });
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  if (!post || !candidateId) {
    return <div className="text-white">Loading...</div>;
  }

  // --- Rendu final -----------------------------------------------------------
  return (
    <div
      className={`${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      } min-h-screen flex items-center justify-center transition-colors duration-300 p-4`}
    >
      <div className="absolute top-4 right-4">
        <button onClick={toggleTheme} className="text-lg font-semibold">
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      <div className="container mx-auto">
        <div
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } text-black shadow-md rounded px-4 md:px-8 pt-6 pb-8 mb-4 transition-colors duration-300 animate__animated animate__fadeIn`}
        >
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-4">
              <div
                className={`${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                } mb-6 p-6 rounded-lg shadow-lg`}
              >
                <h3
                  className={`text-3xl font-bold mb-2 text-center ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}
                >
                  {post.title}
                </h3>
                <div
                  className={`text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: post.description }}
                />
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
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              showReplay={showReplay}
            />
          </div>
        </div>
      </div>

      <FinalModal
        isFinalModalOpen={isFinalModalOpen}
        closeFinalModal={closeFinalModal}
        handleQuit={handleQuit}
        theme={theme}
        messageEnd={post.message_end}
      />
    </div>
  );
}

export default Enregistrement;
