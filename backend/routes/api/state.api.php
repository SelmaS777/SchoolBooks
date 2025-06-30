<?php

use App\Http\Controllers\StateController;
use Illuminate\Support\Facades\Route;

// Public routes (no authentication required)
Route::get('states', [StateController::class, 'index']);
Route::get('states/{state}', [StateController::class, 'show']);
Route::get('all-states', [StateController::class, 'getAll']);

// Protected routes (authentication required)
Route::middleware('auth:api')->group(function () {
    Route::post('states', [StateController::class, 'store']);
    Route::put('states/{state}', [StateController::class, 'update']);
    Route::delete('states/{state}', [StateController::class, 'destroy']);
});