<?php

use App\Http\Controllers\TierController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('tiers', [TierController::class, 'index']);
Route::get('tiers/{tier}', [TierController::class, 'show']);
Route::get('all-tiers', [TierController::class, 'getAll']);