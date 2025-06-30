<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'buyer_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'seller_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'product_id' => Product::inRandomOrder()->first()->id ?? Product::factory(),
            'total_amount' => $this->faker->randomFloat(2, 10, 500),
            'order_status' => $this->faker->randomElement(['pending', 'accepted', 'rejected', 'completed']),
            'tracking_status' => $this->faker->randomElement(['order_placed', 'preparing', 'shipped', 'delivered']),
            'shipping_address' => $this->faker->address,
            'notes' => $this->faker->optional()->sentence,
        ];
    }
}