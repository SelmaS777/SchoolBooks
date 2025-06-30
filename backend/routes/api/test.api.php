<?php

use App\Http\Controllers\TestController;

Route::post('/test-notification', [TestController::class, 'testNotification'])
    ->middleware('auth:api');