<?php

namespace Database\Seeders;

use App\Models\Building;
use App\Models\Cctv;
use App\Models\Room;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CctvDataSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample buildings
        $buildings = [
            [
                'name' => 'Building A',
                'latitude' => -6.321,
                'longitude' => 108.234,
                'marker_icon_url' => null,
            ],
            [
                'name' => 'Building B',
                'latitude' => -6.325,
                'longitude' => 108.238,
                'marker_icon_url' => null,
            ],
            [
                'name' => 'Building C',
                'latitude' => -6.329,
                'longitude' => 108.242,
                'marker_icon_url' => null,
            ],
        ];

        foreach ($buildings as $buildingData) {
            $building = Building::create($buildingData);

            // Create sample rooms for each building
            $rooms = [
                [
                    'name' => 'Room 101',
                    'building_id' => $building->id,
                    'latitude' => $building->latitude + 0.0005,
                    'longitude' => $building->longitude + 0.0005,
                    'marker_icon_url' => null,
                ],
                [
                    'name' => 'Room 102',
                    'building_id' => $building->id,
                    'latitude' => $building->latitude + 0.0008,
                    'longitude' => $building->longitude + 0.0008,
                    'marker_icon_url' => null,
                ],
            ];

            foreach ($rooms as $roomData) {
                $room = Room::create($roomData);

                // Create sample CCTVs for each room
                $cctvs = [
                    [
                        'name' => "CCTV {$room->name}-1",
                        'building_id' => $building->id,
                        'room_id' => $room->id,
                        'username' => 'admin',
                        'password' => 'Password.123',
                        'ip_address' => "192.168.1.{$building->id}{$room->id}1",
                    ],
                    [
                        'name' => "CCTV {$room->name}-2",
                        'building_id' => $building->id,
                        'room_id' => $room->id,
                        'username' => 'admin',
                        'password' => 'Password.123',
                        'ip_address' => "192.168.1.{$building->id}{$room->id}2",
                    ],
                ];

                foreach ($cctvs as $cctvData) {
                    Cctv::create($cctvData);
                }
            }
        }

        // Create sample contacts
        \App\Models\Contact::create([
            'email' => 'contact@kilangpertamina.com',
            'phone' => '+62 234 567890',
            'whatsapp' => '+62 812 3456 7890',
            'instagram' => '@kilangpertamina',
            'address' => 'Refinery Unit VI Balongan, Indramayu, Jawa Barat 45281',
        ]);
    }
}