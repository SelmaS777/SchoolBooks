<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Order;
use App\Models\Card;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'card_id' => $this->faker->optional()->randomElement([1, 2, 3]),
            'payment_method' => $this->faker->randomElement(['credit_card', 'debit_card', 'cash_on_delivery']),
            'payment_status' => $this->faker->randomElement(['pending', 'processing', 'completed', 'failed']),
            'payment_amount' => $this->faker->randomFloat(2, 10, 500),
            'transaction_id' => $this->faker->optional()->bothify('txn_##########'),
        ];
    }
}