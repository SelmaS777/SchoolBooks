<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->apiResource('users', UserController::class);
Route::get('users/{user}/selling-products', [UserController::class, 'sellingProducts']);
Route::get('users/{user}/bought-products', [UserController::class, 'boughtProducts']);
Route::get('users/{user}/sold-products', [UserController::class, 'soldProducts']);
Route::middleware('auth:api')->put('/profile', [UserController::class, 'updateProfile']);

// Tier management routes
Route::middleware('auth:api')->group(function () {
    Route::put('/users/{user}/tier', [UserController::class, 'updateTier']);
    Route::put('/profile/tier', [UserController::class, 'updateProfileTier']);
    Route::get('/profile/listing-status', [UserController::class, 'getListingStatus']);
});