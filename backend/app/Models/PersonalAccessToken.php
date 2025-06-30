<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @OA\Schema(
 *     title="PersonalAccessToken",
 *     description="Personal Access Token model",
 *     @OA\Property(
 *         property="id",
 *         description="Unique identifier for the personal access token",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="user_id",
 *         description="User ID associated with the personal access token",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="token",
 *         description="The access token",
 *         type="string",
 *         example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
 *     ),
 *     @OA\Property(
 *         property="last_used_at",
 *         description="Date and time when the token was last used",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 05:00:00"
 *     ),
 *     @OA\Property(
 *         property="expires_at",
 *         description="Date and time when the token expires",
 *         type="string",
 *         format="date-time",
 *         example="2024-06-12 05:00:00"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         description="Date and time when the personal access token was created",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 04:00:00"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         description="Date and time when the personal access token was last updated",
 *         type="string",
 *         format="date-time",
 *         example="2024-05-12 04:30:00"
 *     ),
 *     @OA\Property(
 *         property="user",
 *         description="User associated with the personal access token",
 *         ref="#/components/schemas/User"
 *     )
 * )
 */
class PersonalAccessToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'token',
        'last_used_at',
        'expires_at'
    ];

    function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
