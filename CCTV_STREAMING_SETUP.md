# CCTV Streaming Setup Guide

## Cara Setup CCTV Streaming untuk IP 10.56.236.11

### Spesifikasi CCTV
- **IP Address:** 10.56.236.11
- **Username:** admin
- **Password:** Password.123
- **RTSP Port:** 554 (default)
- **RTSP Path:** /stream1 (umumnya)

### RTSP URL Format
```
rtsp://admin:Password.123@10.56.236.11:554/stream1
```

## Opsi 1: Menggunakan FFmpeg untuk Convert RTSP ke HLS (Recommended)

### 1. Install FFmpeg di Server

**Windows:**
```bash
# Download FFmpeg dari https://ffmpeg.org/download.html
# Extract dan tambahkan ke PATH
```

**Linux/Ubuntu:**
```bash
sudo apt update
sudo apt install ffmpeg -y
```

### 2. Convert RTSP ke HLS

```bash
ffmpeg -i rtsp://admin:Password.123@10.56.236.11:554/stream1 \
  -c copy \
  -f hls \
  -hls_time 2 \
  -hls_list_size 3 \
  -hls_flags delete_segments \
  -hls_segment_filename "storage/streams/cctv-%d.ts" \
  storage/streams/cctv.m3u8
```

### 3. Setup Laravel Route untuk Serve HLS

Laravel route sudah di-setup di `routes/api.php`:
```php
Route::get('/api/v1/cctvs/{id}/stream.m3u8', function ($id) {
    $streamPath = storage_path("streams/cctv-{$id}.m3u8");
    if (file_exists($streamPath)) {
        return response()->file($streamPath, [
            'Content-Type' => 'application/vnd.apple.mpegurl',
            'Access-Control-Allow-Origin' => '*',
        ]);
    }
    return response()->json(['error' => 'Stream not found. Please ensure FFmpeg is running.'], 404);
});
```

## Opsi 2: Menggunakan Node Media Server

### 1. Install Node Media Server

```bash
npm install node-media-server
```

### 2. Setup Streaming Server

Buat file `streaming-server.js`:
```javascript
const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    mediaroot: './media',
    allow_origin: '*'
  },
  relay: {
    ffmpeg: '/usr/local/bin/ffmpeg',
    tasks: []
  }
};

const nms = new NodeMediaServer(config);
nms.run();
```

## Opsi 3: Direct HTTP Stream (Jika CCTV Support)

Jika CCTV mendukung HTTP streaming langsung, gunakan:
```
http://admin:Password.123@10.56.236.11/video.cgi
```

## Setup di Backend Laravel

### Update CctvController

File sudah di-update di `backend/app/Http/Controllers/Api/CctvController.php` untuk handle streaming.

### Test RTSP Connection

```bash
# Test RTSP stream dengan VLC atau FFplay
ffplay rtsp://admin:Password.123@10.56.236.11:554/stream1
```

## Frontend Setup

### HLS.js sudah di-install

Frontend sudah menggunakan HLS.js untuk play HLS stream di browser.

### Komponen LiveStreamPlayer

Komponen `LiveStreamPlayer` sudah dibuat dan terintegrasi di:
- Maps page (modal live stream)
- PlaylistCctv page (modal live stream)

## Troubleshooting

### Error: Network error
- Pastikan CCTV IP dapat diakses dari server
- Check firewall rules untuk port 554
- Verify RTSP path (/stream1, /main, /h264, dll)

### Error: Media error
- Check kodec CCTV (umumnya H.264)
- Pastikan format stream compatible dengan browser
- Try different RTSP paths

### Stream tidak muncul
1. Test RTSP dengan VLC: `rtsp://admin:Password.123@10.56.236.11:554/stream1`
2. Jika VLC bisa play, masalah di konversi
3. Pastikan FFmpeg terinstall dan running
4. Check permission folder `storage/streams`

## Quick Start Command

Setelah install FFmpeg, jalankan:

```bash
# Convert RTSP to HLS (background process)
nohup ffmpeg -i rtsp://admin:Password.123@10.56.236.11:554/stream1 \
  -c copy -f hls -hls_time 2 -hls_list_size 3 -hls_flags delete_segments \
  storage/streams/cctv-1.m3u8 > /dev/null 2>&1 &
```

Stream akan tersedia di: `http://127.0.0.1:8000/api/v1/cctvs/1/stream.m3u8`

## Setup Script

Helper script telah dibuat untuk mempermudah setup:
- `setup-ffmpeg.bat` - Panduan instalasi FFmpeg
- `start-streaming.bat` - Script untuk memulai streaming (Windows)
- `start-streaming.ps1` - Script untuk memulai streaming (PowerShell)