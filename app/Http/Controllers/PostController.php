<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with('questions');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('title', 'like', '%' . $search . '%');
        }

        if ($request->has('sort_by') && $request->has('sort_direction') && !empty($request->sort_by) && !empty($request->sort_direction)) {
            $sortBy = $request->sort_by;
            $sortDirection = $request->sort_direction;

            // Liste blanche pour les colonnes triables
            $sortableColumns = ['title', 'created_at'];

            if (in_array($sortBy, $sortableColumns)) {
                $query->orderBy($sortBy, $sortDirection);
            } else {
                return response()->json(['error' => 'Invalid sort column'], 400);
            }
        }

        $posts = $query->paginate(10);

        return response()->json([
            'posts' => $posts->items(),
            'total' => $posts->total()
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'recruiter_id' => 'required|integer',
            'message_end' => 'nullable|string', // Ajoutez cette ligne
            'questions' => 'sometimes|array',
            'questions.*.question_text' => 'required_with:questions|string',
            'questions.*.preparation_time' => 'required_with:questions|integer',
            'questions.*.response_time' => 'required_with:questions|integer',
        ]);

        $post = Post::create($request->only(['title', 'description', 'recruiter_id', 'message_end'])); // Ajoutez 'message_end'

        if ($request->has('questions')) {
            foreach ($request->questions as $questionData) {
                $question = new Question([
                    'question_text' => $questionData['question_text'],
                    'preparation_time' => $questionData['preparation_time'],
                    'response_time' => $questionData['response_time'],
                    'post_id' => $post->id
                ]);
                $question->save();
            }
        }

        return response()->json($post->load('questions'), 201);
    }


    public function show($id)
    {
        return response()->json(Post::with('questions')->findOrFail($id), 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'recruiter_id' => 'required|integer',
            'message_end' => 'nullable|string',
            'questions' => 'sometimes|array',
            'questions.*.id' => 'sometimes|integer|exists:questions,id',
            'questions.*.question_text' => 'required_with:questions|string',
            'questions.*.preparation_time' => 'required_with:questions|integer',
            'questions.*.response_time' => 'required_with:questions|integer',
        ]);

        $post = Post::findOrFail($id);
        $post->update($request->only(['title', 'description', 'recruiter_id', 'message_end']));

        // Logique pour mettre à jour et supprimer les questions existantes
        if ($request->has('questions')) {
            $questionIds = [];

            foreach ($request->questions as $questionData) {
                if (isset($questionData['id'])) {
                    // Update an existing question
                    $question = Question::findOrFail($questionData['id']);
                    $question->update([
                        'question_text' => $questionData['question_text'],
                        'preparation_time' => $questionData['preparation_time'],
                        'response_time' => $questionData['response_time'],
                    ]);
                    $questionIds[] = $question->id;
                } else {
                    // Create a new question
                    $question = new Question([
                        'question_text' => $questionData['question_text'],
                        'preparation_time' => $questionData['preparation_time'],
                        'response_time' => $questionData['response_time'],
                        'post_id' => $post->id
                    ]);
                    $question->save();
                    $questionIds[] = $question->id;
                }
            }

            // Supprimer les questions qui ne sont plus présentes dans la requête
            Question::where('post_id', $post->id)->whereNotIn('id', $questionIds)->delete();
        }

        return response()->json($post->load('questions'), 200);
    }

    public function destroy($id)
    {
        Post::destroy($id);
        return response()->json(null, 204);
    }

    public function attachQuestion(Request $request, $id)
    {
        $request->validate([
            'question_text' => 'required|string',
            'preparation_time' => 'nullable|integer',
            'response_time' => 'nullable|integer',
        ]);

        $post = Post::findOrFail($id);
        $question = new Question([
            'question_text' => $request->question_text,
            'preparation_time' => $request->preparation_time,
            'response_time' => $request->response_time,
            'post_id' => $post->id
        ]);
        $question->save();
        return response()->json($post->load('questions'), 200);
    }

    public function detachQuestion(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $question = Question::findOrFail($request->question_id);
        if ($question->post_id == $post->id) {
            $question->delete();
        }
        return response()->json($post->load('questions'), 200);
    }

    public function getByRandomString($randomString)
    {
        $post = Post::where('random_string', $randomString)->firstOrFail();
        return response()->json($post, 200);
    }

    public function getResponsesByPost($postId)
    {
        // Récupérer les candidats avec leurs réponses et questions du poste
        $post = Post::with(['candidates.responses'])->findOrFail($postId);
        $questions = $post->questions;

        $responsesByCandidate = $post->candidates->map(function ($candidate) use ($questions) {
            return [
                'candidate' => [
                    'first_name' => $candidate->first_name,
                    'last_name' => $candidate->last_name,
                    'email' => $candidate->email,
                ],
                'responses' => $candidate->responses->map(function ($response, $index) use ($questions) {
                    $question = $questions[$index] ?? null;
                    return [
                        'video_url' => $response->video_url,
                        'question' => $question ? $question->question_text : 'Question non trouvée',
                    ];
                }),
            ];
        });

        return response()->json([
            'post_title' => $post->title,
            'responses' => $responsesByCandidate,
        ], 200);
    }
}
