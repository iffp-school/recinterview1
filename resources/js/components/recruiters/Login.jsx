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
import { FaSun, FaMoon } from "react-icons/fa";

// Schéma de validation pour le formulaire
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).min(2, { message: "Email must be at least 2 characters long" }).max(30, { message: "Email must be at most 30 characters long" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(30, { message: "Password must be at most 30 characters long" })
});

// Composant principal de la page de connexion
export default function Login() {
  const navigate = useNavigate(); // Hook de navigation
  const [theme, setTheme] = useState('light'); // Ajout de l'état du thème
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen flex items-center justify-center transition-colors duration-300 px-4`}>
      <div className="absolute top-4 right-4">
        <button onClick={toggleTheme} className="text-lg font-semibold">
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full max-w-md p-8 rounded-lg shadow-md transition-colors duration-300`}>
          <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>
          
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
                <FormLabel className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} p-2 rounded-lg`} {...field} />
                </FormControl>
                {errors.email && (
                  <FormMessage className="text-red-500">
                    {errors.email.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          {/* Champ mot de passe */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} p-2 rounded-lg`} {...field} />
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
          <div className="flex justify-center mt-4">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow" disabled={isSubmitting} type="submit">
              {isSubmitting && <Loader className="mx-2 my-2 animate-spin" />} {' '} Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
