<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SkillFactory extends Factory
{
    public function definition()
    {
        return [
            'name'       => $this->faker->word(),
            'percentage' => $this->faker->numberBetween(60, 95),
            'category'   => $this->faker->randomElement([
                'Frontend', 'Backend', 'Database', 'Tools'
            ]),
            'icon'       => null,
            'color'      => $this->faker->hexColor(),
            'sort_order' => $this->faker->numberBetween(1, 10),
        ];
    }
}