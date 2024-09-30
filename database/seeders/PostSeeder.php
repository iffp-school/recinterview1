<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Recruiter;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run()
    {
        // Chaque recruteur se voit attribuer 3 postes
        Recruiter::all()->each(function ($recruiter) {
            Post::factory()->count(3)->create([
                'recruiter_id' => $recruiter->id,
            ]);
        });
    }
}
