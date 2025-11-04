<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContactDataSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample contacts
        Contact::create([
            'email' => 'support@pertamina.com',
            'phone' => '+62 21 1234 5678',
            'whatsapp' => '+62 812 3456 7890',
            'instagram' => 'pertamina_official',
            'address' => 'Jl. Medan Merdeka Timur No. 1, Jakarta Pusat, DKI Jakarta 10110',
        ]);

        Contact::create([
            'email' => 'info@pertamina.com',
            'phone' => '+62 21 8765 4321',
            'whatsapp' => '+62 813 9876 5432',
            'instagram' => 'pertamina_care',
            'address' => 'Pertamina Tower, Jl. Jenderal Gatot Subroto Kav. 51, Jakarta Selatan',
        ]);
    }
}
