<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Karyawan extends Model
{
    use HasFactory;

    protected $fillable = [
        'nip',
        'nama',
        'jabatan',
        'departemen',
        'email',
        'telepon',
        'tanggal_masuk',
        'status_aktif',
    ];

    protected $casts = [
        'tanggal_masuk' => 'date',
        'status_aktif' => 'boolean',
    ];
}
