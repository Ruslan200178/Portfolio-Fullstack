<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AboutFactory extends Factory
{
    public function definition()
    {
        return [
            'name'         => 'John Doe',
            'title'        => 'Full Stack Developer',
            'subtitle'     => 'Laravel & React Specialist',
            'description'  => 'I am a passionate Full Stack Developer with 3+ years of experience building web applications using Laravel and React. I love creating clean, efficient, and scalable solutions. Always eager to learn new technologies and tackle challenging problems.',
            'profile_image'=> null,
            'cv_file'      => null,
            'email'        => 'johndoe@email.com',
            'phone'        => '+1 234 567 8900',
            'location'     => 'New York, USA',
            'github_url'   => 'https://github.com/johndoe',
            'linkedin_url' => 'https://linkedin.com/in/johndoe',
            'twitter_url'  => 'https://twitter.com/johndoe',
        ];
    }
}