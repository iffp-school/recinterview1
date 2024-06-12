import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsPencilSquare, BsTrash, BsInfoCircleFill } from 'react-icons/bs';
import { RiAddFill } from 'react-icons/ri';
import Modal from 'react-modal';
import SideBar from './SideBar';

// Définir l'élément racine pour la modal
Modal.setAppElement('#root');

// Définir l'URL de base pour l'API
const baseURL = 'http://localhost:8000/';

export default function Posts() {
  // Variables d'état pour gérer les posts, le terme de recherche, la visibilité de la modal, les données du post actuel, et l'état de soumission
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({ title: '', description: '', questions: [''] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  // Utiliser useEffect pour récupérer les posts de l'API lors du chargement du composant
  useEffect(() => {
    axios.get(baseURL + 'api/posts')
      .then(response => {
        setPosts(response.data);
        setFilteredPosts(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des posts : ', error);
      });
  }, []);

  // Gérer la recherche de posts par titre
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredPosts(posts.filter(post =>
      post.title.toLowerCase().includes(term)
    ));
  };

  // Fonction pour ouvrir la modal de confirmation
  const openConfirmationModal = (postId) => {
    setPostIdToDelete(postId);
    setShowConfirmationModal(true);
  };

  // Fonction pour fermer la modal de confirmation
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setPostIdToDelete(null);
  };

  // Gérer la soumission du formulaire pour ajouter un nouveau post
  const handleSubmit = () => {
    setIsSubmitting(true);
    const postData = {
      title: currentPost.title,
      description: currentPost.description,
      questions: currentPost.questions,
      recruiter_id: 1 // Remplacez ceci par l'ID réel du recruteur
    };

    axios.post(`${baseURL}api/posts`, postData)
      .then(response => {
        setPosts([...posts, response.data]);
        setFilteredPosts([...filteredPosts, response.data]);
        setIsSubmitting(false);
        setIsModalOpen(false);
        setCurrentPost({ title: '', description: '', questions: [''] });
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du post : ', error);
        setIsSubmitting(false);
      });
  };

  // Fonction pour éditer un post existant
  const handleEdit = () => {
    setIsSubmitting(true);
    const postData = {
      title: currentPost.title,
      description: currentPost.description,
      questions: currentPost.questions,
      recruiter_id: 1 // Remplacez ceci par l'ID réel du recruteur
    };

    axios.put(`${baseURL}api/posts/${currentPost.id}`, postData)
      .then(response => {
        const updatedPosts = posts.map(post => {
          if (post.id === currentPost.id) {
            return response.data;
          }
          return post;
        });
        setPosts(updatedPosts);
        setFilteredPosts(updatedPosts);
        setIsSubmitting(false);
        setIsModalOpen(false);
        setCurrentPost({ title: '', description: '', questions: [''] });
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du post : ', error);
        setIsSubmitting(false);
      });
  };

  // Fonction pour supprimer un post
  const handleDelete = () => {
    setIsSubmitting(true);

    axios.delete(`${baseURL}api/posts/${postIdToDelete}`)
      .then(() => {
        const updatedPosts = posts.filter(post => post.id !== postIdToDelete);
        setPosts(updatedPosts);
        setFilteredPosts(updatedPosts);
        setIsSubmitting(false);
        setIsModalOpen(false);
        setCurrentPost({ title: '', description: '', questions: [''] });
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

  // Ajouter une nouvelle question au formulaire
  const addQuestion = () => {
    setCurrentPost({ ...currentPost, questions: [...currentPost.questions, ''] });
  };

  // Gérer le changement de texte d'une question
  const handleQuestionChange = (index, value) => {
    const newQuestions = currentPost.questions.map((q, i) => i ===
      index ? value : q);
    setCurrentPost({ ...currentPost, questions: newQuestions });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800 text-white">
      <SideBar />
      <div className="w-full md:w-3/4 p-4">
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
              {filteredPosts.map(post => (
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
                      onClick={() => openConfirmationModal(post.id)}
                    >
                      <BsTrash />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900 mr-2"
                      onClick={() => handleDetails(post)}
                    >
                      <BsInfoCircleFill />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      >
        <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 relative">
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
            <input
              key={index}
              type="text"
              placeholder={`Question ${index + 1}`}
              className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
              value={question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
            />
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
      {/* Modal de confirmation */}
      <Modal
        isOpen={showConfirmationModal}
        onRequestClose={closeConfirmationModal}
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
              onClick={closeConfirmationModal}
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>
      {/* Modal pour afficher les détails d'un poste */}
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
          <p className="text-gray-600 mb-4">Date de création: {currentPost.created_at}</p>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-800 mb-4">{currentPost.description}</p>
          <h3 className="text-lg font-semibold mb-2">Questions</h3>
          <ul>
            {currentPost.questions && currentPost.questions.map((question, index) => (
              <li key={index} className="text-gray-800 mb-2">
                Question {index + 1}: {question.question_text}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
}
