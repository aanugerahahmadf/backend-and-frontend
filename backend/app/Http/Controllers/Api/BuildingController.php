<?php

namespace App\Http\Controllers\Api;

use App\Models\Building;
use Illuminate\Http\JsonResponse;

class BuildingController extends \App\Http\Controllers\Controller
{
    public function index(): JsonResponse
    {
        try {
            $buildings = Building::with(['rooms', 'rooms.cctvs'])->get();
            
            return response()->json($buildings);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch buildings',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $building = Building::with(['rooms', 'rooms.cctvs'])->findOrFail($id);
            
            return response()->json($building);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Building not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch building',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
