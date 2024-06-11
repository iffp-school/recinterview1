<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Candidate;

class CandidateController extends Controller
{
    // Méthode pour créer un nouveau candidat
    public function store(Request $request)
    {
        $candidate = Candidate::create([
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'email' => $request->input('email'),
            'user_id' => auth()->user()->id, // Récupère l'ID de l'utilisateur connecté
        ]);

        return response()->json($candidate, 201);
    }

    // Méthode pour afficher les informations d'un candidat spécifique
    public function show($id)
    {
        return Candidate::findOrFail($id);
    }

    // Méthode pour mettre à jour les informations d'un candidat
    public function update(Request $request, $id)
    {
        $candidate = Candidate::findOrFail($id);
        $candidate->update($request->all());

        return response()->json($candidate, 200);
    }

    // Méthode pour supprimer un candidat
    public function destroy($id)
    {
        $candidate = Candidate::findOrFail($id);
        $candidate->delete();

        return response()->json(null, 204);
    }
}
