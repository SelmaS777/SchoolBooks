<?php

use App\Http\Controllers\CardController;
use Illuminate\Support\Facades\Route;

// All credit card routes require authentication
Route::middleware('auth:api')->group(function () {
    Route::get('credit-cards', [CardController::class, 'index']);
    Route::post('credit-cards', [CardController::class, 'store']);
    Route::get('credit-cards/{creditCard}', [CardController::class, 'show']);
    Route::put('credit-cards/{creditCard}', [CardController::class, 'update']);
    Route::delete('credit-cards/{creditCard}', [CardController::class, 'destroy']);
    Route::post('credit-cards/{creditCard}/make-default', [CardController::class, 'makeDefault']);
});