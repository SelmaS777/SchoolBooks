<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\User;
use Illuminate\Database\Seeder;

class CardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users except the admin
        $users = User::where('email', '!=', 'admin@example.com')->get();

        foreach ($users as $user) {
            // Each user has a 70% chance of having a credit card
            if (rand(1, 10) <= 7) {
                // Create 1-3 cards for the user
                $cardCount = rand(1, 3);
                
                for ($i = 0; $i < $cardCount; $i++) {
                    Card::factory()->create([
                        'user_id' => $user->id,
                        'is_default' => ($i === 0), // First card is default
                    ]);
                }
            }
        }
        
        // Ensure admin has a default card
        Card::factory()->create([
            'user_id' => User::where('email', 'admin@example.com')->first()->id,
            'card_type' => 'Visa',
            'last_four' => '4242',
            'cardholder_name' => 'Admin Adminovic',
            'expiry_month' => '12',
            'expiry_year' => '2025',
            'is_default' => true,
        ]);
    }
}