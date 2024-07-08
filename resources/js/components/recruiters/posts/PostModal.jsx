import React, { useState } from 'react';
import Modal from 'react-modal';
import { BsTrash, BsPencil } from 'react-icons/bs';

const PostModal = ({
  isModalOpen,
  setIsModalOpen,
  currentPost,
  setCurrentPost,
  handleSubmit,
  handleEdit,
  addQuestion,
  removeQuestion,
  handleQuestionChange,
  isSubmitting,
}) => {
  // Ensure currentPost and its properties are always defined
  const post = currentPost || { title: '', description: '', questions: [] };

  // Local state to manage editing questions
  const [editingIndex, setEditingIndex] = useState(null);

  const editQuestion = (index) => {
    setEditingIndex(index);
  };

  const saveQuestion = () => {
    setEditingIndex(null);
  };

  // Local state for new question input
  const [newQuestion, setNewQuestion] = useState({ question_text: '', preparation_time: 60, response_time: 30 });

  const handleNewQuestionChange = (field, value) => {
    setNewQuestion({ ...newQuestion, [field]: value });
  };

  const handleAddQuestion = () => {
    addQuestion(newQuestion);
    setNewQuestion({ question_text: '', preparation_time: 60, response_time: 30 });
  };

  // Check if new question fields are filled to enable/disable the "Ajouter" button
  const isNewQuestionFieldsFilled = () => {
    return newQuestion.question_text && newQuestion.preparation_time && newQuestion.response_time;
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
    >
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 lg:w-2/3 relative overflow-y-auto max-h-full">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-0 right-0 m-2 text-black text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {post.id ? 'Modifier Poste Enretien Video' : 'Ajouter Poste Entretien Video'}
        </h2>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 pr-4">
            <input
              type="text"
              placeholder="Titre"
              className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
              value={post.title}
              onChange={(e) => setCurrentPost({ ...post, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
              rows="3"
              value={post.description}
              onChange={(e) => setCurrentPost({ ...post, description: e.target.value })}
            />
            <h2 className="text-xl font-semibold mb-4">
              Ajouter des questions :
            </h2>
            <div>
              <input
                type="text"
                placeholder="Question"
                className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
                value={newQuestion.question_text}
                onChange={(e) => handleNewQuestionChange('question_text', e.target.value)}
              />
              <div className="flex space-x-2">
                <select
                  className="border border-gray-300 rounded px-4 py-2 mb-2 w-1/2"
                  value={newQuestion.preparation_time}
                  onChange={(e) => handleNewQuestionChange('preparation_time', e.target.value)}
                >
                  <option value="60">1 min</option>
                  <option value="90">1 min 30 sec</option>
                  <option value="120">2 min</option>
                </select>
                <select
                  className="border border-gray-300 rounded px-4 py-2 mb-2 w-1/2"
                  value={newQuestion.response_time}
                  onChange={(e) => handleNewQuestionChange('response_time', e.target.value)}
                >
                  <option value="30">30 sec</option>
                  <option value="60">1 min</option>
                  <option value="90">1 min 30 sec</option>
                </select>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md mb-2"
                onClick={handleAddQuestion}
                disabled={!isNewQuestionFieldsFilled()}
              >
                Ajouter
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 pl-4">
            <div className="mb-4">
              <h3 className="font-semibold">Configuration de votre poste entretien vidéo</h3>
              {post.questions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-100 mb-2 rounded"
                >
                  <div>
                    <h4>{question.question_text}</h4>
                    {editingIndex === index && (
                      <>
                        <input
                          type="text"
                          value={question.question_text}
                          onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                          className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
                        />
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-md mb-2"
                          onClick={saveQuestion}
                        >
                          Sauvegarder
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => editQuestion(index)}
                    >
                      <BsPencil />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => removeQuestion(index)}
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>
              ))}
              <p className="mt-2 text-sm">
                Durée totale :{' '}
                {Math.floor(
                  post.questions.reduce(
                    (total, q) => total + q.preparation_time + q.response_time,
                    0
                  ) / 60
                )}{' '}
                min{' '}
                {(
                  post.questions.reduce(
                    (total, q) => total + q.preparation_time + q.response_time,
                    0
                  ) % 60
                )}{' '}
                sec / 10 min
              </p>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={post.id ? handleEdit : handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'En cours...' : post.id ? 'Valider Poste Entretien Video' : 'Valider Poste Entretien Video'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PostModal;
