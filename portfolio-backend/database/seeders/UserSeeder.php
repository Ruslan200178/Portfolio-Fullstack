<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Admin User — only create if not exists
        User::firstOrCreate(
            ['email' => 'admin@portfolio.com'],
            [
                'name'     => 'Admin',
                'password' => Hash::make('password123'),
                'is_admin' => true,
            ]
        );

        // Test User — only create if not exists
        User::firstOrCreate(
            ['email' => 'test@portfolio.com'],
            [
                'name'     => 'Test User',
                'password' => Hash::make('password123'),
                'is_admin' => false,
            ]
        );
    }
}
