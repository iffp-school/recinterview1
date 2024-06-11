<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recruiter;

class RecruiterController extends Controller
{
    public function index()
    {
        // Récupérer la liste des recruteurs
        $recruiters = Recruiter::all();
        return response()->json($recruiters);
    }

    public function store(Request $request)
    {
        // Créer un nouveau recruteur
        $recruiter = new Recruiter();
        $recruiter->company_name = $request->input('company_name');
        $recruiter->save();
        return response()->json($recruiter);
    }

    public function show($id)
    {
        // Récupérer les détails d'un recruteur spécifique
        $recruiter = Recruiter::findOrFail($id);
        return response()->json($recruiter);
    }

    public function update(Request $request, $id)
    {
        // Mettre à jour les informations d'un recruteur
        $recruiter = Recruiter::findOrFail($id);
        $recruiter->company_name = $request->input('company_name');
        $recruiter->save();
        return response()->json($recruiter);
    }

    public function destroy($id)
    {
        // Supprimer un recruteur
        $recruiter = Recruiter::findOrFail($id);
        $recruiter->delete();
        return response()->json(['message' => 'Recruiter deleted successfully']);
    }
}
