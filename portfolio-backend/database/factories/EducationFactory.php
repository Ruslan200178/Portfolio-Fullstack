<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EducationFactory extends Factory
{
    public function definition()
    {
        $startDate = $this->faker->dateTimeBetween('-8 years', '-4 years');
        $endDate   = $this->faker->dateTimeBetween($startDate, '-1 year');

        return [
            'institution'    => $this->faker->randomElement([
                'MIT', 'Stanford University',
                'Harvard University', 'Oxford University'
            ]) . ' - ' . $this->faker->city(),
            'degree'         => $this->faker->randomElement([
                'Bachelor of Science',
                'Master of Science',
                'Bachelor of Engineering',
                'Master of Engineering',
            ]),
            'field_of_study' => $this->faker->randomElement([
                'Computer Science',
                'Software Engineering',
                'Information Technology',
                'Computer Engineering',
            ]),
            'start_date'      => $startDate,
            'end_date'        => $endDate,
            'is_current'      => false,
            'grade'           => $this->faker->randomElement([
                '3.8 GPA', '3.9 GPA', 'First Class', 'Distinction'
            ]),
            'description'     => $this->faker->paragraph(2),
            'institution_logo'=> null,
            'sort_order'      => $this->faker->numberBetween(1, 5),
        ];
    }
}