<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition()
    {
        return [
            'post_id' => Post::factory(), // Crée un post associé si non existant
            'question_text' => $this->faker->sentence,
            'preparation_time' => $this->faker->numberBetween(30, 120), // Temps de préparation entre 30 et 120 secondes
            'response_time' => $this->faker->numberBetween(30, 300),    // Temps de réponse entre 30 et 300 secondes
        ];
    }
}
