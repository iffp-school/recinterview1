import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../SideBar';
import NavBar from '../NavBar';
import PostModal from './PostModal';
import { axiosClient } from '../../../api/axios';

const NewPost = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPost, setCurrentPost] = useState({
    title: '',
    description: '',
    questions: [], // Initialisez les questions comme un tableau vide
    recruiter_id: 1,
  });

  const handleStartClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axiosClient.post('/posts', currentPost);
      setIsModalOpen(false);
      navigate('/recruiter/posts'); // Redirect to posts list after successful submission
    } catch (error) {
      console.error('Erreur lors de l\'ajout du post : ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    setIsSubmitting(true);
    try {
      await axiosClient.put(`/recruiter/posts/${currentPost.id}`, currentPost);
      setIsModalOpen(false);
      navigate('/recruiter/posts'); // Redirect to posts list after successful update
    } catch (error) {
      console.error('Erreur lors de la mise à jour du post : ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    setCurrentPost({
      ...currentPost,
      questions: [...currentPost.questions, { question_text: '', preparation_time: 60, response_time: 30 }],
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = currentPost.questions.filter((_, i) => i !== index);
    setCurrentPost({ ...currentPost, questions: newQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = currentPost.questions.map((q, i) =>
      i === index ? { ...q, [field]: value, editing: false } : q
    );
    setCurrentPost({ ...currentPost, questions: newQuestions });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800 text-white">
      <SideBar />
      <div className="w-full">
        <NavBar />
        <div className="p-4">
          <div className="bg-white p-6 rounded-lg shadow-md text-black">
            <h2 className="text-2xl font-bold text-blue-500 mb-4">Création d'un Poste Entretien Vidéo</h2>
            <p className="mb-4">
              Vous souhaitez avoir un aperçu des compétences à l'oral d'un candidat, faites lui passer un pré-entretien vidéo.
              Le principe est simple, vous listez une série de questions qui seront posées au candidat. Ses réponses sont enregistrées par sa webcam.
              Vous avez ensuite accès à la vidéo que vous pouvez voir et revoir.
            </p>
            <p className="mb-4 font-semibold">Quelques conseils</p>
            <ul className="list-disc list-inside mb-4">
              <li>Posez des questions ouvertes qui attendent des réponses construites.</li>
              <li>Vous pouvez l'utiliser pour évaluer le niveau en langue de vos candidats.</li>
            </ul>
            <p className="mb-4 font-semibold">Exemple de questions d'un entretien vidéo pour un commercial international</p>
            <ul className="list-disc list-inside mb-4">
              <li>Présentez-vous en quelques minutes.</li>
              <li>Quels sont vos atouts pour ce poste ?</li>
              <li>Answer the question in English: Can you give me an example of when you took a special initiative?</li>
            </ul>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleStartClick}
            >
              Démarrer maintenant
            </button>
          </div>
        </div>
      </div>
      <PostModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentPost={currentPost}
        setCurrentPost={setCurrentPost}
        handleSubmit={handleSubmit}
        handleEdit={handleEdit}
        addQuestion={addQuestion}
        removeQuestion={removeQuestion}
        handleQuestionChange={handleQuestionChange}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default NewPost;
