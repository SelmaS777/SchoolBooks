<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @OA\Schema(
 *     title="Tier",
 *     description="Tier model for subscription levels",
 *     @OA\Property(
 *         property="id",
 *         description="Unique identifier for the tier",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="name",
 *         description="Name of the tier",
 *         type="string",
 *         example="Premium"
 *     ),
 *     @OA\Property(
 *         property="description",
 *         description="Description of the tier",
 *         type="string",
 *         example="Premium subscription with advanced features"
 *     ),
 *     @OA\Property(
 *         property="price",
 *         description="Monthly price of the tier",
 *         type="number",
 *         format="float",
 *         example="19.99"
 *     ),
 *     @OA\Property(
 *         property="max_listings",
 *         description="Maximum number of listings allowed",
 *         type="integer",
 *         example="50"
 *     ),
 *     @OA\Property(
 *         property="featured_listings",
 *         description="Whether featured listings are allowed",
 *         type="boolean",
 *         example="true"
 *     ),
 *     @OA\Property(
 *         property="priority_support",
 *         description="Whether priority support is included",
 *         type="boolean",
 *         example="true"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         description="Date and time when the tier was created",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 09:00:00"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         description="Date and time when the tier was last updated",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 09:30:00"
 *     )
 * )
 * @method static create(array $array)
 */
class Tier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'max_listings',
        'featured_listings',
        'priority_support',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}