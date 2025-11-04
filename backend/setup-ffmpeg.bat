@echo off
echo CCTV Streaming Setup Script
echo ==========================
echo This script will help you set up FFmpeg for CCTV streaming.
echo.

echo 1. Downloading FFmpeg...
echo Please download FFmpeg from https://ffmpeg.org/download.html
echo Choose the Windows version and extract it to C:\ffmpeg
echo.
echo 2. After extracting FFmpeg, add it to your PATH:
echo    - Open System Properties
echo    - Go to Advanced tab
echo    - Click Environment Variables
echo    - Add C:\ffmpeg\bin to your PATH variable
echo.
echo 3. Test FFmpeg installation:
echo    Open a new command prompt and run: ffmpeg -version
echo.
echo 4. To start streaming, run this command:
echo    ffmpeg -i rtsp://admin:Password.123@10.56.236.11:554/stream1 -c copy -f hls -hls_time 2 -hls_list_size 3 -hls_flags delete_segments -hls_segment_filename "storage/streams/cctv-%%d.ts" storage/streams/cctv.m3u8
echo.
echo Press any key to continue...
pause >nul
