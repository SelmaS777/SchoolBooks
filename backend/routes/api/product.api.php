<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// Public routes (for viewing products)
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{product}', [ProductController::class, 'show']);

// Protected routes (for creating, updating, deleting products)
Route::middleware('auth:api')->group(function () {
    Route::post('products', [ProductController::class, 'store']);
    Route::put('products/{product}', [ProductController::class, 'update']);
    Route::delete('products/{product}', [ProductController::class, 'destroy']);
});