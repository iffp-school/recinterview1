import React from 'react';

const QuestionHeader = ({ post, currentQuestionIndex }) => {
    return (
        <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl text-white font-bold mb-2">Question {currentQuestionIndex + 1}: {post.questions[currentQuestionIndex].question_text}</h2>
            <h3 className="text-lg text-white">Question {currentQuestionIndex + 1}/{post.questions.length} : {post.questions[currentQuestionIndex].response_time} secondes</h3>
            <div className="w-full bg-gray-300 h-1 my-4">
                <div className="bg-blue-500 h-1" style={{ width: `${((currentQuestionIndex + 1) / post.questions.length) * 100}%` }}></div>
            </div>
        </div>
    );
};

export default QuestionHeader;
