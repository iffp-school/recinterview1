import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { axiosClient } from '../../api/axios';

const EmailModal = ({ isOpen, onClose, recipientEmail, initialPassword }) => {
    // Contenu par défaut
    const defaultSubject = 'Votre accès à l\'application RecInterview';
    const defaultMessage = `
        <p>Bonjour,</p>
        <p>
        Nous sommes heureux de vous accueillir en tant que recruteur sur l'application RecInterview. Voici vos informations de connexion initiales :
        </p>
        <ul>
            <li><strong>Email</strong> : ${recipientEmail}</li>
            <li><strong>Mot de passe</strong> : 12345678</li>
        </ul>
        <p>
            Veuillez utiliser le lien ci-dessous pour vous connecter à l'application et commencer à gérer vos recrutements :
        </p>
        <p>
            <a href="https://recvue.hellow.fr/login" style="color: blue; text-decoration: underline;">
                Cliquer ici pour se connecter à RecInterview
            </a>
        </p>
        <p> 
            Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe dès que possible après la connexion.
        </p>
        <p>Merci et à bientôt !</p>
        <p>Cordialement,</p>
        <p><strong>L'équipe RecInterview</strong></p>
    `;

    const [emailData, setEmailData] = useState({
        email: recipientEmail || '',
        subject: defaultSubject,
        message: defaultMessage,
    });

    useEffect(() => {
        setEmailData((prev) => ({
            ...prev,
            email: recipientEmail || '',
        }));
    }, [recipientEmail]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleQuillChange = (value) => {
        setEmailData((prev) => ({
            ...prev,
            message: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post('/users/send-recruiter-email', emailData);
            onClose(); // Ferme la modal après envoi
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email', error);
        }
    };

    if (!isOpen) return null; // Ne rien afficher si la modal est fermée

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Envoyer un Email au Recruteur</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={emailData.email}
                            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Sujet</label>
                        <input
                            type="text"
                            name="subject"
                            value={emailData.subject}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Message</label>
                        <ReactQuill
                            theme="snow"
                            value={emailData.message}
                            onChange={handleQuillChange}
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
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Envoyer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmailModal;
