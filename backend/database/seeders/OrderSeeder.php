<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Only create orders if we have existing products and users
        if (Product::count() === 0 || User::count() === 0) {
            $this->command->warn('No products or users found. Skipping order seeding.');
            return;
        }
        
        // Create orders using existing products and users
        Order::factory(4)->create();
    }
}