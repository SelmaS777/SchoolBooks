<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CitySeeder::class,
            TierSeeder::class,
            UserSeeder::class,
            CardSeeder::class,
            CategorySeeder::class,
            StateSeeder::class,
            ProductSeeder::class,
            NotificationSeeder::class,
            CartSeeder::class,
            OrderSeeder::class,
            PaymentSeeder::class,
            ReviewSeeder::class,
        ]);
    }
}
