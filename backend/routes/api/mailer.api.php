<?php

use App\Constants\MailerRotes;
use App\Http\Controllers\MailerController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->post('/send-email', [MailerController::class, MailerRotes::SEND_EMAIL]);