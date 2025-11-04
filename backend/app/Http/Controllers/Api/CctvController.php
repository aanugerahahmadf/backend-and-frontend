<?php

namespace App\Http\Controllers\Api;

use App\Models\Cctv;
use Illuminate\Http\JsonResponse;

class CctvController extends \App\Http\Controllers\Controller
{
    public function index(): JsonResponse
    {
        try {
            $cctvs = Cctv::with(['building', 'room'])->get();
            
            return response()->json($cctvs);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch CCTVs',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getByRoom($roomId): JsonResponse
    {
        try {
            $cctvs = Cctv::where('room_id', $roomId)
                ->with(['building', 'room'])
                ->get();
            
            return response()->json($cctvs);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch CCTVs by room',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $cctv = Cctv::with(['building', 'room'])->findOrFail($id);
            
            return response()->json($cctv);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'CCTV not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch CCTV',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getStreamUrl($id): JsonResponse
    {
        try {
            $cctv = Cctv::findOrFail($id);
            
            // Generate RTSP stream URL
            // Format: rtsp://username:password@ip_address:port/stream_path
            // Common RTSP paths: /stream1, /main, /cam/realmonitor, /h264
            
            // Try different RTSP paths for compatibility
            $rtspPaths = [
                '/stream1',
                '/main',
                '/cam/realmonitor',
                '/h264',
                '/videoMain',
                '/live',
            ];
            
            $rtspUrl = sprintf(
                'rtsp://%s:%s@%s:554%s',
                urlencode($cctv->username),
                urlencode($cctv->password),
                $cctv->ip_address,
                $rtspPaths[0] // Default to /stream1
            );
            
            // Generate HLS stream URL (requires FFmpeg streaming server)
            // In production, use FFmpeg to convert RTSP to HLS
            // Example: ffmpeg -i rtsp://... -c copy -f hls -hls_time 2 -hls_list_size 3 -hls_flags delete_segments /path/to/stream.m3u8
            $hlsUrl = url("/api/v1/cctvs/{$id}/stream.m3u8");
            
            // Generate HTTP stream URL (direct if CCTV supports HTTP)
            $httpStreamUrl = sprintf(
                'http://%s:%s@%s/video.cgi',
                urlencode($cctv->username),
                urlencode($cctv->password),
                $cctv->ip_address
            );
            
            // Alternative: RTSP over HTTP using proxy
            $rtspProxyUrl = url("/api/v1/cctvs/{$id}/rtsp-proxy");
            
            return response()->json([
                'rtsp_url' => $rtspUrl,
                'hls_url' => $hlsUrl,
                'http_stream_url' => $httpStreamUrl,
                'rtsp_proxy_url' => $rtspProxyUrl,
                'ip_address' => $cctv->ip_address,
                'username' => $cctv->username,
                'note' => 'Use hls_url for browser playback, rtsp_url for direct RTSP access'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'CCTV not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate stream URL',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Stream CCTV via RTSP proxy (for browser compatibility)
     * This endpoint proxies RTSP stream for web playback
     */
    public function stream($id)
    {
        try {
            $cctv = Cctv::findOrFail($id);
            
            // Generate RTSP URL
            $rtspUrl = sprintf(
                'rtsp://%s:%s@%s:554/stream1',
                urlencode($cctv->username),
                urlencode($cctv->password),
                $cctv->ip_address
            );
            
            // For now, return instructions
            // In production, implement FFmpeg streaming or use a streaming server
            return response()->json([
                'message' => 'Streaming endpoint',
                'rtsp_url' => $rtspUrl,
                'instructions' => [
                    '1. Install FFmpeg on server',
                    '2. Use FFmpeg to convert RTSP to HLS',
                    '3. Serve HLS stream via /api/v1/cctvs/{id}/stream.m3u8',
                    'Alternative: Use Node Media Server or similar streaming service'
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to stream CCTV',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
