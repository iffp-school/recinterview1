import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Loader } from 'lucide-react';

export default function ProfilForm({ post, theme, onSubmit }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useFormContext();

    return (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} w-full max-w-md p-8 rounded-lg shadow-md transition-colors duration-300`}>
            <h2 className="text-2xl font-bold text-center mb-6">Renseignez votre profil</h2>
            <div className="mb-4">
                <label htmlFor="gender" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>Civilité</label>
                <select id="gender" {...register("gender")} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`}>
                    <option value="">Sélectionner Civilité</option>
                    <option value="Mr">Mr</option>
                    <option value="Mme">Mme</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="first_name" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>Prénom</label>
                <input id="first_name" type="text" {...register("first_name")} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`} />
                {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="last_name" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>Nom</label>
                <input id="last_name" type="text" {...register("last_name")} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`} />
                {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="email" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>Email</label>
                <input id="email" type="email" {...register("email")} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="phone" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>Numéro de téléphone</label>
                <input id="phone" type="tel" {...register("phone")} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`} />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="cv" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>CV</label>
                <input id="cv" type="file" accept=".pdf" {...register("cv")} className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`} />
                {errors.cv && <p className="text-red-500 text-sm">{errors.cv.message}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="post_title" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>Titre du poste</label>
                <input id="post_title" type="text" value={post ? post.title : ''} disabled className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`} />
                <input type="hidden" {...register("post_id")} />
                {errors.post_id && <p className="text-red-500 text-sm">{errors.post_id.message}</p>}
            </div>
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={isSubmitting}>
                Enregistrer
                {isSubmitting && <Loader className="mx-2 my-2 animate-spin" />}
            </button>
        </form>
    );
}
