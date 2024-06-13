import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const formSchema = z.object({
    first_name: z.string().nonempty(),
    last_name: z.string().nonempty(),
    email: z.string().email(),
    phone: z.string().nullable(),
});

function Profil() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema)
    });

    const onSubmit = (data) => {
        axios.post('http://localhost:8000/api/candidates', data)
            .then(response => {
                navigate('/demarrage-entretien');
            })
            .catch(error => {
                console.error('Erreur lors de l\'enregistrement du profil :', error);
            });
    };

    return (
        <div className="bg-gray-800 min-h-screen flex justify-center items-center"> {/* Centrage vertical et horizontal */}
            <div className="container mx-auto text-center mt-4 max-w-md"> {/* Réduction de la largeur */}
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
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Enregistrer
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profil;
