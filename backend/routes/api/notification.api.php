<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->group(function () {
    // Custom routes (must come before resource routes)
    Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::post('notifications/{notification}/mark-read', [NotificationController::class, 'markAsRead']);
    
    // Standard resource routes
    Route::apiResource('notifications', NotificationController::class);
});