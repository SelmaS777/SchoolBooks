<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;
use App\Models\Cart;

/**
 * @extends Factory<Cart>
 */
class CartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get all existing product IDs
        $productIds = Product::pluck('id')->toArray();

        return [
            'user_id' => $this->faker->numberBetween(1, 10),
            'product_id' => $this->faker->randomElement($productIds),
            'quantity' => $this->faker->numberBetween(1, 10),
        ];
    }
}
