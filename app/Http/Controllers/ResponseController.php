<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Response;
use App\Models\Candidate;
use Illuminate\Support\Facades\Log;


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

        // Exécuter le script pour recréer le lien symbolique
        $output = null;
        $retval = null;
        exec(base_path('scripts/recreate_symlink.sh'), $output, $retval);
        // Log de la sortie et du code de retour du script
        Log::info('Output of recreate_symlink.sh', ['output' => $output, 'retval' => $retval]);

        if ($retval !== 0) {
            Log::error('Error executing recreate_symlink.sh', ['output' => $output, 'retval' => $retval]);
        } else {
            Log::info('recreate_symlink.sh executed successfully', ['output' => $output]);
        }

        return response()->json(['message' => 'Video uploaded successfully', 'video_url' => $videoUrl], 200);
    }

    public function index()
    {
        $videos = Candidate::with('responses')->get()->pluck('responses.*.video_url')->flatten()->toArray();
        $totalVideos = count($videos);

        return response()->json(['videos' => $videos, 'total' => $totalVideos], 200);
    }
}
