<?php

namespace Database\Seeders;

use App\Models\Response;
use App\Models\Candidate;
use Illuminate\Database\Seeder;

class ResponseSeeder extends Seeder
{
    public function run()
    {
        // Liens vidéo factices fournis
        $videoLinks = [
            'videos/1QfPOpv07gntGFhYInSCZdCiLopIo6hJKuVTYriD.mkv',
            'videos/2AfpJ4Gmizlb9GHOflgO4zDN9q9r8CIaXLldLzVh.mkv',
            'videos/2KoANEsIUvDxn1QDkpegDN20LkKTRSaCKnCQcwcu.mkv',
            'videos/2fMxIEsOcJVzPKSYvyQubk6nwEzaeuK60wuA5U53.mkv'
        ];

        Candidate::all()->each(function ($candidate) use ($videoLinks) {
            foreach ($videoLinks as $video) {
                Response::factory()->create([
                    'candidate_id' => $candidate->id,
                    'video_url' => $video, // Utilise le lien vidéo fourni
                ]);
            }
        });
    }
}
