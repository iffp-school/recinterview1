<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Response;
use App\Models\Candidate;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class ResponseController extends Controller
{
    // Méthode pour stocker une nouvelle vidéo
    public function store(Request $request)
    {
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'video' => 'required|file|max:20000' 
        ]);

        $videoPath = $request->file('video')->store('public/videos');
        $videoUrl = str_replace('public/', '', $videoPath);

        $response = new Response([
            'candidate_id' => $request->input('candidate_id'),
            'video_url' => $videoUrl,
        ]);

        $response->save();

        return response()->json(['message' => 'Video uploaded successfully', 'video_url' => $videoUrl], 200, [], JSON_UNESCAPED_UNICODE);
    }


    public function index()
    {
        $videos = Candidate::with('responses')->get()->pluck('responses.*.video_url')->flatten()->toArray();
        $totalVideos = count($videos);

        return response()->json(['videos' => $videos, 'total' => $totalVideos], 200, [], JSON_UNESCAPED_UNICODE);
    }

    public function executeStorageScript()
    {
        Log::info('executeScript method called');

        $process = new Process(['sh', base_path('scripts/recreate_symlink.sh')]);
        $process->run();

        if (!$process->isSuccessful()) {
            Log::error('Error executing recreate_symlink.sh', ['output' => $process->getErrorOutput(), 'retval' => $process->getExitCode()]);
            throw new ProcessFailedException($process);
        }

        $output = $process->getOutput();
        Log::info('Script raw output', ['output' => $output]);

        // Assurez-vous que l'output est bien encodé en UTF-8
        $cleanOutput = mb_convert_encoding($output, 'UTF-8', 'UTF-8');
        Log::info('Script cleaned output', ['output' => $cleanOutput]);

        // Retourner une réponse texte simplifiée
        return response('Script executed successfully', 200)
            ->header('Content-Type', 'text/plain');
    }
}
