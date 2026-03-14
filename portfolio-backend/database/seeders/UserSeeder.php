<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::statement("
            INSERT INTO users (name, email, password, is_admin, created_at, updated_at)
            VALUES 
            ('Admin', 'admin@portfolio.com', '" . Hash::make('password123') . "', TRUE, NOW(), NOW()),
            ('Test User', 'test@portfolio.com', '" . Hash::make('password123') . "', FALSE, NOW(), NOW())
            ON CONFLICT (email) DO NOTHING
        ");
    }
}