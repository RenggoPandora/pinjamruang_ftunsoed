<?php

namespace Database\Seeders;

use App\Models\Organisasi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrganisasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organisasis = [
            ['code' => 'BEM', 'name' => 'Badan Eksekutif Mahasiswa'],
            ['code' => 'HIMASI', 'name' => 'Himpunan Mahasiswa Sistem Informasi'],
            ['code' => 'HIMATIF', 'name' => 'Himpunan Mahasiswa Teknik Informatika'],
            ['code' => 'HIMAKOM', 'name' => 'Himpunan Mahasiswa Ilmu Komputer'],
            ['code' => 'UKM-OLAHRAGA', 'name' => 'Unit Kegiatan Mahasiswa Olahraga'],
            ['code' => 'UKM-SENI', 'name' => 'Unit Kegiatan Mahasiswa Seni'],
        ];

        foreach ($organisasis as $organisasi) {
            Organisasi::create($organisasi);
        }
    }
}
