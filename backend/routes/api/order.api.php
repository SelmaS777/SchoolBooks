<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->group(function () {
    // Standard CRUD routes
    Route::apiResource('orders', OrderController::class);
    
    // Custom purchase flow routes
    Route::post('orders/{order}/accept', [OrderController::class, 'accept']);
    Route::post('orders/{order}/reject', [OrderController::class, 'reject']);
    Route::post('orders/{order}/ship', [OrderController::class, 'ship']);
    Route::post('orders/{order}/complete', [OrderController::class, 'complete']);
});