<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('card_type')->nullable(); // Visa, MasterCard, etc.
            $table->string('last_four', 4); // Last 4 digits only
            $table->string('cardholder_name');
            $table->string('expiry_month', 2);
            $table->string('expiry_year', 4);
            $table->string('payment_token')->nullable(); // Token from payment processor
            $table->boolean('is_default')->default(false);
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};