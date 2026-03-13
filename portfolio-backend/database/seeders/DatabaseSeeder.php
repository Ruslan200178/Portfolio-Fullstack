<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            UserSeeder::class,
            AboutSeeder::class,
            SkillSeeder::class,
            ExperienceSeeder::class,
            EducationSeeder::class,
            ProjectSeeder::class,
            ContactSeeder::class,
        ]);
    }
}