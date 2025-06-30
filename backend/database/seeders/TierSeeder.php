<?php

namespace Database\Seeders;

use App\Models\Tier;
use Illuminate\Database\Seeder;

class TierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiers = [
            [
                'name' => 'Free',
                'description' => 'Basic subscription with limited features',
                'price' => 0.00,
                'max_listings' => 0,
                'featured_listings' => false,
                'priority_support' => false,
            ],
            [
                'name' => 'Premium',
                'description' => 'Standard subscription with more features',
                'price' => 10.00,
                'max_listings' => 20,
                'featured_listings' => false,
                'priority_support' => false,
            ],
            [
                'name' => 'Premium +',
                'description' => 'Premium subscription with all features',
                'price' => 20.00,
                'max_listings' => 50,
                'featured_listings' => true,
                'priority_support' => true,
            ],
        ];

        foreach ($tiers as $tier) {
            Tier::create($tier);
        }
    }
}