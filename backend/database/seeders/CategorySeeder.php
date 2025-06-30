<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Primary School',
                'description' => 'Books for primary school education (ages 5-11).'
            ],
            [
                'name' => 'Secondary School',
                'description' => 'Books for secondary school education (ages 11-18).'
            ],
            [
                'name' => 'University',
                'description' => 'Academic books for university and higher education.'
            ]
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}