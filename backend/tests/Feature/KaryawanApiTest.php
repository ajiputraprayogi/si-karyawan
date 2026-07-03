<?php

namespace Tests\Feature;

use App\Models\Karyawan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class KaryawanApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::create([
            'name' => 'Admin Test',
            'email' => 'admin@test.com',
            'password' => Hash::make('password123'),
        ]);
    }

    public function test_login_successful(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'access_token',
                'token_type',
                'user' => ['id', 'name', 'email']
            ]);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.com',
            'password' => 'wrong_password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_cannot_access_protected_routes_without_token(): void
    {
        $response = $this->getJson('/api/karyawan');
        $response->assertStatus(401);
    }

    public function test_can_get_employee_list(): void
    {
        Karyawan::create([
            'nip' => '12345',
            'nama' => 'John Doe',
            'jabatan' => 'Developer',
            'departemen' => 'IT',
            'email' => 'john@test.com',
            'telepon' => '08123',
            'tanggal_masuk' => '2023-01-01',
            'status_aktif' => true,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/karyawan');

        $response->assertStatus(200)
            ->assertJsonFragment(['nama' => 'John Doe']);
    }

    public function test_can_create_employee(): void
    {
        $employeeData = [
            'nip' => '54321',
            'nama' => 'Jane Smith',
            'jabatan' => 'Designer',
            'departemen' => 'Design',
            'email' => 'jane@test.com',
            'telepon' => '08321',
            'tanggal_masuk' => '2023-02-01',
            'status_aktif' => true,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/karyawan', $employeeData);

        $response->assertStatus(201)
            ->assertJsonFragment(['nama' => 'Jane Smith']);

        $this->assertDatabaseHas('karyawans', ['nip' => '54321']);
    }

    public function test_can_show_employee_detail(): void
    {
        $karyawan = Karyawan::create([
            'nip' => '99999',
            'nama' => 'Alice',
            'jabatan' => 'HR',
            'departemen' => 'HRD',
            'email' => 'alice@test.com',
            'telepon' => '08999',
            'tanggal_masuk' => '2023-03-01',
            'status_aktif' => true,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/karyawan/{$karyawan->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['nama' => 'Alice']);
    }

    public function test_can_update_employee(): void
    {
        $karyawan = Karyawan::create([
            'nip' => '88888',
            'nama' => 'Bob',
            'jabatan' => 'Finance',
            'departemen' => 'Finance',
            'email' => 'bob@test.com',
            'telepon' => '08888',
            'tanggal_masuk' => '2023-04-01',
            'status_aktif' => true,
        ]);

        $updateData = [
            'nip' => '88888',
            'nama' => 'Bob Updated',
            'jabatan' => 'Finance Specialist',
            'departemen' => 'Finance',
            'email' => 'bob.new@test.com',
            'telepon' => '0888899',
            'tanggal_masuk' => '2023-04-01',
            'status_aktif' => false,
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/karyawan/{$karyawan->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonFragment(['nama' => 'Bob Updated', 'status_aktif' => false]);

        $this->assertDatabaseHas('karyawans', ['nama' => 'Bob Updated']);
    }

    public function test_can_delete_employee(): void
    {
        $karyawan = Karyawan::create([
            'nip' => '77777',
            'nama' => 'Charlie',
            'jabatan' => 'Security',
            'departemen' => 'General Affairs',
            'email' => 'charlie@test.com',
            'telepon' => '08777',
            'tanggal_masuk' => '2023-05-01',
            'status_aktif' => true,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/karyawan/{$karyawan->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('karyawans', ['id' => $karyawan->id]);
    }

    public function test_registration_successful(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'New User',
            'email' => 'newuser@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'message' => 'Registrasi berhasil. Silakan login.',
            ])
            ->assertJsonStructure([
                'status',
                'message',
                'user' => ['id', 'name', 'email']
            ]);

        $this->assertDatabaseHas('users', ['email' => 'newuser@test.com']);
    }

    public function test_registration_fails_due_to_validation(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'New User',
            'email' => 'newuser@test.com',
            'password' => 'password123',
            'password_confirmation' => 'different_password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }
}
