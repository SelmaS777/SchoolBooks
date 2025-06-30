<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->enum('status', ['selling', 'sold', 'bought'])->default('selling')->after('state_id');
            $table->unsignedBigInteger('buyer_id')->nullable()->after('seller_id');
            $table->foreign('buyer_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['buyer_id']);
            $table->dropColumn(['status', 'buyer_id']);
        });
    }
};