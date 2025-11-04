<?php

namespace App\Http\Controllers\Api;

use App\Models\Room;
use Illuminate\Http\JsonResponse;

class RoomController extends \App\Http\Controllers\Controller
{
    public function index(): JsonResponse
    {
        try {
            $rooms = Room::with(['building', 'cctvs'])->get();
            
            return response()->json($rooms);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch rooms',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getByBuilding($buildingId): JsonResponse
    {
        try {
            $rooms = Room::where('building_id', $buildingId)
                ->with(['building', 'cctvs'])
                ->get();
            
            return response()->json($rooms);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch rooms by building',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $room = Room::with(['building', 'cctvs'])->findOrFail($id);
            
            return response()->json($room);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Room not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch room',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
