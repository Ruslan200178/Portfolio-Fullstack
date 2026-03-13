<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Education;

class EducationSeeder extends Seeder
{
    public function run()
    {
        if (Education::count() === 0) {
            $educations = [
                [
                    'institution'     => 'Massachusetts Institute of Technology',
                    'degree'          => 'Master of Science',
                    'field_of_study'  => 'Computer Science',
                    'start_date'      => '2017-09-01',
                    'end_date'        => '2019-06-30',
                    'is_current'      => false,
                    'grade'           => '3.9 GPA',
                    'description'     => 'Specialized in Software Engineering and Distributed Systems.',
                    'institution_logo'=> null,
                    'sort_order'      => 1,
                ],
                [
                    'institution'     => 'Stanford University',
                    'degree'          => 'Bachelor of Science',
                    'field_of_study'  => 'Software Engineering',
                    'start_date'      => '2013-09-01',
                    'end_date'        => '2017-06-30',
                    'is_current'      => false,
                    'grade'           => '3.8 GPA',
                    'description'     => 'Studied core computer science fundamentals.',
                    'institution_logo'=> null,
                    'sort_order'      => 2,
                ],
            ];

            foreach ($educations as $edu) {
                Education::create($edu);
            }
        }
    }
}