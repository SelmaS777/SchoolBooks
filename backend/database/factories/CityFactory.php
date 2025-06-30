<?php

namespace Database\Factories;

use App\Models\City;
use Illuminate\Database\Eloquent\Factories\Factory;

class CityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = City::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        // Array of Bosnian cities to choose from
        $bosnianCities = [
            'Sarajevo', 'Mostar', 'Banja Luka', 'Tuzla', 'Zenica',
            'Bijeljina', 'Doboj', 'Trebinje', 'Prijedor', 'Brčko'
        ];

        return [
            'name' => $this->faker->unique()->randomElement($bosnianCities),
        ];
    }
}