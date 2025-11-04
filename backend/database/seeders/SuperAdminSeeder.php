<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin user with specified credentials
        $superAdmin = User::firstOrCreate([
            'email' => 'admin@pertamina.com',
        ], [
            'name' => 'Super Admin',
            'password' => bcrypt('admin123'),
        ]);

        // Assign Super Admin role
        $superAdminRole = Role::where('name', 'Super Admin')->first();
        if ($superAdminRole) {
            $superAdmin->assignRole($superAdminRole);
        }
    }
}
