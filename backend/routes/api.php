<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use Illuminate\Support\Facades\Route;

// Test route to verify API is working
Route::get('/', function () {
    return response()->json([
        'message' => 'SchoolBooks API is working!',
        'version' => '1.0',
        'status' => 'success'
    ]);
});

$basePath = __DIR__ . '/api/';

$routeFiles = [
    'auth.api.php',
    'test.api.php',
    'mailer.api.php',
    'user.api.php',
    'cart.api.php',
    'category.api.php',
    'order.api.php',
    'product.api.php',
    'payment.api.php',
    'review.api.php',
    'state.api.php',
    'city.api.php',
    'notification.api.php',
    'tier.api.php',
    'card.api.php',
    'wishlist.api.php',
    'savedsearch.api.php'
];

foreach ($routeFiles as $file) {
    $fullPath = $basePath . $file;
    if (file_exists($fullPath)) {
        require_once $fullPath;
    } else {
        // Log missing files in production for debugging
        if (app()->environment('production')) {
            \Log::warning("Route file not found: " . $fullPath);
        }
    }
}