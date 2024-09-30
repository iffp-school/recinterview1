<?php

namespace Database\Factories;

use App\Models\Candidate;
use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

class CandidateFactory extends Factory
{
    protected $model = Candidate::class;

    public function definition()
    {
        return [
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'email' => $this->faker->unique()->safeEmail,
            'phone' => $this->faker->phoneNumber,
            'cv' => 'cvs/Cd6cOYdDV8oh90iLK12wO0YABye9rTzT8X0mWvs5.pdf', // Utilise le chemin de CV fourni
            'post_id' => Post::factory(), // Crée un post associé si non existant
            'gender' => $this->faker->randomElement(['male', 'female']),
            'rating' => $this->faker->numberBetween(1, 5), // Note entre 1 et 5
        ];
    }
}
