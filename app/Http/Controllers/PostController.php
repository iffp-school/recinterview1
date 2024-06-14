<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Question;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with('questions')->paginate(10);
        return response()->json([
            'posts' => $posts->items(),
            'total' => $posts->total()
        ], 200);
    }


    public function store(Request $request)
    {
        $post = Post::create($request->only(['title', 'description', 'recruiter_id']));

        if ($request->has('questions')) {
            foreach ($request->questions as $questionText) {
                $question = new Question([
                    'question_text' => $questionText,
                    'post_id' => $post->id
                ]);
                $question->save();
            }
        }

        return response()->json($post, 201);
    }

    public function show($id)
    {
        return response()->json(Post::with('questions')->findOrFail($id), 200);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $post->update($request->all());
        return response()->json($post, 200);
    }

    public function destroy($id)
    {
        Post::destroy($id);
        return response()->json(null, 204);
    }

    public function attachQuestion(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $question = new Question([
            'question_text' => $request->question_text,
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
}
