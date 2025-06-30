<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @OA\Schema(
 *     title="Cart",
 *     description="Cart model",
 *     @OA\Property(
 *         property="id",
 *         description="Unique identifier for the cart item",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="user_id",
 *         description="User ID associated with the cart item",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="product_id",
 *         description="Product ID associated with the cart item",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="quantity",
 *         description="Quantity of the product in the cart",
 *         type="integer",
 *         example="2"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         description="Date and time when the cart item was created",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 10:00:00"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         description="Date and time when the cart item was last updated",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 10:30:00"
 *     ),
 *     @OA\Property(
 *         property="user",
 *         description="User associated with the cart item",
 *         ref="#/components/schemas/User"
 *     ),
 *     @OA\Property(
 *         property="product",
 *         description="Product associated with the cart item",
 *         ref="#/components/schemas/Product"
 *     )
 * )
 * @method static create(array $all)
 */
class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
