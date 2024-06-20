<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Response;
use App\Models\Candidate;

class ResponseController extends Controller
{
    // Méthode pour stocker une nouvelle vidéo
    public function store(Request $request)
    {
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'video' => 'required|file|mimes:mp4,mov,mkv,ogg,qt|max:20000' 
        ]);

        $videoPath = $request->file('video')->store('public/videos');
        $videoUrl = str_replace('public/', '', $videoPath);

        $response = new Response([
            'candidate_id' => $request->input('candidate_id'),
            'video_url' => $videoUrl,
        ]);

        $response->save();

        return response()->json(['message' => 'Video uploaded successfully', 'video_url' => $videoUrl], 200);
    }

    public function index()
    {
        $videos = Candidate::with('responses')->get()->pluck('responses.*.video_url')->flatten()->toArray();
        $totalVideos = count($videos);

        return response()->json(['videos' => $videos, 'total' => $totalVideos], 200);
    }
}
