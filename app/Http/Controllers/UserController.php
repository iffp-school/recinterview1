<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Recruiter;

class UserController extends Controller
{

    public function index(Request $request)
    {
        $searchTerm = $request->input('search');
        $sortBy = $request->input('sort_by', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');

        // Liste des colonnes autorisées pour le tri
        $allowedSortByColumns = ['name', 'email', 'role', 'totalCandidates', 'totalPosts'];
        $allowedSortDirections = ['asc', 'desc'];

        // Validation du paramètre sort_by
        if (!in_array($sortBy, $allowedSortByColumns)) {
            $sortBy = 'name'; // Par défaut, tri par nom si la colonne n'est pas valide
        }

        // Validation du paramètre sort_direction
        if (!in_array($sortDirection, $allowedSortDirections)) {
            $sortDirection = 'asc'; // Par défaut, tri ascendant si la direction n'est pas valide
        }

        // Construire la requête de base pour les utilisateurs
        $users = User::when($searchTerm, function ($query, $searchTerm) {
            return $query->where('name', 'like', "%{$searchTerm}%")
                ->orWhere('email', 'like', "%{$searchTerm}%");
        })
            ->with(['recruiter' => function ($query) {
                $query->withCount(['candidates', 'posts']);
            }]);

        // Appliquer le tri basé sur la colonne demandée
        if ($sortBy === 'role') {
            $users->orderBy('role', $sortDirection);
        } elseif ($sortBy === 'totalCandidates') {
            $users->leftJoin('recruiters', 'users.id', '=', 'recruiters.user_id')
                ->leftJoin('candidates', 'candidates.post_id', '=', 'recruiters.id')
                ->selectRaw('users.*, COUNT(candidates.id) as total_candidates')
                ->groupBy('users.id')
                ->orderBy('total_candidates', $sortDirection);
        } elseif ($sortBy === 'totalPosts') {
            $users->leftJoin('recruiters', 'users.id', '=', 'recruiters.user_id')
                ->leftJoin('posts', 'posts.recruiter_id', '=', 'recruiters.id')
                ->selectRaw('users.*, COUNT(posts.id) as total_posts')
                ->groupBy('users.id')
                ->orderBy('total_posts', $sortDirection);
        } else {
            $users->orderBy($sortBy, $sortDirection);
        }

        $paginatedUsers = $users->paginate(10);

        // Transformer les données avant de les retourner
        $transformedUsers = $paginatedUsers->getCollection()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'totalCandidates' => $user->recruiter ? $user->recruiter->candidates_count : 0,
                'totalPosts' => $user->recruiter ? $user->recruiter->posts_count : 0,
                'totalInterviews' => $user->recruiter ? $user->recruiter->candidates()->has('responses')->count() : 0,
            ];
        });

        return response()->json([
            'users' => $transformedUsers,
            'total' => $paginatedUsers->total(),
        ]);
    }

    public function store(Request $request)
    {
        $validateUser = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:6',
                'company_name' => 'required|string',
                'role' => 'required|in:recruteur,administrateur' // Validation du rôle
            ]
        );
    
        if ($validateUser->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $validateUser->errors()
            ], 401);
        }
    
        try {
            // Créer l'utilisateur
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role // Recruteur ou Administrateur
            ]);
    
            // Si recruteur, créer le lien avec une entreprise
            if ($request->role === 'recruiter') {
                $recruiter = Recruiter::create([
                    'user_id' => $user->id,
                    'company_name' => $request->company_name,
                ]);
            }
    
            return response()->json([
                'status' => true,
                'message' => 'Utilisateur créé avec succès',
                'user' => $user,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Erreur lors de la création de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function update(Request $request, $id)
{
    $validateUser = Validator::make(
        $request->all(),
        [
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $id, // Vérifier l'unicité en ignorant l'utilisateur en cours
            'password' => 'nullable|min:6', // Le mot de passe est optionnel pour la mise à jour
            'company_name' => 'nullable|string',
            'role' => 'required|in:recruteur,administrateur' // Validation du rôle
        ]
    );

    if ($validateUser->fails()) {
        return response()->json([
            'status' => false,
            'message' => 'Validation error',
            'errors' => $validateUser->errors()
        ], 401);
    }

    try {
        $user = User::findOrFail($id);

        // Mise à jour des informations utilisateur
        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->password) {
            $user->password = Hash::make($request->password);
        }
        $user->role = $request->role;
        $user->save();

        // Mise à jour ou création des informations du recruteur
        if ($user->role === 'recruteur') {
            if ($user->recruiter) {
                $user->recruiter->update([
                    'company_name' => $request->company_name
                ]);
            } else {
                Recruiter::create([
                    'user_id' => $user->id,
                    'company_name' => $request->company_name,
                ]);
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => $user,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Erreur lors de la mise à jour de l\'utilisateur',
            'error' => $e->getMessage()
        ], 500);
    }
}

    


    /**
     * Login The User
     * @param Request $request
     * @return User
     */
    public function loginUser(Request $request)
    {
        try {
            $validateUser = Validator::make(
                $request->all(),
                [
                    'email' => 'required|email',
                    'password' => 'required'
                ]
            );

            if ($validateUser->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            if (!Auth::attempt($request->only(['email', 'password']))) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email & Password does not match with our record.',
                ], 401);
            }

            $user = User::where('email', $request->email)->first();

            return response()->json([
                'status' => true,
                'message' => 'User Logged In Successfully',
                'token' => $user->createToken("API TOKEN")->plainTextToken
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Rechercher l'utilisateur par ID
            $user = User::findOrFail($id);

            // Supprimer le recruteur associé s'il existe
            if ($user->recruiter) {
                $user->recruiter->delete();
            }

            // Supprimer l'utilisateur
            $user->delete();

            return response()->json([
                'status' => true,
                'message' => 'User Deleted Successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'User Not Found or Could Not Be Deleted',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
