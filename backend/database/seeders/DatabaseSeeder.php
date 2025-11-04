<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\ContactDataSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run the Role and Permission seeder
        $this->call(RolePermissionSeeder::class);

        // Run the Super Admin seeder
        $this->call(SuperAdminSeeder::class);

        // Run the User seeder
        $this->call(UserSeeder::class);

        // Run the Contact data seeder
        //$this->call(ContactDataSeeder::class);

        // CCTV Data Seeder is commented out - data should be added via Filament Admin Panel
        // $this->call(CctvDataSeeder::class);
    }
}
