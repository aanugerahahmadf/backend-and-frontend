<?php

use App\Http\Controllers\Api\BuildingController;
use App\Http\Controllers\Api\CctvController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\StatsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public API routes for frontend
Route::prefix('v1')->group(function () {
    // Stats for dashboard
    Route::get('/stats', [StatsController::class, 'index']);

    // Buildings
    Route::get('/buildings', [BuildingController::class, 'index']);
    Route::get('/buildings/{id}', [BuildingController::class, 'show']);

    // Rooms
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::get('/rooms/building/{buildingId}', [RoomController::class, 'getByBuilding']);
    Route::get('/rooms/{id}', [RoomController::class, 'show']);

    // CCTV
    Route::get('/cctvs', [CctvController::class, 'index']);
    Route::get('/cctvs/room/{roomId}', [CctvController::class, 'getByRoom']);
    Route::get('/cctvs/{id}', [CctvController::class, 'show']);
    Route::get('/cctvs/{id}/stream-url', [CctvController::class, 'getStreamUrl']);
    Route::get('/cctvs/{id}/stream', [CctvController::class, 'stream']);
    // HLS stream endpoint (requires FFmpeg setup)
    Route::get('/cctvs/{id}/stream.m3u8', function ($id) {
        $streamPath = storage_path("streams/cctv-{$id}.m3u8");
        if (file_exists($streamPath)) {
            return response()->file($streamPath, [
                'Content-Type' => 'application/vnd.apple.mpegurl',
                'Access-Control-Allow-Origin' => '*',
            ]);
        }
        return response()->json(['error' => 'Stream not found. Please ensure FFmpeg is running.'], 404);
    });

    // Contacts
    Route::get('/contacts', [ContactController::class, 'index']);
});

