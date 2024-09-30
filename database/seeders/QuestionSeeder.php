<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Post;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    public function run()
    {
        // Chaque poste se voit attribuer 4 questions
        Post::all()->each(function ($post) {
            Question::factory()->count(4)->create([
                'post_id' => $post->id,
            ]);
        });
    }
}
