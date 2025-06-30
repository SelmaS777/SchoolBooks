<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->unsignedBigInteger('card_id')->nullable();
            $table->string('payment_method');
            $table->string('payment_status');
            $table->decimal('payment_amount', 10, 2);
            $table->string('transaction_id')->nullable();
            $table->json('payment_gateway_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            
            // Add foreign key for card_id if cards table exists
            if (Schema::hasTable('cards')) {
                $table->foreign('card_id')->references('id')->on('cards')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};