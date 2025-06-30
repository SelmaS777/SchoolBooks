<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Constants\AuthRoutes;


Route::group(
    [
        'prefix' => 'auth'
    ],
    function () {
        Route::post('/login', [AuthController::class, AuthRoutes::LOGIN]);
        Route::post('/register', [AuthController::class, AuthRoutes::REGISTER]);

        Route::post('/forgot-password', [AuthController::class, AuthRoutes::FORGOT_PASSWORD]);
        Route::post('/reset-password', [AuthController::class, AuthRoutes::RESET_PASSWORD]);
         Route::post('/test-email', [AuthController::class, 'testEmail']);
        
        // Protected routes
        Route::middleware('auth:api')->group(function() {
            Route::post('/logout', [AuthController::class, AuthRoutes::LOGOUT]);
            Route::get('/me', [AuthController::class, 'me']); 
            Route::get('/validate-token', [AuthController::class, 'validateToken']);
            Route::post('/refresh', [AuthController::class, 'refresh']);
        });
    }
);