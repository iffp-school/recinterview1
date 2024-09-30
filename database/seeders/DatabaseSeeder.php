<?php

namespace Database\Seeders;

use Database\Seeders\UserSeeder;
use Illuminate\Database\Seeder;
use Database\Seeders\RecruiterSeeder;
use Database\Seeders\PostSeeder;
use Database\Seeders\CandidateSeeder;
use Database\Seeders\QuestionSeeder;
use Database\Seeders\ResponseSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
{
    $this->call([
        UserSeeder::class,
        RecruiterSeeder::class,
        PostSeeder::class,
        CandidateSeeder::class,
        QuestionSeeder::class,
        ResponseSeeder::class,
    ]);
}

}
