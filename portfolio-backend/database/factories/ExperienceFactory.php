<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ExperienceFactory extends Factory
{
    public function definition()
    {
        $startDate = $this->faker->dateTimeBetween('-5 years', '-1 year');
        $endDate   = $this->faker->dateTimeBetween($startDate, 'now');

        return [
            'company'      => $this->faker->company(),
            'position'     => $this->faker->jobTitle(),
            'location'     => $this->faker->city() . ', ' . $this->faker->country(),
            'start_date'   => $startDate,
            'end_date'     => $endDate,
            'is_current'   => false,
            'description'  => $this->faker->paragraph(3),
            'company_logo' => null,
            'sort_order'   => $this->faker->numberBetween(1, 10),
        ];
    }
}