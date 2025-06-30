<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @OA\Schema(
 *     title="City",
 *     description="City model",
 *     @OA\Property(
 *         property="id",
 *         description="Unique identifier for the city",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="name",
 *         description="Name of the city",
 *         type="string",
 *         example="Sarajevo"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         description="Date and time when the city was created",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 09:00:00"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         description="Date and time when the city was last updated",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 09:30:00"
 *     )
 * )
 * @method static create(array $array)
 */
class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}