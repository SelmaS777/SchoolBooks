<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $requeuse OTPHP\TOTP;st->user();
// });

require_once 'api/auth.api.php';
require_once 'api/test.api.php';
require_once 'api/mailer.api.php';
require_once 'api/user.api.php';
require_once 'api/cart.api.php';
require_once 'api/category.api.php';
require_once 'api/order.api.php';
require_once 'api/product.api.php';
require_once 'api/payment.api.php';
require_once 'api/review.api.php';
require_once 'api/state.api.php';
require_once 'api/city.api.php';
require_once 'api/notification.api.php';
require_once 'api/tier.api.php';
require_once 'api/card.api.php';
require_once 'api/wishlist.api.php';
require_once 'api/savedsearch.api.php';