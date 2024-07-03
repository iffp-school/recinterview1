import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom'; // Importer useParams
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from 'react-redux';
import { setPosts } from '../../redux/slices/postSlice';
import { axiosClient } from '../../api/axios';
import Modal from 'react-modal';

const formSchema = z.object({
    first_name: z.string().nonempty("Prénom requis"),
    last_name: z.string().nonempty("Nom requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().nullable(),
    post_id: z.string().nonempty("Veuillez sélectionner un poste"),
    cv: z.any().optional()
});

function Profil() {
    const navigate = useNavigate();
    const { postId } = useParams(); // Utiliser useParams pour récupérer l'ID du poste
    const dispatch = useDispatch();
    const [post, setPost] = useState(null);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(formSchema)
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({});

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axiosClient.get(`/posts/${postId}`);
                if (response.data) {
                    setPost(response.data);
                    setValue('post_id', String(response.data.id)); // Définir la valeur de post_id
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du poste:", error);
            }
        };

        fetchPost();
    }, [postId, setValue]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'cv' && data[key][0]) {
                    formData.append(key, data[key][0]);
                } else {
                    formData.append(key, data[key]);
                }
            });

            await axiosClient.post('/candidates', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setModalData(data);
            openModal();
        } catch (error) {
            console.error("Erreur lors de la soumission des données du candidat:", error.response.data);
        }
    };

    const startRecording = () => {
        closeModal();
        navigate('/enregistrement', { state: { email: modalData.email, selectedPostId: modalData.post_id } });
    };

    return (
        <div className="bg-gray-800 min-h-screen flex justify-center items-center">
            <div className="container mx-auto text-center mt-4 max-w-md">
                <h2 className="text-2xl text-white font-bold mb-4">Renseignez votre profil</h2>
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <div className="mb-4">
                        <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400" id="first_name" placeholder="Prénom" {...register("first_name")} />
                        {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
                    </div>
                    <div className="mb-4">
                        <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400" id="last_name" placeholder="Nom" {...register("last_name")} />
                        {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
                    </div>
                    <div className="mb-4">
                        <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400" id="email" placeholder="Email" {...register("email")} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div className="mb-4">
                        <input type="tel" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400" id="phone" placeholder="Numéro de téléphone" {...register("phone")} />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>
                    <div className="mb-4">
                        <input
                            type="file"
                            accept=".pdf"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                            id="cv"
                            {...register("cv")}
                        />
                        {errors.cv && <p className="text-red-500 text-sm">{errors.cv.message}</p>}
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                            id="post_title"
                            placeholder="Titre du poste"
                            value={post ? post.title : ''}
                            disabled
                        />
                        <input type="hidden" {...register("post_id")} />
                        {errors.post_id && <p className="text-red-500 text-sm">{errors.post_id.message}</p>}
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Enregistrer
                    </button>
                </form>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                contentLabel="Demarrage Entretien"
                closeTimeoutMS={300}
                ariaHideApp={false}
            >
                <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full transform transition-transform duration-300 ease-in-out translate-y-0">
                    <h2 className="text-2xl font-bold mb-4">Profil Enregistré</h2>
                    <p className="mb-4 text-gray-700">
                        Votre profil a été enregistré avec succès. Bienvenue dans notre processus d'entretien asynchrone.
                        Prenez votre temps pour enregistrer vos réponses aux questions suivantes. Suivez les instructions fournies pour un enregistrement réussi.
                        Vous trouverez une suite de questions suivie de vos réponses enregistrées. Les questions du recruteur sont présentées sous forme de textes.
                        Après avoir enregistré une réponse, vous aurez la possibilité de la réenregistrer si nécessaire avant de la soumettre.
                    </p>
                    <button
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={startRecording}
                    >
                        Démarrer l'enregistrement
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default Profil;
