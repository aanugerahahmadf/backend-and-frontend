<?php

namespace App\Http\Controllers\Api;

use App\Models\Building;
use App\Models\Cctv;
use App\Models\Room;
use Illuminate\Http\JsonResponse;

class StatsController extends \App\Http\Controllers\Controller
{
    public function index(): JsonResponse
    {
        try {
            return response()->json([
                'total_buildings' => Building::count(),
                'total_rooms' => Room::count(),
                'total_cctvs' => Cctv::count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
