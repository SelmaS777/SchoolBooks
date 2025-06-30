<?php

namespace Database\Factories;

use App\Models\Card;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardFactory extends Factory
{
    protected $model = Card::class;

    public function definition(): array
    {
        $cardTypes = ['Visa', 'MasterCard', 'American Express', 'Discover'];
        
        return [
            'user_id' => User::factory(),
            'card_type' => $this->faker->randomElement($cardTypes),
            'last_four' => $this->faker->numerify('####'),
            'cardholder_name' => $this->faker->name(),
            'expiry_month' => $this->faker->numberBetween(1, 12),
            'expiry_year' => $this->faker->numberBetween(2024, 2030),
            'payment_token' => $this->faker->uuid(),
            'is_default' => $this->faker->boolean(80), // 80% chance to be default
        ];
    }
    
    /**
     * Indicate that this card is the default payment method.
     */
    public function default(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'is_default' => true,
            ];
        });
    }
}