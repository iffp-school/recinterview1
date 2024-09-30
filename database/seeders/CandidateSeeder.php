<?php

namespace Database\Seeders;

use App\Models\Candidate;
use App\Models\Post;
use Illuminate\Database\Seeder;

class CandidateSeeder extends Seeder
{
    public function run()
    {
        // Chaque poste se voit attribuer 5 candidats avec le CV spécifié
        Post::all()->each(function ($post) {
            Candidate::factory()->count(5)->create([
                'post_id' => $post->id,
                'cv' => 'cvs/Cd6cOYdDV8oh90iLK12wO0YABye9rTzT8X0mWvs5.pdf', // Utilise le CV fourni
            ]);
        });
    }
}
