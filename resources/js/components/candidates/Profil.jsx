import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosClient } from '../../api/axios';
import Modal from 'react-modal';
import { FaCamera, FaMicrophone, FaClock } from 'react-icons/fa';
import { BsQuestionCircle } from 'react-icons/bs';
import { SiGooglechrome, SiFirefoxbrowser } from 'react-icons/si';

const formSchema = z.object({
    gender: z.enum(['Mr', 'Mme'], "Veuillez sélectionner une civilité"),
    first_name: z.string().nonempty("Prénom requis"),
    last_name: z.string().nonempty("Nom requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().nullable(),
    cv: z.instanceof(FileList).refine(files => files.length > 0, "CV requis"),
    post_id: z.string()
});

function Profil() {
    const navigate = useNavigate();
    const { postRef } = useParams();
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
                const response = await axiosClient.get(`/posts/random/${postRef}`);
                if (response.data) {
                    setPost(response.data);
                    setValue('post_id', String(response.data.id));
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du poste:", error);
            }
        };

        fetchPost();
    }, [postRef, setValue]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'cv') {
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
                        <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400" id="gender" {...register("gender")}>
                            <option value="">Sélectionner Civilité</option>
                            <option value="Mr">Mr</option>
                            <option value="Mme">Mme</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                    </div>
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
                <div className="bg-white rounded-lg p-8 shadow-lg max-w-4xl w-full transform transition-transform duration-300 ease-in-out translate-y-0">
                    <h2 className="text-2xl font-bold mb-4 text-center">Votre entretien vidéo différé</h2>
                    <p className="text-center mb-8">{post ? post.title : 'Post titre H/F'}</p>
                    <div className="flex flex-wrap justify-around mb-4 text-blue-500">
                        <div className="text-center m-2">
                            <FaCamera className="text-3xl mb-2" />
                            <p>1 webcam</p>
                        </div>
                        <div className="text-center m-2">
                            <FaMicrophone className="text-3xl mb-2" />
                            <p>1 microphone</p>
                        </div>
                        <div className="text-center m-2">
                            <div className="flex justify-center items-center space-x-2">
                                <SiGooglechrome className="text-3xl mb-2" />
                                <SiFirefoxbrowser className="text-3xl mb-2" />
                            </div>
                            <p>Chrome ou Firefox</p>
                        </div>
                    </div>
                    <p className="mb-4 text-gray-700 text-center">
                        Attention, pour enregistrer votre entretien vidéo différé, votre ordinateur doit être équipé de :
                    </p>
                    <ol className="list-decimal list-inside mb-4 text-left text-gray-700 mx-8">
                        <li className="mb-2">Une première question fictive va vous être posée afin de vous présenter les conditions d'enregistrement.</li>
                        <li className="mb-2">Chaque question de l'entretien vidéo différé va vous être présentée pendant quelques instants. Sans action de votre part, l'enregistrement démarrera automatiquement après ce laps de temps.</li>
                        <li className="mb-2">Vous avez la possibilité de relancer l'enregistrement jusqu'à 3 fois par question.</li>
                    </ol>
                    <div className="flex justify-center items-center mb-8 text-red-500">
                        <div className="flex items-center mr-8">
                            <BsQuestionCircle className="text-3xl" />
                            <span className="ml-2 text-lg">Question</span>
                        </div>
                        <div className="flex items-center">
                            <FaClock className="text-3xl" />
                            <span className="ml-2 text-lg">3 mn</span>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={startRecording}
                        >
                            Testez-vous !
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Profil;
