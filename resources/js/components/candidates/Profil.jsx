import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { axiosClient } from "../../api/axios";
import ProfilForm from "./ProfilForm";
import ProfilModal from "./ProfilModal";

// Validation schema
const formSchema = z.object({
  gender: z.string().nonempty("Veuillez sélectionner la civilité").refine((val) => ["Mr", "Mme"].includes(val), {
    message: "Veuillez sélectionner la civilité"
  }),
  first_name: z.string().nonempty("Prénom requis"),
  last_name: z.string().nonempty("Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().regex(/^(\+33|0)(6|7)\d{8}$/, "Numéro de téléphone invalide. Utilisez un format 06 ou 07 avec 10 chiffres"),
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
  const [serverErrors, setServerErrors] = useState({});

  const form = useForm({
    resolver: zodResolver(formSchema)
  });

  const { setValue, handleSubmit } = form;

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
          setValue("post_title", response.data.title); // Ajouter cette ligne pour définir la valeur du titre
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du poste:", error);
      }
    };

    fetchPost();
  }, [postRef, setValue]);

  const onSubmit = async (data) => {
    setServerErrors({});
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
      if (error.response && error.response.status === 422) {
        setServerErrors(error.response.data.errors);
      } else {
        console.error("Erreur lors de la soumission des données du candidat:", error);
      }
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
      <FormProvider {...form}>
        <ProfilForm post={post} theme={theme} onSubmit={onSubmit} serverErrors={serverErrors} />
      </FormProvider>
      <ProfilModal isOpen={isModalOpen} post={post} startRecording={startRecording} closeModal={() => setIsModalOpen(false)} />
    </div>
  );
}
