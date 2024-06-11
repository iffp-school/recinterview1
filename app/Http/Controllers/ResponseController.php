<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Response;

class ResponseController extends Controller
{
    public function index()
    {
        // Récupérer la liste de toutes les réponses
        $responses = Response::all();
        return response()->json($responses);
    }

    public function store(Request $request)
    {
        // Créer une nouvelle réponse
        $response = new Response();
        $response->candidate_id = $request->input('candidate_id');
        $response->video_url = $request->input('video_url');
        $response->save();
        return response()->json($response);
    }

    public function show($id)
    {
        // Récupérer une réponse par son ID
        $response = Response::find($id);
        if (!$response) {
            return response()->json(['message' => 'Response not found'], 404);
        }
        return response()->json($response);
    }

    public function update(Request $request, $id)
    {
        // Mettre à jour une réponse
        $response = Response::find($id);
        if (!$response) {
            return response()->json(['message' => 'Response not found'], 404);
        }
        $response->update($request->all());
        return response()->json($response);
    }

    public function destroy($id)
    {
        // Supprimer une réponse
        $response = Response::find($id);
        if (!$response) {
            return response()->json(['message' => 'Response not found'], 404);
        }
        $response->delete();
        return response()->json(['message' => 'Response deleted']);
    }
}
