<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @OA\Schema(
 *     title="Product",
 *     description="Product model",
 *     @OA\Property(
 *         property="id",
 *         description="Unique identifier for the product",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="name",
 *         description="Name of the product",
 *         type="string",
 *         example="Smartphone"
 *     ),
 *     @OA\Property(
 *         property="description",
 *         description="Description of the product",
 *         type="string",
 *         example="A high-end smartphone with advanced features."
 *     ),
 *     @OA\Property(
 *         property="price",
 *         description="Price of the product",
 *         type="number",
 *         format="float",
 *         example="599.99"
 *     ),
 *     @OA\Property(
 *         property="seller_id",
 *         description="ID of the seller who listed the product",
 *         type="integer",
 *         example="5"
 *     ),
 *     @OA\Property(
 *         property="buyer_id",
 *         description="ID of the user who bought the product",
 *         type="integer",
 *         nullable=true,
 *         example="3"
 *     ),
 *     @OA\Property(
 *         property="status",
 *         description="Status of the product (selling, sold, bought)",
 *         type="string",
 *         enum={"selling", "sold", "bought"},
 *         example="selling"
 *     ),
 *     @OA\Property(
 *         property="category_id",
 *         description="ID of the category this product belongs to",
 *         type="integer",
 *         example="3"
 *     ),
 *     @OA\Property(
 *         property="image_url",
 *         description="URL to the product image",
 *         type="string",
 *         example="https://example.com/images/smartphone.jpg"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         description="Date and time when the product was created",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 03:00:00"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         description="Date and time when the product was last updated",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 03:30:00"
 *     ),
 *  @OA\Property(
 *     property="year_of_publication",
 *     description="Year the book was published",
 *     type="integer",
 *     example="2020"
 * ),
 * @OA\Property(
 *     property="state_id",
 *     description="ID of the book's condition state",
 *     type="integer",
 *     example="1"
 * ),
 * @OA\Property(
 *     property="author",
 *     description="Author of the book",
 *     type="string",
 *     example="John Doe"
 * )
 * )
 * @method static pluck(string $string)
 * @method static create(array $all)
 */
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'author',
        'description',
        'price',
        'seller_id',
        'buyer_id',
        'status',
        'category_id',
        'image_url',
        'state_id',
        'year_of_publication'
    ];

    public function state(): BelongsTo
    {
        return $this->belongsTo(State::class);
    }   

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }

    public function wishlists(): HasMany
{
    return $this->hasMany(Wishlist::class);
}
}