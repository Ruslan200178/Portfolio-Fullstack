<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Experience;

class ExperienceSeeder extends Seeder
{
    public function run()
    {
        if (Experience::count() === 0) {
            $experiences = [
                [
                    'company'     => 'Tech Solutions Inc.',
                    'position'    => 'Senior Full Stack Developer',
                    'location'    => 'New York, USA',
                    'start_date'  => '2022-01-01',
                    'end_date'    => null,
                    'is_current'  => true,
                    'description' => 'Leading development of large-scale web applications using Laravel and React.',
                    'company_logo'=> null,
                    'sort_order'  => 1,
                ],
                [
                    'company'     => 'Digital Agency Co.',
                    'position'    => 'Full Stack Developer',
                    'location'    => 'Boston, USA',
                    'start_date'  => '2020-06-01',
                    'end_date'    => '2021-12-31',
                    'is_current'  => false,
                    'description' => 'Developed and maintained multiple client web applications.',
                    'company_logo'=> null,
                    'sort_order'  => 2,
                ],
                [
                    'company'     => 'StartUp Labs',
                    'position'    => 'Junior Web Developer',
                    'location'    => 'Remote',
                    'start_date'  => '2019-01-01',
                    'end_date'    => '2020-05-31',
                    'is_current'  => false,
                    'description' => 'Started career building web applications with PHP and Laravel.',
                    'company_logo'=> null,
                    'sort_order'  => 3,
                ],
            ];

            foreach ($experiences as $exp) {
                Experience::create($exp);
            }
        }
    }
}