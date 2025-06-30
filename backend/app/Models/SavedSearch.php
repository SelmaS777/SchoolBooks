<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @OA\Schema(
 *     title="SavedSearch",
 *     description="SavedSearch model",
 *     @OA\Property(
 *         property="id",
 *         description="Unique identifier for the saved search",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="user_id",
 *         description="User ID associated with the saved search",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="search_query",
 *         description="The search query string",
 *         type="string",
 *         example="javascript programming"
 *     ),
 *     @OA\Property(
 *         property="search_name",
 *         description="Custom name for the saved search (optional)",
 *         type="string",
 *         nullable=true,
 *         example="Programming Books"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         description="Date and time when the search was saved",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 10:00:00"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         description="Date and time when the search was last updated",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 10:30:00"
 *     ),
 *     @OA\Property(
 *         property="user",
 *         description="User associated with the saved search",
 *         ref="#/components/schemas/User"
 *     )
 * )
 * @method static create(array $all)
 */
class SavedSearch extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'search_query',
        'search_name',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}