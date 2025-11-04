@echo off
echo Starting CCTV Streaming...
echo ========================
echo.

echo Checking if FFmpeg is installed...
ffmpeg -version >nul 2>&1
if %errorLevel% == 0 (
    echo FFmpeg found. Starting streaming...
    echo.
    echo Streaming from: rtsp://admin:Password.123@10.56.236.11:554/stream1
    echo Streaming to: storage/streams/cctv.m3u8
    echo.
    echo Press Ctrl+C to stop streaming
    echo.

    ffmpeg -i rtsp://admin:Password.123@10.56.236.11:554/stream1 -c copy -f hls -hls_time 2 -hls_list_size 3 -hls_flags delete_segments -hls_segment_filename "storage/streams/cctv-%%d.ts" storage/streams/cctv.m3u8
) else (
    echo FFmpeg not found. Please install FFmpeg first.
    echo.
    echo 1. Download FFmpeg from https://ffmpeg.org/download.html
    echo 2. Extract to C:\ffmpeg
    echo 3. Add C:\ffmpeg\bin to your PATH environment variable
    echo 4. Run this script again
    echo.
    pause
)
