<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Recruiter;

class RecruiterSeeder extends Seeder
{
    public function run()
    {
        User::factory()
            ->count(10) // Créer 10 utilisateurs avec chacun un recruteur
            ->has(Recruiter::factory()->count(1))
            ->create();
    }
}
