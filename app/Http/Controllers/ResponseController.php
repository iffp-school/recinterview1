<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Candidate;

class ResponseController extends Controller
{
    // Méthode pour stocker une nouvelle vidéo
    public function store(Request $request)
    {
        $videoUrl = $request->file('video')->store('public/videos');

        $candidate = Candidate::find($request->input('candidate_id'));

        $candidate->responses()->create([
            'video_url' => $videoUrl
        ]);

        return response()->json(['message' => 'Video uploaded successfully'], 200);
    }

    public function index()
    {
        $videos = Candidate::with('responses')->get()->pluck('responses.*.video_url')->flatten()->toArray();
        $totalVideos = count($videos);

        return response()->json(['videos' => $videos, 'total' => $totalVideos], 200);
    }
}
