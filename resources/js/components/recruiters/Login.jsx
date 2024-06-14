import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../utils/form.jsx";
import { Input } from "../utils/input.jsx";
import { Button } from "../utils/button.jsx";
import { useNavigate } from "react-router-dom";
import { redirectToDashboard } from "../../router/index.jsx";
import { Loader } from "lucide-react";
import axios from "axios";
import { axiosClient } from "../../api/axios.js";

// Schéma de validation pour le formulaire 
const formSchema = z.object({
  email: z.string().email().min(2).max(30), // Champ email avec validation
  password: z.string().min(8).max(30) // Champ mot de passe avec validation
});

// Composant principal de la page de connexion
export default function Login() {
  const navigate = useNavigate(); // Hook de navigation

  // Initialisation du formulaire avec le résolveur Zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'mouad@gmail.com',
      password: '12345678'
    }
  });
  const { setError, formState: { isSubmitting } } = form; // Gestion des erreurs et de l'état de soumission du formulaire

  // Gestionnaire de soumission du formulaire
  const onSubmit = async values => {
    navigate(redirectToDashboard('recruiter'))
  };

  // Rendu du composant de formulaire de connexion
  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl text-white font-bold text-center mb-6">Connexion</h2>
          {/* Champ email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Champ mot de passe */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type={'password'} placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Bouton de soumission du formulaire */}
          <Button className={'bg-blue-500 mt-4 w-full'} disabled={isSubmitting} type="submit">
            {isSubmitting && <Loader className={'mx-2 my-2 animate-spin'} />} {' '} Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
