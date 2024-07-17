import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { FaSun, FaMoon, FaCamera, FaMicrophone, FaClock } from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";
import { SiGooglechrome, SiFirefoxbrowser } from "react-icons/si";
import Modal from "react-modal";
import { axiosClient } from "../../api/axios";
import { Loader } from "lucide-react"; // Ensure this import is correct

// Validation schema
const formSchema = z.object({
  gender: z.enum(["Mr", "Mme"], "Veuillez sélectionner une civilité"),
  first_name: z.string().nonempty("Prénom requis"),
  last_name: z.string().nonempty("Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().nullable(),
  cv: z.instanceof(FileList).refine((files) => files.length > 0, "CV requis"),
  post_id: z.string()
});

export default function Profil() {
  const navigate = useNavigate();
  const { postRef } = useParams();
  const [theme, setTheme] = useState("light");
  const [post, setPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const form = useForm({
    resolver: zodResolver(formSchema)
  });

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = form;

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosClient.get(`/posts/random/${postRef}`);
        if (response.data) {
          setPost(response.data);
          setValue("post_id", String(response.data.id));
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
      Object.keys(data).forEach((key) => {
        if (key === "cv") {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      await axiosClient.post("/candidates", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setModalData(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erreur lors de la soumission des données du candidat:", error.response.data);
    }
  };

  const startRecording = () => {
    setIsModalOpen(false);
    navigate("/enregistrement", { state: { email: modalData.email, selectedPostId: modalData.post_id } });
  };

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen flex items-center justify-center transition-colors duration-300 px-4`}>
      <div className="absolute top-4 right-4">
        <button onClick={toggleTheme} className="text-lg font-semibold">
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} w-full max-w-md p-8 rounded-lg shadow-md transition-colors duration-300`}>
        <h2 className="text-2xl font-bold text-center mb-6">Renseignez votre profil</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="gender" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>Civilité</label>
            <select
              id="gender"
              {...register("gender")}
              className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`}
            >
              <option value="">Sélectionner Civilité</option>
              <option value="Mr">Mr</option>
              <option value="Mme">Mme</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="first_name" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>Prénom</label>
            <input
              id="first_name"
              type="text"
              {...register("first_name")}
              className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`}
            />
            {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>Nom</label>
            <input
              id="last_name"
              type="text"
              {...register("last_name")}
              className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`}
            />
            {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>Email</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>Numéro de téléphone</label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="cv" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>CV</label>
            <input
              id="cv"
              type="file"
              accept=".pdf"
              {...register("cv")}
              className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`}
            />
            {errors.cv && <p className="text-red-500 text-sm">{errors.cv.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="post_title" className={`${theme === "dark" ? "text-white" : "text-gray-900"} block mb-2`}>Titre du poste</label>
            <input
              id="post_title"
              type="text"
              value={post ? post.title : ''}
              disabled
              className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} p-2 rounded-lg w-full`}
            />
            <input type="hidden" {...register("post_id")} />
            {errors.post_id && <p className="text-red-500 text-sm">{errors.post_id.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={isSubmitting}
          >
            Enregistrer
            {isSubmitting && <Loader className="mx-2 my-2 animate-spin" />}
          </button>
        </form>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        contentLabel="Demarrage Entretien"
        closeTimeoutMS={300}
        ariaHideApp={false}
      >
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-4xl w-full transform transition-transform duration-300 ease-in-out translate-y-0">
          <h2 className="text-2xl font-bold mb-4 text-center">Votre entretien vidéo différé</h2>
          <p className="text-center mb-8">{post ? post.title : "Post titre H/F"}</p>
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
