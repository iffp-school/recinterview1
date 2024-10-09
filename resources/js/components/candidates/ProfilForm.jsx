import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Loader } from 'lucide-react';

export default function ProfilForm({ post, theme, onSubmit, serverErrors }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useFormContext();

    return (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} w-full max-w-md p-8 rounded-lg shadow-md transition-colors duration-300`}>
            <h2 className="text-2xl font-bold text-center mb-6">Renseignez votre profil</h2>
            <div className="mb-4">
                <select id="gender" {...register("gender")} defaultValue="" className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`}>
                    <option value="">Sélectionner Civilité</option>
                    <option value="Mr">Mr</option>
                    <option value="Mme">Mme</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
            </div>
            <div className="mb-4">
                <input id="first_name" type="text" placeholder="Prénom" {...register("first_name")} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`} />
                {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
            </div>
            <div className="mb-4">
                <input id="last_name" type="text" placeholder="Nom" {...register("last_name")} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`} />
                {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
            </div>
            <div className="mb-4">
                <input id="email" type="email" placeholder="Email" {...register("email", {
                    required: "Email requis",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email invalide"
                    }
                })} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                {serverErrors.email && <p className="text-red-500 text-sm">{serverErrors.email}</p>}
            </div>
            <div className="mb-4">
                <div className="flex">
                    <span className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-l-lg`}>+33</span>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="Téléphone 06xxxxxxxx"
                        {...register("phone", {
                            required: "Numéro de téléphone requis",
                            pattern: {
                                value: /^(\+33|0)(6|7)\d{8}$/,
                                message: "Numéro de téléphone invalide. Utilisez un format 06 ou 07 avec 10 chiffres."
                            }
                        })}
                        className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-r-lg w-full`}
                    />
                </div>
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
            <div className="mb-4">
                <input id="cv" type="file" accept=".pdf" {...register("cv")} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`} />
                {errors.cv && <p className="text-red-500 text-sm">{errors.cv.message}</p>}
            </div>
            <div className="mb-4">
                <input id="post_title" type="text" value={post ? post.title : ''} disabled className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`} />
                <input type="hidden" {...register("post_id")} />
                {errors.post_id && <p className="text-red-500 text-sm">{errors.post_id.message}</p>}
            </div>
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center" disabled={isSubmitting}>
                {isSubmitting ? <Loader className="animate-spin" /> : 'Démarrer'}
            </button>
        </form>
    );
}
