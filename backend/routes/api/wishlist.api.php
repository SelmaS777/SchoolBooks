<?php

use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->group(function () {
    // User-centric wishlist routes
    Route::get('/wishlist', [WishlistController::class, 'index']); // Get user's wishlist items with full product details
    Route::get('/wishlist/count', [WishlistController::class, 'count']); // Get wishlist items count
    Route::post('/wishlist/add-product', [WishlistController::class, 'addProduct']); // Add product to wishlist
    Route::delete('/wishlist/remove-product/{product_id}', [WishlistController::class, 'removeProduct']); // Remove product from wishlist
    Route::delete('/wishlist/clear', [WishlistController::class, 'clear']); // Clear entire wishlist
    
    // Optional: Keep for specific wishlist item operations (if needed)
    Route::get('/wishlist/{wishlist}', [WishlistController::class, 'show']); // Get specific wishlist item
    Route::delete('/wishlist/{wishlist}', [WishlistController::class, 'destroy']); // Delete specific wishlist item
});