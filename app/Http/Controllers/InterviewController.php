<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Candidate;

class InterviewController extends Controller
{
    // Obtenir les statistiques globales des entretiens
    public function getInterviewStatistics()
    {
        $totalInterviews = Candidate::count();
        $completedInterviews = Candidate::where('rating', '>=', 3)->count();
        $pendingInterviews = $totalInterviews - $completedInterviews;
        $averageRating = Candidate::whereNotNull('rating')->average('rating');

        return response()->json([
            'total_interviews' => $totalInterviews,
            'completed_interviews' => $completedInterviews,
            'pending_interviews' => $pendingInterviews,
            'average_rating' => round($averageRating, 2)
        ], 200);
    }

    public function getCompletedInterviews(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $completedInterviewsQuery = Candidate::with(['post.recruiter.user'])
            ->where('rating', '>=', 3)
            ->paginate($perPage);


        $completedInterviews = $completedInterviewsQuery->items();

        $completedInterviews = array_map(function ($candidate) {
            return [
                'id' => $candidate->id,
                'candidate_name' => $candidate->first_name . ' ' . $candidate->last_name,
                'post_title' => $candidate->post->title,
                'recruiter_name' => $candidate->post->recruiter->user->name,
                'status' => 'Terminé',
                'final_rating' => $candidate->rating,
                'created_at' => $candidate->created_at,
                'updated_at' => $candidate->updated_at
            ];
        }, $completedInterviews);


        return response()->json([
            'interviews' => $completedInterviews,
            'total_pages' => $completedInterviewsQuery->lastPage(),
            'current_page' => $completedInterviewsQuery->currentPage(),
        ], 200);
    }



    public function getPendingInterviews(Request $request)
    {
        $perPage = $request->input('per_page', 10); // Nombre d'éléments par page, par défaut 10
        $pendingInterviewsQuery = Candidate::with(['post.recruiter.user'])
            ->whereNull('rating') // Considérer les entretiens en cours comme ceux sans note
            ->orWhere('rating', '<', 3)
            ->paginate($perPage);

        // Utiliser la méthode map directement sur les éléments de la collection
        $pendingInterviews = $pendingInterviewsQuery->items();

        $pendingInterviews = array_map(function ($candidate) {
            return [
                'id' => $candidate->id,
                'candidate_name' => $candidate->first_name . ' ' . $candidate->last_name,
                'post_title' => $candidate->post->title,
                'recruiter_name' => $candidate->post->recruiter->user->name,
                'status' => 'En attente',
                'created_at' => $candidate->created_at,
            ];
        }, $pendingInterviews);

        return response()->json([
            'interviews' => $pendingInterviews,
            'total_pages' => $pendingInterviewsQuery->lastPage(),
            'current_page' => $pendingInterviewsQuery->currentPage(),
        ], 200);
    }


    // Obtenir les activités récentes des recruteurs (audit simple)
    public function getRecruiterActivities()
    {
        // Logique pour récupérer les activités des recruteurs - ici, en se basant sur les modifications de la table candidates
        $recentActivities = Candidate::with(['post.recruiter.user'])
            ->whereNotNull('updated_at')
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($candidate) {
                return [
                    'candidate_name' => $candidate->first_name . ' ' . $candidate->last_name,
                    'post_title' => $candidate->post->title,
                    'recruiter_name' => $candidate->post->recruiter->user->name,
                    'action' => "Mis à jour l'entretien",
                    'updated_at' => $candidate->updated_at
                ];
            });

        return response()->json($recentActivities, 200);
    }

    // Visualiser les réponses d'un entretien terminé
    public function viewCompletedInterviewResponses($id)
    {
        $candidate = Candidate::with(['responses', 'post.questions'])->find($id);

        if (!$candidate || $candidate->rating < 3) {
            return response()->json(['error' => 'Entretien non trouvé ou pas encore terminé'], 404);
        }

        $responsesData = $candidate->responses->map(function ($response) use ($candidate) {
            $question = $candidate->post->questions->firstWhere('id', $response->id);
            return [
                'question' => $question ? $question->question_text : 'Question non trouvée',
                'video_url' => $response->video_url,
            ];
        });

        return response()->json([
            'candidate' => [
                'name' => $candidate->first_name . ' ' . $candidate->last_name,
                'post' => $candidate->post->title,
            ],
            'responses' => $responsesData
        ], 200);
    }
}
