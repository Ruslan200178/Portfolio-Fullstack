<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    public function definition()
    {
        return [
            'title'             => $this->faker->catchPhrase(),
            'short_description' => $this->faker->sentence(10),
            'description'       => $this->faker->paragraph(4),
            'image'             => null,
            'demo_url'          => 'https://demo.example.com',
            'github_url'        => 'https://github.com/johndoe/project',
            'tags'              => $this->faker->randomElements(
                ['Laravel', 'React', 'Vue', 'MySQL',
                 'TailwindCSS', 'PHP', 'JavaScript', 'API'],
                $this->faker->numberBetween(2, 4)
            ),
            'status'      => $this->faker->randomElement([
                'completed', 'in-progress'
            ]),
            'is_featured' => $this->faker->boolean(30), // 30% chance featured
            'sort_order'  => $this->faker->numberBetween(1, 10),
        ];
    }
}