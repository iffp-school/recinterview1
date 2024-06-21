<?php
namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index()
    {
        return Question::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'question_text' => 'required|string',
            'post_id' => 'required|exists:posts,id',
            'preparation_time' => 'nullable|integer',
            'response_time' => 'nullable|integer',
        ]);

        $question = Question::create($request->all());
        return response()->json($question, 201);
    }

    public function show($id)
    {
        return Question::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'question_text' => 'required|string',
            'preparation_time' => 'nullable|integer',
            'response_time' => 'nullable|integer',
        ]);

        $question = Question::findOrFail($id);
        $question->update($request->all());
        return response()->json($question, 200);
    }

    public function destroy($id)
    {
        Question::destroy($id);
        return response()->json(null, 204);
    }
}
