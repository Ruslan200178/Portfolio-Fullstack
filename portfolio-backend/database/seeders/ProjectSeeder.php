<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    public function run()
    {
        if (Project::count() === 0) {
            $projects = [
                [
                    'title'             => 'Portfolio Website',
                    'short_description' => 'A full stack portfolio website built with Laravel and React.',
                    'description'       => 'A modern portfolio website with admin panel for managing content.',
                    'image'             => null,
                    'demo_url'          => 'https://portfolio.example.com',
                    'github_url'        => 'https://github.com/johndoe/portfolio',
                    'tags'              => ['Laravel', 'React', 'TailwindCSS', 'MySQL'],
                    'status'            => 'completed',
                    'is_featured'       => true,
                    'sort_order'        => 1,
                ],
                [
                    'title'             => 'E-Commerce Platform',
                    'short_description' => 'Full featured e-commerce platform with payment integration.',
                    'description'       => 'A complete e-commerce solution with product management and Stripe.',
                    'image'             => null,
                    'demo_url'          => 'https://shop.example.com',
                    'github_url'        => 'https://github.com/johndoe/ecommerce',
                    'tags'              => ['Laravel', 'React', 'Stripe', 'MySQL'],
                    'status'            => 'completed',
                    'is_featured'       => true,
                    'sort_order'        => 2,
                ],
                [
                    'title'             => 'Task Management App',
                    'short_description' => 'A Trello-like task management application.',
                    'description'       => 'Kanban-style task management with drag and drop functionality.',
                    'image'             => null,
                    'demo_url'          => 'https://tasks.example.com',
                    'github_url'        => 'https://github.com/johndoe/taskmanager',
                    'tags'              => ['Laravel', 'Vue JS', 'WebSockets', 'MySQL'],
                    'status'            => 'completed',
                    'is_featured'       => true,
                    'sort_order'        => 3,
                ],
            ];

            foreach ($projects as $project) {
                Project::create($project);
            }
        }
    }
}