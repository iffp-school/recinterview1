import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import SideBar from '../SideBar';
import NavBar from '../NavBar';
import { axiosClient } from '../../../api/axios';
import PostTable from './PostTable';
import PostModal from './PostModal';
import DetailsModal from './DetailsModal';
import ConfirmationModal from '../common/ConfirmationModal';
import PostSearchBar from './PostSearchBar';
import Pagination from '../common/Pagination';
import LinkModal from './LinkModal';
import NewPost from './NewPost';

export default function Posts({ theme, toggleTheme }) {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState({ title: '', description: '', questions: [{ question_text: '', preparation_time: '', response_time: '' }] });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkToSend, setLinkToSend] = useState('');
    const [isLinkCopied, setIsLinkCopied] = useState(false);
    const navigate = useNavigate();

    const fetchPosts = (page, term = '', sortBy = '', sortDirection = 'asc') => {
        axiosClient.get('/posts', {
            params: {
                page,
                limit: 10,
                search: term,
                sort_by: sortBy,
                sort_direction: sortDirection
            }
        })
            .then(response => {
                setPosts(response.data.posts);
                setTotalPages(Math.ceil(response.data.total / 10));
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des posts : ', error);
            });
    };

    useEffect(() => {
        fetchPosts(currentPage, searchTerm, sortBy, sortDirection);
    }, [currentPage, searchTerm, sortBy, sortDirection]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const handleSort = (column) => {
        const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortDirection(newSortDirection);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        const postData = {
            title: currentPost.title,
            description: currentPost.description,
            questions: currentPost.questions,
            recruiter_id: 1
        };

        axiosClient.post('/posts', postData)
            .then(response => {
                fetchPosts(currentPage, searchTerm, sortBy, sortDirection);
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
            recruiter_id: 1
        };

        axiosClient.put(`/posts/${currentPost.id}`, postData)
            .then(response => {
                fetchPosts(currentPage, searchTerm, sortBy, sortDirection);
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
                fetchPosts(currentPage, searchTerm, sortBy, sortDirection);
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

    const handleSendLink = (randomString) => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
        const link = `${baseUrl}/profil/${randomString}`;
        setLinkToSend(link);
        setIsLinkModalOpen(true);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(linkToSend);
        setIsLinkCopied(true);
        setTimeout(() => setIsLinkCopied(false), 2000);
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
        <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col md:flex-row h-screen transition-colors duration-300`}>
            <SideBar theme={theme} />
            <div className="w-full">
                <NavBar theme={theme} toggleTheme={toggleTheme} />
                <Routes>
                    <Route path="/" element={
                        <div className="p-4">
                            <PostSearchBar
                                searchTerm={searchTerm}
                                handleSearch={handleSearch}
                                onAddClick={() => navigate('/recruiter/new-post')}
                            />
                            <PostTable
                                posts={posts}
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                                setCurrentPost={setCurrentPost}
                                setIsModalOpen={setIsModalOpen}
                                setPostIdToDelete={setPostIdToDelete}
                                setShowConfirmationModal={setShowConfirmationModal}
                                handleDetails={handleDetails}
                                handleSendLink={handleSendLink}
                            />
                            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                        </div>
                    } />
                    <Route path="/add-post-info" element={<NewPost theme={theme} toggleTheme={toggleTheme} />} />
                </Routes>
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
            <ConfirmationModal
                isOpen={showConfirmationModal}
                onRequestClose={() => setShowConfirmationModal(false)}
                confirmAction={handleDelete}
                message="Êtes-vous sûr de vouloir supprimer ce post ?"
            />
            <DetailsModal
                showDetailsModal={showDetailsModal}
                handleCloseDetailsModal={handleCloseDetailsModal}
                currentPost={currentPost}
            />
            <LinkModal
                isLinkModalOpen={isLinkModalOpen}
                setIsLinkModalOpen={setIsLinkModalOpen}
                linkToSend={linkToSend}
                handleCopyLink={handleCopyLink}
                isLinkCopied={isLinkCopied}
            />
        </div>
    );
}
