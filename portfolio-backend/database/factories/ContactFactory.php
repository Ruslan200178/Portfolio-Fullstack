<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ContactFactory extends Factory
{
    public function definition()
    {
        return [
            'name'    => $this->faker->name(),
            'email'   => $this->faker->safeEmail(),
            'subject' => $this->faker->randomElement([
                'Job Opportunity',
                'Project Collaboration',
                'Freelance Work',
                'General Inquiry',
                'Partnership',
            ]),
            'message' => $this->faker->paragraph(3),
            'is_read' => $this->faker->boolean(40),
            'read_at' => null,
        ];
    }
}