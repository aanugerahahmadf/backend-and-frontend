<?php
// Simple script to test if streaming is working
echo "Testing CCTV Streaming Setup\n";
echo "==========================\n\n";

// Check if storage/streams directory exists
if (!is_dir('storage/streams')) {
    echo "ERROR: storage/streams directory does not exist\n";
    echo "Please create it first: mkdir storage/streams\n";
    exit(1);
}

// Check if test stream file exists
$streamFile = 'storage/streams/cctv-1.m3u8';
if (!file_exists($streamFile)) {
    echo "ERROR: Stream file not found at $streamFile\n";
    echo "Please create a test stream file first\n";
    exit(1);
}

// Read and display the stream file
echo "Stream file contents:\n";
echo file_get_contents($streamFile);
echo "\n\n";

// Test the Laravel route
echo "Testing Laravel route...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:8000/api/v1/cctvs/1/stream.m3u8");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
$response = curl_exec($ch);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header = substr($response, 0, $header_size);
$body = substr($response, $header_size);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status Code: $http_code\n";
if ($http_code == 200) {
    echo "SUCCESS: Laravel route is working correctly\n";
    echo "Response headers:\n$header\n";
    echo "Response body:\n$body\n";
} else {
    echo "ERROR: Laravel route returned HTTP $http_code\n";
    echo "Response headers:\n$header\n";
    echo "Response body:\n$body\n";
}

echo "\nStreaming setup test completed.\n";
?>
