import React, { useState, useEffect } from 'react';
import { BsPencilSquare, BsTrash, BsInfoCircleFill, BsX, BsSend } from 'react-icons/bs';
import { RiAddFill } from 'react-icons/ri';
import Modal from 'react-modal';
import SideBar from './SideBar';
import NavBar from './NavBar';
import { axiosClient } from '../../api/axios';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({ title: '', description: '', questions: [{ question_text: '', preparation_time: '', response_time: '' }] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkToSend, setLinkToSend] = useState('');


  const fetchPosts = (page, term = '') => {
    axiosClient.get(`/posts?page=${page}&limit=10&search=${term}`)
      .then(response => {
        setPosts(response.data.posts);
        setTotalPages(Math.ceil(response.data.total / 10));
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des posts : ', error);
      });
  };

  useEffect(() => {
    fetchPosts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const postData = {
      title: currentPost.title,
      description: currentPost.description,
      questions: currentPost.questions,
      recruiter_id: 1 // Remplacez ceci par l'ID réel du recruteur
    };

    axiosClient.post('/posts', postData)
      .then(response => {
        fetchPosts(currentPage);
        setIsSubmitting(false);
        setIsModalOpen(false);
        setCurrentPost({ title: '', description: '', questions: [{ question_text: '', preparation_time: '', response_time: '' }] });
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du post : ', error);
        setIsSubmitting(false);
      });
  };

  const handleEdit = () => {
    setIsSubmitting(true);
    const postData = {
      title: currentPost.title,
      description: currentPost.description,
      questions: currentPost.questions,
      recruiter_id: 1 // Remplacez ceci par l'ID réel du recruteur
    };

    axiosClient.put(`/posts/${currentPost.id}`, postData)
      .then(response => {
        fetchPosts(currentPage);
        setIsSubmitting(false);
        setIsModalOpen(false);
        setCurrentPost({ title: '', description: '', questions: [{ question_text: '', preparation_time: '', response_time: '' }] });
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du post : ', error);
        setIsSubmitting(false);
      });
  };

  const handleDelete = () => {
    setIsSubmitting(true);

    axiosClient.delete(`/posts/${postIdToDelete}`)
      .then(() => {
        fetchPosts(currentPage);
        setIsSubmitting(false);
        setShowConfirmationModal(false);
        setPostIdToDelete(null);
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du post : ', error);
        setIsSubmitting(false);
        setShowConfirmationModal(false);
        setPostIdToDelete(null);
      });
  };

  const handleDetails = (post) => {
    setCurrentPost({
      id: post.id,
      title: post.title,
      description: post.description,
      author: post.author,
      created_at: post.created_at,
      questions: post.questions
    });
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const handleSendLink = (postId) => {
    // const link = `https://recvue.hellow.fr/profil/${postId}`;
    const link = `https://recvue.hellow.fr/profil/`;
    setLinkToSend(link);
    setIsLinkModalOpen(true);
  };

  const addQuestion = () => {
    setCurrentPost({ ...currentPost, questions: [...currentPost.questions, { question_text: '', preparation_time: '', response_time: '' }] });
  };

  const removeQuestion = (index) => {
    const newQuestions = currentPost.questions.filter((_, i) => i !== index);
    setCurrentPost({ ...currentPost, questions: newQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = currentPost.questions.map((q, i) => i === index ? { ...q, [field]: value } : q);
    setCurrentPost({ ...currentPost, questions: newQuestions });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800 text-white">
      <SideBar />
      <div className="w-full">
        <NavBar />
        <div className="p-4">
          <div className="flex items-center mb-4">
            <input
              type="text"
              className="border border-gray-800 text-black rounded px-4 py-2 w-full md:w-64 bg-white mb-2 md:mb-0"
              placeholder="Rechercher par titre"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md ml-2"
              onClick={() => setIsModalOpen(true)}
            >
              <RiAddFill className="mr-1 " />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date de création</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map(post => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">{post.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">
                        {new Date(post.created_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        onClick={() => {
                          setCurrentPost(post);
                          setIsModalOpen(true);
                        }}
                      >
                        <BsPencilSquare />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 mr-2"
                        onClick={() => {
                          setPostIdToDelete(post.id);
                          setShowConfirmationModal(true);
                        }}
                      >
                        <BsTrash />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 mr-2"
                        onClick={() => handleDetails(post)}
                      >
                        <BsInfoCircleFill />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        onClick={() => handleSendLink(post.id)}
                      >
                        <BsSend />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <nav className="inline-flex">
              {[...Array(totalPages)].map((_, page) => (
                <button
                  key={page}
                  className={`px-4 py-2 mx-1 bg-blue-500 text-white rounded ${currentPage === page + 1 ? 'bg-blue-700' : ''}`}
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      >
        <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 relative overflow-y-auto max-h-full">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-0 right-0 m-2 text-black text-2xl font-bold"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-4">{currentPost.id ? 'Modifier Post' : 'Ajouter Post'}</h2>
          <input
            type="text"
            placeholder="Titre"
            className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
            value={currentPost.title}
            onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
            rows="3"
            value={currentPost.description}
            onChange={(e) => setCurrentPost({ ...currentPost, description: e.target.value })}
          />
          {currentPost.questions.map((question, index) => (
            <div key={index} className="mb-2 relative">
              <button
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-xl"
                onClick={() => removeQuestion(index)}
              >
                <BsX />
              </button>
              <input
                type="text"
                placeholder={`Question ${index + 1}`}
                className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
                value={question.question_text}
                onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
              />
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Temps de préparation (minutes)"
                  className="border border-gray-300 rounded px-4 py-2 mb-2 w-1/2"
                  value={question.preparation_time}
                  onChange={(e) => handleQuestionChange(index, 'preparation_time', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Temps de réponse (minutes)"
                  className="border border-gray-300 rounded px-4 py-2 mb-2 w-1/2"
                  value={question.response_time}
                  onChange={(e) => handleQuestionChange(index, 'response_time', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md mb-2"
            onClick={addQuestion}
          >
            Ajouter une question
          </button>
          <div className="flex justify-end">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={currentPost.id ? handleEdit : handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'En cours...' : currentPost.id ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showConfirmationModal}
        onRequestClose={() => setShowConfirmationModal(false)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      >
        <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 relative">
          <h2 className="text-xl font-semibold mb-4">Confirmer la suppression</h2>
          <p className="mb-4">Êtes-vous sûr de vouloir supprimer ce post ?</p>
          <div className="flex justify-end">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md mr-2"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Suppression en cours...' : 'Supprimer'}
            </button>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-md"
              onClick={() => setShowConfirmationModal(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showDetailsModal}
        onRequestClose={handleCloseDetailsModal}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      >
        <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 relative">
          <button
            onClick={handleCloseDetailsModal}
            className="absolute top-0 right-0 m-2 text-black text-2xl font-bold"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-4">{currentPost.title}</h2>
          <p className="text-gray-600 mb-4">Date de création: {new Date(currentPost.created_at).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-800 mb-4">{currentPost.description}</p>
          <h3 className="text-lg font-semibold mb-2">Questions</h3>
          <ul>
            {currentPost.questions && currentPost.questions.map((question, index) => (
              <li key={index} className="text-gray-800 mb-2">
                Question {index + 1}: {question.question_text} <br />
                Temps de préparation: {question.preparation_time} minutes <br />
                Temps de réponse: {question.response_time} minutes
              </li>
            ))}
          </ul>
        </div>
      </Modal>
      <Modal
        isOpen={isLinkModalOpen}
        onRequestClose={() => setIsLinkModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      >
        <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 relative">
          <button
            onClick={() => setIsLinkModalOpen(false)}
            className="absolute top-0 right-0 m-2 text-black text-2xl font-bold"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-4">Envoyer le lien</h2>
          <p className="mb-4">Copiez le lien ci-dessous et envoyez-le au candidat :</p>
          <div className="border border-gray-300 rounded px-4 py-2 mb-4 w-full bg-gray-100 text-gray-800">
            {linkToSend}
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={() => navigator.clipboard.writeText(linkToSend)}
          >
            Copier le lien
          </button>
        </div>
      </Modal>
    </div>
  );
}
