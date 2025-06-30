<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @OA\Schema(
 *     title="Review",
 *     description="Review model",
 *     @OA\Property(
 *         property="id",
 *         description="Unique identifier for the review",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="user_id",
 *         description="User ID associated with the review",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="product_id",
 *         description="Product ID associated with the review",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="rating",
 *         description="Rating given in the review",
 *         type="integer",
 *         example="4"
 *     ),
 *     @OA\Property(
 *         property="review",
 *         description="Content of the review",
 *         type="string",
 *         example="This product is great!"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         description="Date and time when the review was created",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 02:00:00"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         description="Date and time when the review was last updated",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 02:30:00"
 *     ),
 *     @OA\Property(
 *         property="user",
 *         description="User who created the review",
 *         ref="#/components/schemas/User"
 *     ),
 *     @OA\Property(
 *         property="product",
 *         description="Product associated with the review",
 *         ref="#/components/schemas/Product"
 *     )
 * )
 * @method static create(array $all)
 */
class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'rating',
        'review',
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
