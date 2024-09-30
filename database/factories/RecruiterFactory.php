<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Recruiter;
use Illuminate\Database\Eloquent\Factories\Factory;

class RecruiterFactory extends Factory
{
    protected $model = Recruiter::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(), // Crée un utilisateur associé si non existant
            'company_name' => $this->faker->company,
        ];
    }
}
