<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing products
        Product::truncate();
        
        // Books from the list
        $books = [
            [
                'name' => 'The Stranger',
                'author' => 'Albert Camus',
                'image_url' => 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1738704267i/49552.jpg',
                'category_id' => 2,
                'state_id' => 1,
                'price' => 13,
                'description' => 'A classic novel about the absurdity of life and existence.',
                'year_of_publication' => 1942,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'The Myth of Sisyphus',
                'author' => 'Albert Camus',
                'image_url' => 'https://m.media-amazon.com/images/I/81abgIkXUHL._SL1500_.jpg',
                'category_id' => 2,
                'state_id' => 3,
                'price' => 20,
                'description' => 'A philosophical essay about the absurd and suicide.',
                'year_of_publication' => 1942,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'One Thousand and One Nights',
                'author' => 'Hanan al-Shaykh',
                'image_url' => 'https://m.media-amazon.com/images/I/81ANAMxZ3hL._SL1500_.jpg',
                'category_id' => 2,
                'state_id' => 2,
                'price' => rand(10, 30),
                'description' => 'A collection of Middle Eastern folk tales compiled during the Islamic Golden Age.',
                'year_of_publication' => 2013,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Faust',
                'author' => 'Johann Wolfgang von Goethe',
                'image_url' => 'https://m.media-amazon.com/images/I/71-qPW0UDgL._SL1000_.jpg',
                'category_id' => 2,
                'state_id' => 3,
                'price' => rand(15, 35),
                'description' => 'A tragic play in two parts that tells the story of a man who sells his soul to the devil.',
                'year_of_publication' => 1808,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'The Little Prince',
                'author' => 'Antoine de Saint-Exupéry',
                'image_url' => 'https://www.lepetitprince.com/wp-content/uploads/2023/01/COVER-Le-Petit-Prince-FR.jpg',
                'category_id' => 1,
                'state_id' => 1,
                'price' => rand(10, 25),
                'description' => 'A poetic tale about a young prince who visits various planets in space.',
                'year_of_publication' => 1943,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'The Adventures of Huckleberry Finn',
                'author' => 'Mark Twain',
                'image_url' => 'https://d1pwnu15mzvjms.cloudfront.net/300x0/9781480475182.jpg?w=384',
                'category_id' => 1,
                'state_id' => 2,
                'price' => rand(12, 28),
                'description' => 'A novel about a boy\'s journey down the Mississippi River with a runaway slave.',
                'year_of_publication' => 1884,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'The Adventures of Tom Sawyer',
                'author' => 'Mark Twain',
                'image_url' => 'https://www.ucpress.edu/_next/image?url=https%3A%2F%2Fwebfiles.ucpress.edu%2Fcoverimage%2Fisbn13%2F9780520343634.jpg&w=640&q=90',
                'category_id' => 1,
                'state_id' => 3,
                'price' => rand(12, 28),
                'description' => 'The story of a young boy growing up along the Mississippi River.',
                'year_of_publication' => 1876,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'The Ugly Duckling',
                'author' => 'Hans Christian Andersen',
                'image_url' => 'https://m.media-amazon.com/images/I/A12VeN4BAEL._SL1500_.jpg',
                'category_id' => 1,
                'state_id' => 2,
                'price' => rand(8, 20),
                'description' => 'A fairy tale about personal transformation and identity.',
                'year_of_publication' => 1843,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Introduction to Quantum Mechanics',
                'author' => 'David J. Griffiths',
                'image_url' => 'https://m.media-amazon.com/images/I/61HBnuFYo-L._SL1360_.jpg',
                'category_id' => 3,
                'state_id' => 1,
                'price' => rand(50, 120),
                'description' => 'A comprehensive textbook covering the fundamentals of quantum mechanics.',
                'year_of_publication' => 2017,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Introduction to Algorithms, 3rd Edition',
                'author' => 'Thomas H Cormen',
                'image_url' => 'https://m.media-amazon.com/images/I/61Pgdn8Ys-L._SL1500_.jpg',
                'category_id' => 3,
                'state_id' => 2,
                'price' => rand(60, 130),
                'description' => 'A comprehensive introduction to modern computer algorithms.',
                'year_of_publication' => 2009,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Calculus',
                'author' => 'James Stewart',
                'image_url' => 'https://m.media-amazon.com/images/I/91+VKdOPEVL._SL1500_.jpg',
                'category_id' => 3,
                'state_id' => 3,
                'price' => rand(55, 125),
                'description' => 'A comprehensive guide to calculus concepts and applications.',
                'year_of_publication' => 2015,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Physics for Scientists and Engineers: A Strategic Approach',
                'author' => 'Randall D. Knight',
                'image_url' => 'https://m.media-amazon.com/images/I/61MiXKtT6cL._SL1000_.jpg',
                'category_id' => 3,
                'state_id' => 2,
                'price' => rand(60, 140),
                'description' => 'A textbook that helps students connect physics to the real world.',
                'year_of_publication' => 2016,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Classical Mechanics',
                'author' => 'John R. Taylor',
                'image_url' => 'https://m.media-amazon.com/images/I/611+R-vfzjL._SL1400_.jpg',
                'category_id' => 3,
                'state_id' => 1,
                'price' => rand(50, 120),
                'description' => 'A modern introduction to the classic subject of classical mechanics.',
                'year_of_publication' => 2005,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Cracking the Coding Interview: 189 Programming Questions and Solutions',
                'author' => 'Gayle Laakmann McDowell',
                'image_url' => 'https://m.media-amazon.com/images/I/61mIq2iJUXL._SL1360_.jpg',
                'category_id' => 3,
                'state_id' => 2,
                'price' => rand(30, 60),
                'description' => 'A guide to preparing for software engineering job interviews.',
                'year_of_publication' => 2015,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Python Crash Course, 3rd Edition: A Hands-On, Project-Based Introduction to Programming',
                'author' => 'Eric Matthes',
                'image_url' => 'https://m.media-amazon.com/images/I/81py-nCTfrL._SL1500_.jpg',
                'category_id' => 3,
                'state_id' => 2,
                'price' => rand(25, 55),
                'description' => 'A fast-paced, thorough introduction to Python programming.',
                'year_of_publication' => 2023,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'JavaScript: The Good Parts: The Good Parts',
                'author' => 'Douglas Crockford',
                'image_url' => 'https://m.media-amazon.com/images/I/7185IMvz88L._SL1500_.jpg',
                'category_id' => 3,
                'state_id' => 3,
                'price' => rand(25, 50),
                'description' => 'A guide to JavaScript that focuses on the good parts of the language.',
                'year_of_publication' => 2008,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Headway Intermediate Workbook without key 5th edition',
                'author' => 'Liz Soars',
                'image_url' => 'https://www.knjiga.ba/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/slike/headway_5th_edition_intermediate_wb.jpg',
                'category_id' => 2,
                'state_id' => 2,
                'price' => rand(20, 45),
                'description' => 'A workbook for intermediate English language learners.',
                'year_of_publication' => 2019,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Logika',
                'author' => 'Gajo Petrović',
                'image_url' => 'https://www.knjiga.ba/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/slike/logika_gajo_petrovic.jpg',
                'category_id' => 2,
                'state_id' => 3,
                'price' => rand(15, 40),
                'description' => 'A comprehensive introduction to logic and reasoning.',
                'year_of_publication' => 2011,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Poduzetništvo 1 - Udžbenik za 3, razred - zanimanje komercijalista/komercijalista',
                'author' => 'Suzana Đurđević',
                'image_url' => 'https://www.knjiga.ba/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/slike/poduzetnistvo_1_za_3_suzana.jpg',
                'category_id' => 2,
                'state_id' => 1,
                'price' => rand(20, 45),
                'description' => 'A textbook on entrepreneurship for commercial specialization students.',
                'year_of_publication' => 2018,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Deutsch Lernen mit Hans und Greta - Deutsch fur Kinder',
                'author' => 'Dušan Pavlić',
                'image_url' => 'https://www.knjiga.ba/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/slike/deutsch_lernen_mit_hans_und_greta.jpg',
                'category_id' => 1,
                'state_id' => 3,
                'price' => rand(15, 35),
                'description' => 'A German language learning book for children.',
                'year_of_publication' => 2019,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'New English Adventure 2, Pupils Book + DVD',
                'author' => 'Anne Worrall',
                'image_url' => 'https://www.knjiga.ba/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/slike/new_english_adventure_2_pb.jpg',
                'category_id' => 1,
                'state_id' => 2,
                'price' => rand(20, 40),
                'description' => 'An English language learning book for young learners.',
                'year_of_publication' => 2015,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Knjiga o matematici - Pustolovine u svijetu oblika i brojeva',
                'author' => 'Anna Weltman',
                'image_url' => 'https://www.knjiga.ba/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/slike/knjiga_o_matematici.jpg',
                'category_id' => 1,
                'state_id' => 2,
                'price' => rand(15, 35),
                'description' => 'A book about mathematics for children, exploring shapes and numbers.',
                'year_of_publication' => 2018,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Fizika oko nas 9 - Udžbenik za fiziku u devetom razredu osnovne škole',
                'author' => 'Vladimir Paar',
                'image_url' => 'https://www.knjiga.ba/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/slike/fizika_oko_nas_9_udzbenik.jpg',
                'category_id' => 1,
                'state_id' => 3,
                'price' => rand(18, 38),
                'description' => 'A physics textbook for ninth grade elementary school students.',
                'year_of_publication' => 2017,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Tehnička kultura 7 - Udžbenik za sedmi razred devetogodišnje osnovne škole',
                'author' => 'Ćamil Ahmetović',
                'image_url' => 'https://www.knjiga.ba/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/slike/tehnicko_7.jpg',
                'category_id' => 1,
                'state_id' => 3,
                'price' => rand(18, 38),
                'description' => 'A technical education textbook for seventh grade elementary school students.',
                'year_of_publication' => 2016,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
            [
                'name' => 'Moja okolina 3 - Udžbenik za treći razred devetogodišnje škole',
                'author' => 'Dijana Kovačević',
                'image_url' => 'https://www.knjiga.ba/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/slike/moja_okolina_3_udzbenik.jpg',
                'category_id' => 1,
                'state_id' => 2,
                'price' => rand(15, 35),
                'description' => 'An environmental science textbook for third grade elementary school students.',
                'year_of_publication' => 2019,
                'seller_id' => rand(1, 10),
                'status' => 'selling', // Explicitly set selling status
                'buyer_id' => null,    // No buyer
            ],
        ];

        // Insert all books into the database
        foreach ($books as $book) {
            Product::create($book);
        }
    }
}