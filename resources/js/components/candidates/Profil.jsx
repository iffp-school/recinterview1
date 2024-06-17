import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from 'react-redux';
import { setPosts, selectPost } from '../../redux/slices/postSlice';

const formSchema = z.object({
    first_name: z.string().nonempty("Prénom requis"),
    last_name: z.string().nonempty("Nom requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().nullable(),
    post_id: z.string().nonempty("Veuillez sélectionner un poste"),
});

function Profil() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema)
    });

    const posts = [
        {
            "id": 22,
            "recruiter_id": 1,
            "title": "Développeur Full Stack",
            "description": "Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe dynamique. Le candidat idéal possède des compétences dans les technologies front-end et back-end, ainsi qu'une solide expérience en développement web.",
            "created_at": "2024-06-10T05:55:37.000000Z",
            "updated_at": "2024-06-10T05:55:37.000000Z",
            "questions": [
                {
                    "id": 30,
                    "post_id": 22,
                    "question_text": "Quelle est votre expérience en développement web ?",
                    "created_at": "2024-06-10T03:55:37.000000Z",
                    "updated_at": "2024-06-10T03:55:37.000000Z"
                },
                {
                    "id": 31,
                    "post_id": 22,
                    "question_text": "Pouvez-vous citer quelques projets web auxquels vous avez contribué ?",
                    "created_at": "2024-06-10T03:55:37.000000Z",
                    "updated_at": "2024-06-10T03:55:37.000000Z"
                },
                {
                    "id": 32,
                    "post_id": 22,
                    "question_text": "Quels sont les langages de programmation que vous maîtrisez pour le développement back-end ?",
                    "created_at": "2024-06-10T03:55:37.000000Z",
                    "updated_at": "2024-06-10T03:55:37.000000Z"
                }
            ]
        },
        {
            "id": 23,
            "recruiter_id": 2,
            "title": "Chef de Projet IT",
            "description": "Nous recherchons un chef de projet IT expérimenté pour gérer et coordonner nos projets informatiques. Le candidat idéal aura une solide expérience en gestion de projet et une connaissance approfondie des technologies informatiques.",
            "created_at": "2024-06-12T08:20:37.000000Z",
            "updated_at": "2024-06-12T08:20:37.000000Z",
            "questions": [
                {
                    "id": 33,
                    "post_id": 23,
                    "question_text": "Quelle est votre expérience en gestion de projet IT ?",
                    "created_at": "2024-06-12T03:20:37.000000Z",
                    "updated_at": "2024-06-12T03:20:37.000000Z"
                },
                {
                    "id": 34,
                    "post_id": 23,
                    "question_text": "Pouvez-vous décrire un projet IT que vous avez géré de bout en bout ?",
                    "created_at": "2024-06-12T03:20:37.000000Z",
                    "updated_at": "2024-06-12T03:20:37.000000Z"
                },
                {
                    "id": 35,
                    "post_id": 23,
                    "question_text": "Quels outils de gestion de projet utilisez-vous ?",
                    "created_at": "2024-06-12T03:20:37.000000Z",
                    "updated_at": "2024-06-12T03:20:37.000000Z"
                }
            ]
        },
        {
            "id": 24,
            "recruiter_id": 3,
            "title": "Analyste Sécurité",
            "description": "Nous cherchons un analyste en sécurité informatique pour rejoindre notre équipe. Le candidat idéal aura une expertise en sécurité des systèmes d'information et une expérience pratique en matière de cybersécurité.",
            "created_at": "2024-06-15T10:15:37.000000Z",
            "updated_at": "2024-06-15T10:15:37.000000Z",
            "questions": [
                {
                    "id": 36,
                    "post_id": 24,
                    "question_text": "Quelle est votre expérience en matière de cybersécurité ?",
                    "created_at": "2024-06-15T04:15:37.000000Z",
                    "updated_at": "2024-06-15T04:15:37.000000Z"
                },
                {
                    "id": 37,
                    "post_id": 24,
                    "question_text": "Pouvez-vous décrire une attaque de sécurité que vous avez aidé à prévenir ou à résoudre ?",
                    "created_at": "2024-06-15T04:15:37.000000Z",
                    "updated_at": "2024-06-15T04:15:37.000000Z"
                },
                {
                    "id": 38,
                    "post_id": 24,
                    "question_text": "Quels outils et technologies de sécurité utilisez-vous ?",
                    "created_at": "2024-06-15T04:15:37.000000Z",
                    "updated_at": "2024-06-15T04:15:37.000000Z"
                }
            ]
        }
    ];

    React.useEffect(() => {
        dispatch(setPosts(posts));
    }, [dispatch]);

    const onSubmit = (data) => {
        dispatch(selectPost(data.post_id));
        navigate('/demarrage-entretien');
    };

    return (
        <div className="bg-gray-800 min-h-screen flex justify-center items-center">
            <div className="container mx-auto text-center mt-4 max-w-md">
                <h2 className="text-2xl text-white font-bold mb-4">Renseignez votre profil</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                        <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400" id="post_id" {...register("post_id")}>
                            <option value="">Sélectionnez un poste</option>
                            {posts.map((post) => (
                                <option key={post.id} value={post.id}>{post.title}</option>
                            ))}
                        </select>
                        {errors.post_id && <p className="text-red-500 text-sm">{errors.post_id.message}</p>}
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Enregistrer
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profil;
