<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\About;

class AboutSeeder extends Seeder
{
    public function run()
    {
        // Only create if no about exists
        if (About::count() === 0) {
            About::create([
                'name'         => 'John Doe',
                'title'        => 'Full Stack Developer',
                'subtitle'     => 'Laravel & React Specialist',
                'description'  => 'I am a passionate Full Stack Developer with 3+ years of experience in building modern web applications. I specialize in Laravel for backend development and React for frontend.',
                'profile_image'=> null,
                'cv_file'      => null,
                'email'        => 'johndoe@email.com',
                'phone'        => '+1 234 567 8900',
                'location'     => 'New York, USA',
                'github_url'   => 'https://github.com/johndoe',
                'linkedin_url' => 'https://linkedin.com/in/johndoe',
                'twitter_url'  => 'https://twitter.com/johndoe',
            ]);
        }
    }
}