<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->upsert([
            [
                'name'       => 'Admin',
                'email'      => 'admin@portfolio.com',
                'password'   => Hash::make('password123'),
                'is_admin'   => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'Test User',
                'email'      => 'test@portfolio.com',
                'password'   => Hash::make('password123'),
                'is_admin'   => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ], ['email'], ['name', 'password', 'is_admin', 'updated_at']);
    }
}