<?php

use App\Http\Controllers\CityController;
use Illuminate\Support\Facades\Route;

// Public routes (no authentication required)
Route::get('cities', [CityController::class, 'index']);
Route::get('cities/{city}', [CityController::class, 'show']);
Route::get('all-cities', [CityController::class, 'getAll']);

// Protected routes (authentication required)
Route::middleware('auth:api')->group(function () {
    Route::post('cities', [CityController::class, 'store']);
    Route::put('cities/{city}', [CityController::class, 'update']);
    Route::delete('cities/{city}', [CityController::class, 'destroy']);
});