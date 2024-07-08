import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../utils/form.jsx";
import { Input } from "../utils/input.jsx";
import { Button } from "../utils/button.jsx";
import { useNavigate } from "react-router-dom";
import { redirectToDashboard } from "../../router/index.jsx";
import { Loader } from "lucide-react";
import { axiosClient } from "../../api/axios.js";
import { useState } from "react";

// Schéma de validation pour le formulaire
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).min(2, { message: "Email must be at least 2 characters long" }).max(30, { message: "Email must be at most 30 characters long" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(30, { message: "Password must be at most 30 characters long" })
});

// Composant principal de la page de connexion
export default function Login() {
  const navigate = useNavigate(); // Hook de navigation
  const [errorMessage, setErrorMessage] = useState('');

  // Initialisation du formulaire avec le résolveur Zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { setError, formState: { errors, isSubmitting } } = form;

  // Gestionnaire de soumission du formulaire
  const onSubmit = async values => {
    try {
      const response = await axiosClient.post('/login', values);
      localStorage.setItem('token', response.data.token);
      navigate(redirectToDashboard('recruiter'));
    } catch (error) {
      setErrorMessage('Invalid Credentials');
      setError('email', { type: 'manual', message: 'Invalid Credentials' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl text-white font-bold text-center mb-6">Connexion</h2>
          
          {/* Affichage des erreurs globales */}
          {errorMessage && !errors.password && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">
              {errorMessage}
            </div>
          )}

          {/* Champ email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Champ mot de passe */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                {errors.password && (
                  <FormMessage className="text-red-500">
                    {errors.password.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          {/* Bouton de soumission du formulaire */}
          <Button className="bg-blue-500 mt-4 w-full" disabled={isSubmitting} type="submit">
            {isSubmitting && <Loader className="mx-2 my-2 animate-spin" />} {' '} Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
