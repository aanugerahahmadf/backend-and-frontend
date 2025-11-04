<?php

namespace App\Services;

use App\Models\Building;
use App\Models\Room;
use App\Models\Cctv;
use App\Models\Contact;

class FrontendService
{
    /**
     * Get statistics for the dashboard
     *
     * @return array
     */
    public function getStats(): array
    {
        return [
            'total_buildings' => Building::count(),
            'total_rooms' => Room::count(),
            'total_cctvs' => Cctv::count(),
        ];
    }

    /**
     * Get all buildings with their rooms
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getBuildings()
    {
        return Building::with('rooms.cctvs')->get();
    }

    /**
     * Get a specific building with its rooms
     *
     * @param int $id
     * @return \App\Models\Building|null
     */
    public function getBuilding(int $id)
    {
        return Building::with('rooms.cctvs')->find($id);
    }

    /**
     * Get all rooms with their building and CCTVs
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRooms()
    {
        return Room::with('building', 'cctvs')->get();
    }

    /**
     * Get rooms by building ID
     *
     * @param int $buildingId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRoomsByBuilding(int $buildingId)
    {
        return Room::with('building', 'cctvs')
            ->where('building_id', $buildingId)
            ->get();
    }

    /**
     * Get a specific room with its building and CCTVs
     *
     * @param int $id
     * @return \App\Models\Room|null
     */
    public function getRoom(int $id)
    {
        return Room::with('building', 'cctvs')->find($id);
    }

    /**
     * Get all CCTVs with their building and room
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getCctvs()
    {
        return Cctv::with('building', 'room')->get();
    }

    /**
     * Get CCTVs by room ID
     *
     * @param int $roomId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getCctvsByRoom(int $roomId)
    {
        return Cctv::with('building', 'room')
            ->where('room_id', $roomId)
            ->get();
    }

    /**
     * Get a specific CCTV with its building and room
     *
     * @param int $id
     * @return \App\Models\Cctv|null
     */
    public function getCctv(int $id)
    {
        return Cctv::with('building', 'room')->find($id);
    }

    /**
     * Get all contacts
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getContacts()
    {
        return Contact::all();
    }
}
