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

    public function executeStorageScript()
    {
        Log::info('executeScript method called');

        $process = new Process(['sh', base_path('scripts/recreate_symlink.sh')]);
        $process->run();

        // executes after the command finishes
        if (!$process->isSuccessful()) {
            Log::error('Error executing recreate_symlink.sh', ['output' => $process->getErrorOutput(), 'retval' => $process->getExitCode()]);
            throw new ProcessFailedException($process);
        }

        $output = $process->getOutput();
        Log::info('Script output', ['output' => $output]);

        return response()->json(['message' => 'Script executed successfully', 'output' => $output], 200);
    }
}
