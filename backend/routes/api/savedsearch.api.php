<?php

use App\Http\Controllers\SavedSearchController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->group(function () {
    // User-centric saved search routes
    Route::get('/saved-searches', [SavedSearchController::class, 'index']); // Get user's saved searches
    Route::get('/saved-searches/count', [SavedSearchController::class, 'count']); // Get saved searches count
    Route::post('/saved-searches', [SavedSearchController::class, 'store']); // Save a search query
    Route::get('/saved-searches/{savedSearch}', [SavedSearchController::class, 'show']); // Get specific saved search
    Route::put('/saved-searches/{savedSearch}', [SavedSearchController::class, 'update']); // Update saved search name
    Route::delete('/saved-searches/{savedSearch}', [SavedSearchController::class, 'destroy']); // Delete saved search
    Route::delete('/saved-searches/clear/all', [SavedSearchController::class, 'clear']); // Clear all saved searches
});