<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $query = Candidate::with(['post.questions', 'responses']);

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', '%' . $search . '%')
                    ->orWhere('last_name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%')
                    ->orWhereHas('post', function ($q) use ($search) {
                        $q->where('title', 'like', '%' . $search . '%');
                    });
            });
        }

        if ($request->has('sort_by') && $request->has('sort_direction') && !empty($request->sort_by) && !empty($request->sort_direction)) {
            $sortBy = $request->sort_by;
            $sortDirection = $request->sort_direction;
            $sortableColumns = ['first_name', 'last_name', 'email', 'phone', 'created_at', 'rating']; // Add 'rating' here

            if ($sortBy === 'post.title') {
                $query->join('posts', 'candidates.post_id', '=', 'posts.id')
                    ->orderBy('posts.title', $sortDirection)
                    ->select('candidates.*');
            } elseif (in_array($sortBy, $sortableColumns)) {
                $query->orderBy($sortBy, $sortDirection);
            } else {
                return response()->json(['error' => 'Invalid sort column'], 400);
            }
        }

        $candidatesWithDetails = $query->paginate(10);

        // Assurez-vous que l'URL complète du CV est renvoyée
        foreach ($candidatesWithDetails->items() as $candidate) {
            if ($candidate->cv) {
                $candidate->cv_url = url('storage/' . $candidate->cv);
            }
        }

        return response()->json([
            'candidates' => $candidatesWithDetails->items(),
            'total' => $candidatesWithDetails->total()
        ], 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'gender' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'cv' => 'required|file|mimes:pdf|max:2048', // Validation pour le champ CV
            'post_id' => 'required|exists:posts,id',
        ]);

        $filePath = $request->file('cv')->store('cvs', 'public'); // Stocker le fichier

        $candidate = new Candidate([
            'gender' => $validatedData['gender'],
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
            'phone' => $validatedData['phone'],
            'cv' => $filePath,
            'post_id' => $validatedData['post_id'],
        ]);

        $candidate->save();

        return response()->json($candidate, 201);
    }


    public function show($id)
    {
        return Candidate::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'string',
            'last_name' => 'string',
            'email' => 'email|unique:candidates,email,' . $id,
            'phone' => 'nullable|string',
            'post_id' => 'exists:posts,id' // Validation de l'ID du poste lors de la mise à jour
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $candidate = Candidate::findOrFail($id);
        $candidate->update($request->all());
        return response()->json($candidate, 200);
    }

    public function destroy($id)
    {
        $candidate = Candidate::findOrFail($id);
        $candidate->delete();
        return response()->json(null, 204);
    }

    public function getCandidateByEmail($email)
    {
        $candidate = Candidate::where('email', $email)->first();
        if ($candidate) {
            return response()->json($candidate, 200);
        } else {
            return response()->json(['message' => 'No candidate found for this email'], 404);
        }
    }


    public function updateRating(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $candidate = Candidate::findOrFail($id);
        $candidate->rating = $request->input('rating');
        $candidate->save();

        return response()->json($candidate, 200);
    }
}
