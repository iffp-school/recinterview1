<?php

// Déclaration de l'espace de noms pour organiser le code de manière logique dans l'application
namespace App\Http\Controllers;

use App\Models\Candidate; // Modèle pour représenter un candidat dans la base de données
use Illuminate\Http\Request; // Classe pour gérer les requêtes HTTP
use Illuminate\Support\Facades\Validator; // Classe pour valider les données de requête
use App\Models\Question; // Modèle pour représenter une question dans la base de données

// Déclaration du contrôleur pour gérer les actions relatives aux candidats
class CandidateController extends Controller
{
    // Méthode pour lister les candidats avec options de recherche, tri et pagination
    public function index(Request $request)
    {
        // Création de la requête de base pour récupérer les candidats avec leurs postes et réponses
        $query = Candidate::with(['post.questions', 'responses']);

        // Si un paramètre de recherche est fourni dans la requête, on filtre les candidats
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                // On cherche parmi le prénom, nom, email, et titre du poste associé
                $q->where('first_name', 'like', '%' . $search . '%')
                    ->orWhere('last_name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%')
                    ->orWhereHas('post', function ($q) use ($search) {
                        // Filtrage par titre de poste si le candidat est associé à un poste
                        $q->where('title', 'like', '%' . $search . '%');
                    });
            });
        }

        // Si les paramètres de tri sont fournis, on trie les candidats
        if ($request->has('sort_by') && $request->has('sort_direction') && !empty($request->sort_by) && !empty($request->sort_direction)) {
            $sortBy = $request->sort_by;
            $sortDirection = $request->sort_direction;
            $sortableColumns = ['first_name', 'last_name', 'email', 'phone', 'created_at', 'rating', 'post.title'];

            // Si le tri est basé sur le titre du poste, on rejoint la table 'posts' pour accéder à la colonne 'title'
            if ($sortBy === 'post') {
                $query->join('posts', 'candidates.post_id', '=', 'posts.id')
                    ->orderBy('posts.title', $sortDirection)
                    ->select('candidates.*'); // Sélectionne tous les champs de 'candidates' après la jointure
            } elseif (in_array($sortBy, $sortableColumns)) {
                // Tri par une colonne directement disponible
                $query->orderBy($sortBy, $sortDirection);
            } else {
                // Si la colonne de tri n'est pas valide, renvoie une erreur
                return response()->json(['error' => 'Invalid sort column'], 400);
            }
        }

        // Pagination des résultats de la requête avec 10 candidats par page
        $candidatesWithDetails = $query->paginate(10);

        // Pour chaque candidat, s'il a un CV enregistré, on génère l'URL complète de son CV
        foreach ($candidatesWithDetails->items() as $candidate) {
            if ($candidate->cv) {
                $candidate->cv_url = url('storage/' . $candidate->cv);
            }
        }

        // Renvoie la liste des candidats et le total de candidats
        return response()->json([
            'candidates' => $candidatesWithDetails->items(),
            'total' => $candidatesWithDetails->total()
        ], 200);
    }

    // Méthode pour ajouter un nouveau candidat avec validation des données et stockage du CV
    public function store(Request $request)
    {
        // Valide les données fournies dans la requête
        $validatedData = $request->validate([
            'gender' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:candidates,email', // Email doit être unique pour chaque candidat
            'phone' => 'nullable|string',
            'cv' => 'required|file|mimes:pdf|max:2048', // CV requis, doit être un fichier PDF de 2 Mo max
            'post_id' => 'required|exists:posts,id', // Vérifie que le poste existe
        ]);

        // Stocke le CV dans le dossier 'public/cvs'
        $filePath = $request->file('cv')->store('cvs', 'public');

        // Crée une nouvelle instance de candidat avec les données validées
        $candidate = new Candidate([
            'gender' => $validatedData['gender'],
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
            'phone' => $validatedData['phone'],
            'cv' => $filePath,
            'post_id' => $validatedData['post_id'],
        ]);

        // Sauvegarde le candidat dans la base de données
        $candidate->save();

        // Retourne le candidat nouvellement créé avec un statut 201 (créé)
        return response()->json($candidate, 201);
    }

    // Méthode pour récupérer les informations détaillées d'un candidat spécifique
    public function show($id)
    {
        // Récupère le candidat avec son poste associé et ses réponses
        $candidate = Candidate::with(['post', 'responses'])->find($id);

        // Si le candidat n'est pas trouvé, retourne une erreur 404
        if (!$candidate) {
            return response()->json(['message' => 'Candidat non trouvé'], 404);
        }

        // Récupère les questions associées au poste du candidat
        $questions = Question::where('post_id', $candidate->post_id)->get();

        // Associe chaque réponse du candidat avec la question correspondante
        $candidate->responses->transform(function ($response, $index) use ($questions) {
            $response->question = $questions[$index]->question_text ?? 'Question non trouvée';
            return $response;
        });

        // Retourne les informations complètes du candidat
        return response()->json($candidate);
    }

    // Méthode pour mettre à jour les informations d'un candidat
    public function update(Request $request, $id)
    {
        // Validation des données mises à jour
        $validator = Validator::make($request->all(), [
            'first_name' => 'string',
            'last_name' => 'string',
            'email' => 'email|unique:candidates,email,' . $id, // Email doit être unique, sauf pour le candidat actuel
            'phone' => 'nullable|string',
            'post_id' => 'exists:posts,id' // Vérifie que le poste existe
        ]);

        // Si la validation échoue, retourne les erreurs de validation
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Récupère le candidat et applique les mises à jour
        $candidate = Candidate::findOrFail($id);
        $candidate->update($request->all());

        // Retourne les informations du candidat mis à jour avec un statut 200 (OK)
        return response()->json($candidate, 200);
    }

    // Méthode pour supprimer un candidat de la base de données
    public function destroy($id)
    {
        $candidate = Candidate::findOrFail($id); // Récupère le candidat ou échoue si introuvable
        $candidate->delete(); // Supprime le candidat

        // Retourne une réponse vide avec un statut 204 (pas de contenu)
        return response()->json(null, 204);
    }

    // Méthode pour récupérer un candidat par son email
    public function getCandidateByEmail($email)
    {
        // Récupère le premier candidat correspondant à l'email fourni
        $candidate = Candidate::where('email', $email)->first();
        if ($candidate) {
            return response()->json($candidate, 200);
        } else {
            return response()->json(['message' => 'No candidate found for this email'], 404);
        }
    }

    // Méthode pour mettre à jour la note d'un candidat
    public function updateRating(Request $request, $id)
    {
        // Validation de la note
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:0|max:5', // Note entre 0 et 5
        ]);

        // Si la validation échoue, retourne les erreurs
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Récupère le candidat, met à jour sa note et sauvegarde
        $candidate = Candidate::findOrFail($id);
        $candidate->rating = $request->input('rating');
        $candidate->save();

        // Retourne les informations du candidat avec la note mise à jour
        return response()->json($candidate, 200);
    }
}
