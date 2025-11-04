<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions if they don't already exist
        $permissions = [
            'view buildings',
            'create buildings',
            'update buildings',
            'delete buildings',
            'view rooms',
            'create rooms',
            'update rooms',
            'delete rooms',
            'view cctvs',
            'create cctvs',
            'update cctvs',
            'delete cctvs',
            'view contacts',
            'create contacts',
            'update contacts',
            'delete contacts',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles if they don't already exist
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $userInterfaceRole = Role::firstOrCreate(['name' => 'User Interface', 'guard_name' => 'web']);

        // Assign all permissions to Super Admin
        $superAdminRole->syncPermissions($permissions);

        // Assign only view permissions to User Interface
        $viewPermissions = array_filter($permissions, function ($permission) {
            return strpos($permission, 'view') === 0;
        });

        $userInterfaceRole->syncPermissions($viewPermissions);
    }
}
