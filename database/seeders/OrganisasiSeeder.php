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
            ['code' => 'BEM FT', 'name' => 'Badan Eksekutif Mahasiswa'],
            ['code' => 'DLM FT', 'name' => 'Dewan Legislatif Mahasiswa'],
            ['code' => 'HMTI', 'name' => 'Himpunan Mahasiswa Teknik Industri'],
            ['code' => 'HMIFF', 'name' => 'Himpunan Mahasiswa Informatika'],
            ['code' => 'HMTS', 'name' => 'Himpunan Mahasiswa Teknik Sipil'],
            ['code' => 'HMTE', 'name' => 'Himpunan Mahasiswa Teknik Elektro'],
            ['code' => 'HMTG', 'name' => 'Himpunan Mahasiswa Teknik Geologi'],
            ['code' => 'SENIOR', 'name' => 'Unit Kegiatan Seni dan Olahraga'],
            ['code' => 'SEEO', 'name' => 'Soedirman Enggineering Entrepreneurship Organization'],
            ['code' => 'TN', 'name' => 'Titik Nol'],
            ['code' => 'EEC', 'name' => 'Engineering English Club'],
            ['code' => 'SALMAN', 'name' => 'SALMAN FT UNSOED'],
        ];

        foreach ($organisasis as $organisasi) {
            Organisasi::create($organisasi);
        }
    }
}
