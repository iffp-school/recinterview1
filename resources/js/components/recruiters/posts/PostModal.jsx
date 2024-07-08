import React from 'react';
import Modal from 'react-modal';
import { BsX } from 'react-icons/bs';

const PostModal = ({ isModalOpen, setIsModalOpen, currentPost, setCurrentPost, handleSubmit, handleEdit, addQuestion, removeQuestion, handleQuestionChange, isSubmitting }) => (
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
);

export default PostModal;
