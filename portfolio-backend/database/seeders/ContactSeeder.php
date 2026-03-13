<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contact;

class ContactSeeder extends Seeder
{
    public function run()
    {
        if (Contact::count() === 0) {
            $contacts = [
                [
                    'name'    => 'Alice Johnson',
                    'email'   => 'alice@example.com',
                    'subject' => 'Job Opportunity',
                    'message' => 'Hi, I am impressed with your work. We have a position open.',
                    'is_read' => false,
                    'read_at' => null,
                ],
                [
                    'name'    => 'Bob Smith',
                    'email'   => 'bob@example.com',
                    'subject' => 'Project Collaboration',
                    'message' => 'Hello, I have a startup idea and looking for a technical co-founder.',
                    'is_read' => true,
                    'read_at' => now(),
                ],
            ];

            foreach ($contacts as $contact) {
                Contact::create($contact);
            }
        }
    }
}