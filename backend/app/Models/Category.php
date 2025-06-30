<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @OA\Schema(
 *     title="Category",
 *     description="Category model",
 *     @OA\Property(
 *         property="id",
 *         description="Unique identifier for the category",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="name",
 *         description="Name of the category",
 *         type="string",
 *         example="Electronics"
 *     ),
 *     @OA\Property(
 *         property="description",
 *         description="Description of the category",
 *         type="string",
 *         example="Products related to electronics."
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         description="Date and time when the category was created",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 09:00:00"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         description="Date and time when the category was last updated",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 09:30:00"
 *     ),
 *     @OA\Property(
 *         property="products",
 *         description="Products associated with the category",
 *         type="array",
 *         @OA\Items(
 *             ref="#/components/schemas/Product"
 *         )
 *     )
 * )
 * @method static create(array $all)
 */
class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function products(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
