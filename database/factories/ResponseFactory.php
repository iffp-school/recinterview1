<?php

namespace Database\Factories;

use App\Models\Response;
use App\Models\Candidate;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResponseFactory extends Factory
{
    protected $model = Response::class;

    public function definition()
    {
        return [
            'candidate_id' => Candidate::factory(), // Crée un candidat associé si non existant
            'video_url' => null, // Nous allons l'assigner directement depuis le ResponseSeeder
        ];
    }
}
