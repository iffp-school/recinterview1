<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Post;
use App\Models\Recruiter;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    // Méthode pour l'administrateur
    public function getAdminDashboardData()
    {
        // Total des recruteurs
        $totalRecruiters = Recruiter::count();

        // Total des candidats
        $totalCandidates = Candidate::count();

        // Nombre total de postes
        $totalPosts = Post::count();

        // Nombre d'entretiens passés (nombre de réponses vidéo soumises)
        $totalInterviews = Candidate::has('responses')->count();

        // Nombre de candidats par poste
        $candidatesPerPost = Post::withCount('candidates')
            ->get()
            ->map(function ($post) {
                return [
                    'title' => $post->title,
                    'candidates_count' => $post->candidates_count,
                ];
            });

        // Taux de réussite (candidats ayant un rating > 50%)
        $successfulCandidates = Candidate::where('rating', '>', 50)->count();
        $failedCandidates = $totalCandidates - $successfulCandidates;

        return response()->json([
            'totalRecruiters' => $totalRecruiters,
            'totalCandidates' => $totalCandidates,
            'totalPosts' => $totalPosts,
            'totalInterviews' => $totalInterviews,
            'candidatesPerPost' => $candidatesPerPost,
            'successRates' => [
                'successful' => $successfulCandidates,
                'failed' => $failedCandidates
            ]
        ]);
    }

    public function getRecruiterDashboardData()
    {
        // Récupérer l'utilisateur connecté avec la relation 'recruiter'
        $user = Auth::user();
        Log::info($user);

        // Charger explicitement la relation recruiter
        $recruiter = Recruiter::where('user_id', $user->id)->first();

        if (!$recruiter) {
            return response()->json(['error' => 'Recruteur non trouvé'], 404);
        }

        // Continue avec le reste de ta logique
        $totalCandidates = Candidate::whereHas('post', function ($query) use ($recruiter) {
            $query->where('recruiter_id', $recruiter->id);
        })->count();

        $totalPosts = $recruiter->posts()->count();
        $totalInterviews = Candidate::whereHas('post', function ($query) use ($recruiter) {
            $query->where('recruiter_id', $recruiter->id);
        })->has('responses')->count();

        $candidatesPerPost = $recruiter->posts()->withCount('candidates')
            ->get()
            ->map(function ($post) {
                return [
                    'title' => $post->title,
                    'candidates_count' => $post->candidates_count,
                ];
            });

        $successfulCandidates = Candidate::whereHas('post', function ($query) use ($recruiter) {
            $query->where('recruiter_id', $recruiter->id);
        })->where('rating', '>', 50)->count();

        $failedCandidates = $totalCandidates - $successfulCandidates;

        return response()->json([
            'totalCandidates' => $totalCandidates,
            'totalPosts' => $totalPosts,
            'totalInterviews' => $totalInterviews,
            'candidatesPerPost' => $candidatesPerPost,
            'successRates' => [
                'successful' => $successfulCandidates,
                'failed' => $failedCandidates
            ]
        ]);
    }
}
