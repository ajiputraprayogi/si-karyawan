<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Karyawan;
use Illuminate\Validation\Rule;

class KaryawanController extends Controller
{
    public function index(Request $request)
    {
        $query = Karyawan::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%")
                  ->orWhere('jabatan', 'like', "%{$search}%")
                  ->orWhere('departemen', 'like', "%{$search}%");
            });
        }

        if ($request->has('status_aktif')) {
            $status = $request->boolean('status_aktif');
            $query->where('status_aktif', $status);
        }

        // Ambil data karyawan terurut berdasarkan nama secara naik (asc)
        $karyawans = $query->orderBy('nama', 'asc')->paginate($request->input('per_page', 10));

        return response()->json([
            'status' => 'success',
            'data' => $karyawans,
            'stats' => [
                'total' => Karyawan::count(),
                'aktif' => Karyawan::where('status_aktif', true)->count(),
                'nonaktif' => Karyawan::where('status_aktif', false)->count(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nip' => 'required|string|unique:karyawans,nip',
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'departemen' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telepon' => 'nullable|string|max:20',
            'tanggal_masuk' => 'required|date',
            'status_aktif' => 'nullable|boolean',
        ]);

        if (!isset($validatedData['status_aktif'])) {
            $validatedData['status_aktif'] = true;
        }

        $karyawan = Karyawan::create($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil ditambahkan',
            'data' => $karyawan
        ], 201);
    }

    public function show($id)
    {
        $karyawan = Karyawan::find($id);

        if (!$karyawan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data karyawan tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $karyawan
        ]);
    }

    public function update(Request $request, $id)
    {
        $karyawan = Karyawan::find($id);

        if (!$karyawan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data karyawan tidak ditemukan'
            ], 404);
        }

        $validatedData = $request->validate([
            'nip' => [
                'required',
                'string',
                Rule::unique('karyawans', 'nip')->ignore($karyawan->id),
            ],
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'departemen' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'telepon' => 'nullable|string|max:20',
            'tanggal_masuk' => 'required|date',
            'status_aktif' => 'required|boolean',
        ]);

        $karyawan->update($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil diperbarui',
            'data' => $karyawan
        ]);
    }

    public function destroy($id)
    {
        $karyawan = Karyawan::find($id);

        if (!$karyawan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data karyawan tidak ditemukan'
            ], 404);
        }

        $karyawan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil dihapus'
        ]);
    }
}
