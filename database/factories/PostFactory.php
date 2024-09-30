<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\Recruiter;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition()
    {
        return [
            'recruiter_id' => Recruiter::factory(), // Crée un recruteur associé si non existant
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'random_string' => Str::random(8), // Génère une chaîne aléatoire
            'message_end' => $this->faker->sentence,
        ];
    }
}
