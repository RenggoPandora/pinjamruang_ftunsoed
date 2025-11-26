<?php

namespace Database\Seeders;

use App\Models\Ruang;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RuangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ruangs = [
            // Gedung A (Lantai 1-2)
            ['gedung_id' => 1, 'code' => 'A101', 'name' => 'Ruang Kelas A101', 'is_aula' => false],
            ['gedung_id' => 1, 'code' => 'A102', 'name' => 'Ruang Kelas A102', 'is_aula' => false],
            ['gedung_id' => 1, 'code' => 'A201', 'name' => 'Ruang Kelas A201', 'is_aula' => false],
            ['gedung_id' => 1, 'code' => 'A202', 'name' => 'Ruang Kelas A202', 'is_aula' => false],
            
            // Gedung B (Lantai 1-2)
            ['gedung_id' => 2, 'code' => 'B101', 'name' => 'Ruang Kelas B101', 'is_aula' => false],
            ['gedung_id' => 2, 'code' => 'B102', 'name' => 'Ruang Kelas B102', 'is_aula' => false],
            ['gedung_id' => 2, 'code' => 'B201', 'name' => 'Ruang Kelas B201', 'is_aula' => false],
            ['gedung_id' => 2, 'code' => 'B202', 'name' => 'Ruang Kelas B202', 'is_aula' => false],
            
            // Gedung C (Lantai 1-2)
            ['gedung_id' => 3, 'code' => 'C101', 'name' => 'Ruang Kelas C101', 'is_aula' => false],
            ['gedung_id' => 3, 'code' => 'C102', 'name' => 'Ruang Kelas C102', 'is_aula' => false],
            ['gedung_id' => 3, 'code' => 'C201', 'name' => 'Ruang Kelas C201', 'is_aula' => false],
            ['gedung_id' => 3, 'code' => 'C202', 'name' => 'Ruang Kelas C202', 'is_aula' => false],
            
            // Gedung D (Lantai 1-2)
            ['gedung_id' => 4, 'code' => 'D101', 'name' => 'Ruang Kelas D101', 'is_aula' => false],
            ['gedung_id' => 4, 'code' => 'D102', 'name' => 'Ruang Kelas D102', 'is_aula' => false],
            ['gedung_id' => 4, 'code' => 'D201', 'name' => 'Ruang Kelas D201', 'is_aula' => false],
            ['gedung_id' => 4, 'code' => 'D202', 'name' => 'Ruang Kelas D202', 'is_aula' => false],
            
            // Gedung E (Lantai 1-3)
            ['gedung_id' => 5, 'code' => 'E101', 'name' => 'Ruang Kelas E101', 'is_aula' => false],
            ['gedung_id' => 5, 'code' => 'E102', 'name' => 'Ruang Kelas E102', 'is_aula' => false],
            ['gedung_id' => 5, 'code' => 'E201', 'name' => 'Ruang Kelas E201', 'is_aula' => false],
            ['gedung_id' => 5, 'code' => 'E202', 'name' => 'Ruang Kelas E202', 'is_aula' => false],
            ['gedung_id' => 5, 'code' => 'E301', 'name' => 'Ruang Kelas E301', 'is_aula' => false],
            ['gedung_id' => 5, 'code' => 'E302', 'name' => 'Ruang Kelas E302', 'is_aula' => false],
            
            // Gedung F (Hanya Aula)
            ['gedung_id' => 6, 'code' => 'AULA-F', 'name' => 'Aula Gedung F', 'is_aula' => true],
        ];

        foreach ($ruangs as $ruang) {
            Ruang::create($ruang);
        }
    }
}
