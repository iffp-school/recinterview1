<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::factory()->create([
            'name' => 'Mouad',
            'email' => 'mouadsellak@gmail.com',
            'password' => Hash::make('12345678'),
            'role' => 'recruteur',
        ]);

        User::factory()->count(10)->create([
            'role' => 'recruteur',
        ]);

        User::factory()->create([
            'name' => 'Iao',
            'email' => 'iao@gmail.com',
            'password' => Hash::make('12345678'),
            'role' => 'administrateur',
        ]);
    }
}
