<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Serve all frontend requests through the proxy middleware
// This will handle pages, static assets, and API requests
Route::get('/{any?}', function () {
    // This will be handled by the ProxyToFrontend middleware
    return response('', 404);
})->where('any', '.*');

// Include API routes
require __DIR__ . '/api.php';
