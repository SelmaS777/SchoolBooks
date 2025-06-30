<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            ['name' => 'Sarajevo'],
            ['name' => 'Mostar'],
            ['name' => 'Banja Luka'],
            ['name' => 'Tuzla'],
            ['name' => 'Zenica']
        ];

        foreach ($cities as $city) {
            City::create($city);
        }
    }
}