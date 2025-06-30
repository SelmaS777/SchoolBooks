<?php

namespace Database\Factories;

use App\Models\State;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<State>
 */
class StateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $states = [
            'Good' => 'Book shows signs of wear but is fully intact.',
            'Very Good' => 'Minimal wear with minor imperfections.',
            'Excellent' => 'Like new with no noticeable flaws.'
        ];
        
        $name = $this->faker->randomElement(array_keys($states));
        
        return [
            'name' => $name,
            'description' => $states[$name],
        ];
    }
}