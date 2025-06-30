<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Default all products to 'selling' status with no buyer
        return [
            'seller_id' => $this->faker->numberBetween(1, 10),
            'buyer_id' => null,
            'status' => 'selling', // Always set to selling by default
            'category_id' => $this->faker->numberBetween(1, 3),
            'state_id' => $this->faker->numberBetween(1, 3),
            'name' => $this->faker->sentence,
            'author' => $this->faker->name,
            'description' => $this->faker->paragraph,
            'price' => $this->faker->randomFloat(2, 1, 1000),
            'image_url' => $this->faker->imageUrl(),
            'year_of_publication' => $this->faker->numberBetween(1900, 2023),
        ];
    }
    
    /**
     * Indicate that the product is for sale.
     */
    public function selling(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'selling',
                'buyer_id' => null,
            ];
        });
    }
    
    /**
     * Indicate that the product is sold.
     * Available for manual testing but not used in seeding.
     */
    public function sold(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'sold',
                'buyer_id' => User::inRandomOrder()->first()->id,
            ];
        });
    }
    
    /**
     * Indicate that the product is bought.
     * Available for manual testing but not used in seeding.
     */
    public function bought(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'bought',
                'buyer_id' => User::inRandomOrder()->first()->id,
            ];
        });
    }
}