<?php

use App\Http\Controllers\CartController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->group(function () {
    // User-centric cart routes
    Route::get('/carts', [CartController::class, 'index']); // Get user's cart items with full product details
    Route::get('/carts/count', [CartController::class, 'count']); // Get cart items count
    Route::post('/carts/add-product', [CartController::class, 'addProduct']); // Add product to cart
    Route::delete('/carts/remove-product/{product_id}', [CartController::class, 'removeProduct']); // Remove product from cart
    Route::delete('/carts/clear', [CartController::class, 'clear']); // Clear entire cart
    
    // Optional: Keep for specific cart item operations (if needed)
    Route::get('/carts/{cart}', [CartController::class, 'show']); // Get specific cart item
    Route::delete('/carts/{cart}', [CartController::class, 'destroy']); // Delete specific cart item
});