<?php

namespace Database\Seeders;

use App\Models\Gedung;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GedungSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $gedungs = [
            ['name' => 'Gedung A'],
            ['name' => 'Gedung B'],
            ['name' => 'Gedung C'],
            ['name' => 'Gedung D'],
            ['name' => 'Gedung E'],
            ['name' => 'Gedung F'],
        ];

        foreach ($gedungs as $gedung) {
            Gedung::create($gedung);
        }
    }
}
