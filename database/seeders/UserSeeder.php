<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Applicant users
        User::create([
            'name' => 'John Applicant',
            'email' => 'applicant@example.com',
            'password' => Hash::make('password'),
            'role' => 'APP',
        ]);

        // Create Sub Coordinator user
        User::create([
            'name' => 'Jane Sub Coordinator',
            'email' => 'sco@example.com',
            'password' => Hash::make('password'),
            'role' => 'SCO',
        ]);

        // Create WD2 user
        User::create([
            'name' => 'Bob WD2',
            'email' => 'wd2@example.com',
            'password' => Hash::make('password'),
            'role' => 'WD',
        ]);
    }
}
