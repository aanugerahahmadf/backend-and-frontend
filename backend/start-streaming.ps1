# CCTV Streaming Script
Write-Host "Starting CCTV Streaming..." -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""

# Check if FFmpeg is installed
try {
    $ffmpegVersion = ffmpeg -version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "FFmpeg found. Starting streaming..." -ForegroundColor Green
        Write-Host ""
        Write-Host "Streaming from: rtsp://admin:Password.123@10.56.236.11:554/stream1" -ForegroundColor Yellow
        Write-Host "Streaming to: storage/streams/cctv.m3u8" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Press Ctrl+C to stop streaming" -ForegroundColor Cyan
        Write-Host ""

        # Start FFmpeg streaming
        ffmpeg -i rtsp://admin:Password.123@10.56.236.11:554/stream1 -c copy -f hls -hls_time 2 -hls_list_size 3 -hls_flags delete_segments -hls_segment_filename "storage/streams/cctv-%d.ts" storage/streams/cctv.m3u8
    } else {
        throw "FFmpeg not found"
    }
} catch {
    Write-Host "FFmpeg not found. Please install FFmpeg first." -ForegroundColor Red
    Write-Host ""
    Write-Host "1. Download FFmpeg from https://ffmpeg.org/download.html" -ForegroundColor Yellow
    Write-Host "2. Extract to C:\ffmpeg" -ForegroundColor Yellow
    Write-Host "3. Add C:\ffmpeg\bin to your PATH environment variable" -ForegroundColor Yellow
    Write-Host "4. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    pause
}
