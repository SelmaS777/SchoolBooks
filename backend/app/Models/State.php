<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @OA\Schema(
 *     title="State",
 *     description="Book state model",
 *     @OA\Property(
 *         property="id",
 *         description="Unique identifier for the state",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="name",
 *         description="Name of the book state",
 *         type="string",
 *         example="Good"
 *     ),
 *     @OA\Property(
 *         property="description",
 *         description="Description of the book state",
 *         type="string",
 *         example="Book shows signs of wear but is fully intact."
 *     )
 * )
 */
class State extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}