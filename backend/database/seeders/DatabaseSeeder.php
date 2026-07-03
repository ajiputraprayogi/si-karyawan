<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Karyawan;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Buat Administrator default
        User::updateOrCreate(
            ['email' => 'admin@karyawan.com'],
            [
                'name' => 'Admin Karyawan',
                'password' => Hash::make('password123'),
            ]
        );

        // Buat data dummy karyawan
        $karyawans = [
            [
                'nip' => '1995021201',
                'nama' => 'Budi Santoso',
                'jabatan' => 'Software Engineer',
                'departemen' => 'Teknologi Informasi',
                'email' => 'budi.santoso@karyawan.com',
                'telepon' => '081234567890',
                'tanggal_masuk' => '2020-03-01',
                'status_aktif' => true,
            ],
            [
                'nip' => '1996081402',
                'nama' => 'Siti Aminah',
                'jabatan' => 'HR Specialist',
                'departemen' => 'Human Resources',
                'email' => 'siti.aminah@karyawan.com',
                'telepon' => '081298765432',
                'tanggal_masuk' => '2021-06-15',
                'status_aktif' => true,
            ],
            [
                'nip' => '1993110503',
                'nama' => 'Andi Wijaya',
                'jabatan' => 'Financial Analyst',
                'departemen' => 'Keuangan',
                'email' => 'andi.wijaya@karyawan.com',
                'telepon' => '081345671234',
                'tanggal_masuk' => '2019-10-10',
                'status_aktif' => true,
            ],
            [
                'nip' => '1997042504',
                'nama' => 'Rina Amalia',
                'jabatan' => 'UI/UX Designer',
                'departemen' => 'Teknologi Informasi',
                'email' => 'rina.amalia@karyawan.com',
                'telepon' => '081223344556',
                'tanggal_masuk' => '2022-01-10',
                'status_aktif' => true,
            ],
            [
                'nip' => '1992010105',
                'nama' => 'Eko Prasetyo',
                'jabatan' => 'Marketing Manager',
                'departemen' => 'Pemasaran',
                'email' => 'eko.prasetyo@karyawan.com',
                'telepon' => '081122334455',
                'tanggal_masuk' => '2018-05-01',
                'status_aktif' => false,
            ]
        ];

        foreach ($karyawans as $karyawan) {
            Karyawan::updateOrCreate(
                ['nip' => $karyawan['nip']],
                $karyawan
            );
        }
    }
}
