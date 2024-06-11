<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;

class QuestionController extends Controller
{
    public function index()
    {
        // Récupérer la liste de toutes les questions
        $questions = Question::all();
        return response()->json($questions);
    }

    public function store(Request $request)
    {
        // Créer une nouvelle question
        $question = new Question();
        $question->recruiter_id = $request->input('recruiter_id');
        $question->question_text = $request->input('question_text');
        $question->save();
        return response()->json($question);
    }

    public function show($id)
    {
        // Récupérer une question par son ID
        $question = Question::find($id);
        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }
        return response()->json($question);
    }

    public function update(Request $request, $id)
    {
        // Mettre à jour une question
        $question = Question::find($id);
        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }
        $question->update($request->all());
        return response()->json($question);
    }

    public function destroy($id)
    {
        // Supprimer une question
        $question = Question::find($id);
        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }
        $question->delete();
        return response()->json(['message' => 'Question deleted']);
    }
}
