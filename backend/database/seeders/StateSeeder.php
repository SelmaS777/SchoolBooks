<?php

namespace Database\Seeders;

use App\Models\State;
use Illuminate\Database\Seeder;

class StateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $states = [
            [
                'name' => 'Good',
                'description' => 'Book shows signs of wear but is fully intact.'
            ],
            [
                'name' => 'Very Good',
                'description' => 'Minimal wear with minor imperfections.'
            ],
            [
                'name' => 'Excellent',
                'description' => 'Like new with no noticeable flaws.'
            ]
        ];

        foreach ($states as $state) {
            State::create($state);
        }
    }
}