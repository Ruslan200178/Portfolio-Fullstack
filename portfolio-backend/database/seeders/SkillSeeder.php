<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillSeeder extends Seeder
{
    public function run()
    {
        // Only seed if empty
        if (Skill::count() === 0) {
            $skills = [
                ['name' => 'React JS',     'percentage' => 90, 'category' => 'Frontend',  'color' => '#61DAFB', 'sort_order' => 1],
                ['name' => 'JavaScript',   'percentage' => 88, 'category' => 'Frontend',  'color' => '#F7DF1E', 'sort_order' => 2],
                ['name' => 'Tailwind CSS', 'percentage' => 92, 'category' => 'Frontend',  'color' => '#38BDF8', 'sort_order' => 3],
                ['name' => 'HTML & CSS',   'percentage' => 95, 'category' => 'Frontend',  'color' => '#E34F26', 'sort_order' => 4],
                ['name' => 'Vue JS',       'percentage' => 70, 'category' => 'Frontend',  'color' => '#42B883', 'sort_order' => 5],
                ['name' => 'Laravel',      'percentage' => 92, 'category' => 'Backend',   'color' => '#FF2D20', 'sort_order' => 1],
                ['name' => 'PHP',          'percentage' => 90, 'category' => 'Backend',   'color' => '#777BB4', 'sort_order' => 2],
                ['name' => 'REST API',     'percentage' => 88, 'category' => 'Backend',   'color' => '#00897B', 'sort_order' => 3],
                ['name' => 'Node JS',      'percentage' => 65, 'category' => 'Backend',   'color' => '#68A063', 'sort_order' => 4],
                ['name' => 'MySQL',        'percentage' => 88, 'category' => 'Database',  'color' => '#4479A1', 'sort_order' => 1],
                ['name' => 'PostgreSQL',   'percentage' => 70, 'category' => 'Database',  'color' => '#336791', 'sort_order' => 2],
                ['name' => 'MongoDB',      'percentage' => 60, 'category' => 'Database',  'color' => '#47A248', 'sort_order' => 3],
                ['name' => 'Git & GitHub', 'percentage' => 90, 'category' => 'Tools',     'color' => '#F05032', 'sort_order' => 1],
                ['name' => 'Docker',       'percentage' => 65, 'category' => 'Tools',     'color' => '#2496ED', 'sort_order' => 2],
                ['name' => 'VS Code',      'percentage' => 95, 'category' => 'Tools',     'color' => '#007ACC', 'sort_order' => 3],
                ['name' => 'Postman',      'percentage' => 88, 'category' => 'Tools',     'color' => '#FF6C37', 'sort_order' => 4],
            ];

            foreach ($skills as $skill) {
                Skill::create($skill);
            }
        }
    }
}