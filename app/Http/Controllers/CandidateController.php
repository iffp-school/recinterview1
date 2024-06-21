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

        if ($request->has('search')) {
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

        $candidatesWithDetails = $query->paginate(10);

        return response()->json([
            'candidates' => $candidatesWithDetails->items(),
            'total' => $candidatesWithDetails->total()
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:candidates',
            'phone' => 'nullable|string',
            'post_id' => 'required|exists:posts,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $candidate = Candidate::create($request->all());
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
}
