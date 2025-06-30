<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory(10)->create();

        User::factory()->create([
            'full_name' => 'Admin Adminovic',
            'email' => 'admin@example.com',
            'password' => 'password',
            'phone_number' => '000-000-000',
            'city_id' => 1,
            'tier_id' => 3,
            'image_url' => 'https://picsum.photos/200/300?random=' . rand(10001, 20000),
        ]);
    }
}

