import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { BsTrash, BsPencil } from 'react-icons/bs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../utils/form.jsx';
import { Input } from '../../utils/input.jsx';
import { Button } from '../../utils/button.jsx';

// Validation schema for the question form
const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    question_text: z.string().min(1, { message: "Question is required" }),
    preparation_time: z.number().min(1, { message: "Preparation time is required" }),
    response_time: z.number().min(1, { message: "Response time is required" }),
})

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
    const post = currentPost || { title: '', description: '', questions: [] };

    const [editingIndex, setEditingIndex] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [totalDuration, setTotalDuration] = useState(0);

    useEffect(() => {
        const duration = post.questions.reduce(
            (total, q) => total + parseInt(q.preparation_time) + parseInt(q.response_time),
            0
        );
        setTotalDuration(duration);
    }, [post.questions]);

    const editQuestion = (index) => {
        const questionToEdit = post.questions[index];
        setNewQuestion({
            id: questionToEdit.id,  // s'assurer que l'ID est présent lors de l'édition
            question_text: questionToEdit.question_text,
            preparation_time: questionToEdit.preparation_time,
            response_time: questionToEdit.response_time,
        });
        setEditingIndex(index);
    };


    const [newQuestion, setNewQuestion] = useState({ question_text: '', preparation_time: 30, response_time: 90 });

    const handleNewQuestionChange = (field, value) => {
        setNewQuestion({ ...newQuestion, [field]: value });
    };

    const handleAddQuestion = () => {
        const totalDurationWithNewQuestion = totalDuration + parseInt(newQuestion.preparation_time) + parseInt(newQuestion.response_time);
        if (totalDurationWithNewQuestion > 900) {
            setErrorMessage("La durée totale ne peut pas dépasser 15 minutes !");
            return;
        }
        setErrorMessage('');

        // Ajouter la nouvelle question au tableau des questions
        setCurrentPost((prevPost) => ({
            ...prevPost,
            questions: [...prevPost.questions, newQuestion]
        }));

        // Réinitialiser les champs de la nouvelle question
        setNewQuestion({ question_text: '', preparation_time: 30, response_time: 90 });
    };


    const isNewQuestionFieldsFilled = () => {
        return newQuestion.question_text && newQuestion.preparation_time && newQuestion.response_time;
    };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: post.title || '',
            description: post.description || '',
            question_text: newQuestion.question_text || '',
            preparation_time: newQuestion.preparation_time || 30,
            response_time: newQuestion.response_time || 90,
        },
    });


    const { handleSubmit: handleFormSubmit, control, formState: { errors } } = form;

    const onSubmit = (data) => {
        if (editingIndex !== null) {
            // Mode édition: seulement sauver la question
            saveQuestion();
        } else {
            // Mode ajout: ajouter une nouvelle question
            handleAddQuestion();
        }
    };

    const saveQuestion = () => {
        // Vérifiez si vous êtes en mode édition ou en mode ajout
        if (editingIndex !== null) {
            // En mode édition, mettez à jour la question existante
            const updatedQuestions = [...post.questions];
            updatedQuestions[editingIndex] = {
                ...newQuestion, // Mise à jour des champs
                id: post.questions[editingIndex]?.id, // Conservez l'ID de la question existante
            };
            setCurrentPost({ ...post, questions: updatedQuestions });
            setEditingIndex(null);
        } else {
            // En mode ajout, ajoutez la nouvelle question au tableau
            const updatedQuestions = [...post.questions, { ...newQuestion }];
            setCurrentPost({ ...post, questions: updatedQuestions });
        }

        // Réinitialisez la nouvelle question après l'ajout ou l'édition
        setNewQuestion({ question_text: '', preparation_time: 30, response_time: 90 });
    };



    const totalMinutes = Math.floor(totalDuration / 60);
    const totalSeconds = totalDuration % 60;

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
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 pr-4">
                        <h2 className="text-xl font-semibold mb-4">Sélectionnez les questions à ajouter, à votre entretien vidéo.</h2>
                        <Form {...form}>
                            <form onSubmit={handleFormSubmit(onSubmit)}>
                                <FormField
                                    control={control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Titre *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Titre"
                                                    {...field}
                                                    value={field.value !== '' ? field.value : post.title}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setCurrentPost({ ...post, title: e.target.value });
                                                    }}
                                                />
                                            </FormControl>
                                            {errors.title && <FormMessage className="text-red-500">{errors.title.message}</FormMessage>}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description *</FormLabel>
                                            <FormControl>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={field.value !== '' ? field.value : post.description}
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                        setCurrentPost({ ...post, description: value });
                                                    }}
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            ['bold', 'italic', 'underline'],
                                                            [{ 'color': [] }, { 'background': [] }],
                                                            ['clean']
                                                        ],
                                                    }}
                                                />
                                            </FormControl>
                                            {errors.description && <FormMessage className="text-red-500">{errors.description.message}</FormMessage>}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="message_end"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message de fin</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    value={field.value == '' ? currentPost.message_end : field.value} // Utilisez `field.value` ou `currentPost.message_end`
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setCurrentPost({ ...currentPost, message_end: e.target.value });
                                                    }}
                                                    className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="question_text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Question *</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    placeholder="Question"
                                                    {...field}
                                                    value={newQuestion.question_text}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        handleNewQuestionChange('question_text', e.target.value);
                                                    }}
                                                    className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
                                                    rows={4} // Définir le nombre de lignes du textarea
                                                />
                                            </FormControl>
                                            {errors.question_text && <FormMessage className="text-red-500">{errors.question_text.message}</FormMessage>}
                                        </FormItem>
                                    )}
                                />
                                <div className="flex space-x-2">
                                    <FormField
                                        control={control}
                                        name="preparation_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Temps maximum accordé au candidat pour lire cette question.</FormLabel>
                                                <FormControl>
                                                    <select
                                                        className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
                                                        {...field}
                                                        value={newQuestion.preparation_time}
                                                        onChange={(e) => handleNewQuestionChange('preparation_time', e.target.value)}
                                                    >
                                                        <option value="0">0 sec</option>
                                                        <option value="10">10 sec</option>
                                                        <option value="20">20 sec</option>
                                                        <option value="30">30 sec</option>
                                                        <option value="45">45 sec</option>
                                                        <option value="60">1 min</option>
                                                        <option value="90">1 min 30 sec</option>
                                                        <option value="120">2 min</option>
                                                        <option value="150">2 min 30 sec</option>
                                                        <option value="180">3 min</option>
                                                        <option value="240">4 min</option>
                                                        <option value="300">5 min</option>
                                                    </select>
                                                </FormControl>
                                                {errors.preparation_time && <FormMessage className="text-red-500">{errors.preparation_time.message}</FormMessage>}
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name="response_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Temps maximum accordé au candidat pour répondre à cette question.</FormLabel>
                                                <FormControl>
                                                    <select
                                                        className="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
                                                        {...field}
                                                        value={newQuestion.response_time}
                                                        onChange={(e) => handleNewQuestionChange('response_time', e.target.value)}
                                                    >
                                                        <option value="30">30 sec</option>
                                                        <option value="60">1 min</option>
                                                        <option value="90">1 min 30 sec</option>
                                                        <option value="120">2 min</option>
                                                        <option value="150">2 min 30 sec</option>
                                                        <option value="180">3 min</option>
                                                        <option value="210">3 min 30 sec</option>
                                                        <option value="240">4 min</option>
                                                        <option value="270">4 min 30 sec</option>
                                                        <option value="300">5 min</option>
                                                        <option value="330">5 min 30 sec</option>
                                                        <option value="360">6 min</option>
                                                        <option value="390">6 min 30 sec</option>
                                                        <option value="420">7 min</option>
                                                        <option value="450">7 min 30 sec</option>
                                                        <option value="480">8 min</option>
                                                        <option value="510">8 min 30 sec</option>
                                                        <option value="540">9 min</option>
                                                        <option value="570">9 min 30 sec</option>
                                                    </select>
                                                </FormControl>
                                                {errors.response_time && <FormMessage className="text-red-500">{errors.response_time.message}</FormMessage>}
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex justify-center">
                                    {editingIndex !== null ? (
                                        <Button
                                            type="button" // Remplacer type="submit" par type="button"
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md m-2"
                                            onClick={saveQuestion} // Utiliser directement la fonction saveQuestion
                                        >
                                            Modifier
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md m-2"
                                            disabled={!isNewQuestionFieldsFilled()}
                                        >
                                            Ajouter
                                        </Button>
                                    )}
                                </div>

                                {errorMessage && (
                                    <p className="text-red-500 mb-4">{errorMessage}</p>
                                )}
                            </form>
                        </Form>
                    </div>
                    <div className="w-full md:w-1/2 pl-4">
                        <div className="mb-4">
                            <h3 className="font-semibold m-2">Configuration de votre entretien vidéo</h3>
                            <div className="overflow-y-auto max-h-96">
                                {post.questions.length > 0 && post.questions.map((question, index) => {
                                    const questionDuration = parseInt(question.preparation_time, 10) + parseInt(question.response_time, 10);
                                    const questionMinutes = Math.floor(questionDuration / 60);
                                    const questionSeconds = questionDuration % 60;
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-gray-100 mb-2 rounded"
                                        >
                                            <div className="flex items-center">
                                                <h4 className="mr-4">{question.question_text}</h4>
                                            </div>
                                            <div className="flex items-center">
                                                <p className="text-sm mr-4">
                                                    {questionMinutes} min {questionSeconds} sec
                                                </p>
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
                                    );
                                })}
                            </div>
                            <div className="flex flex-col items-center mb-4">
                                <p className="m-2 text-sm">
                                    Durée totale :{' '}
                                    <span className="text-blue-500">{totalMinutes}</span> min{' '}
                                    <span className="text-blue-500">{totalSeconds}</span> sec / 15 minutes
                                </p>
                                <Button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                    onClick={post.id ? handleEdit : handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'En cours...' : post.id ? 'Valider Poste Entretien Video' : 'Valider Mon Entretien Vidéo Différé'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PostModal;
