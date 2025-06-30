<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @OA\Schema(
 *     title="CreditCard",
 *     description="Credit Card model for user payment methods",
 *     @OA\Property(
 *         property="id",
 *         description="Unique identifier for the credit card",
 *         type="integer",
 *         example="1"
 *     ),
 *     @OA\Property(
 *         property="user_id",
 *         description="ID of user who owns this card",
 *         type="integer",
 *         example="5"
 *     ),
 *     @OA\Property(
 *         property="card_type",
 *         description="Type of credit card",
 *         type="string",
 *         example="Visa"
 *     ),
 *     @OA\Property(
 *         property="last_four",
 *         description="Last four digits of the card number",
 *         type="string",
 *         example="4242"
 *     ),
 *     @OA\Property(
 *         property="cardholder_name",
 *         description="Name on the credit card",
 *         type="string",
 *         example="John Smith"
 *     ),
 *     @OA\Property(
 *         property="expiry_month",
 *         description="Expiration month",
 *         type="string",
 *         example="12"
 *     ),
 *     @OA\Property(
 *         property="expiry_year",
 *         description="Expiration year",
 *         type="string",
 *         example="2025"
 *     ),
 *     @OA\Property(
 *         property="is_default",
 *         description="Whether this is the default payment method",
 *         type="boolean",
 *         example="true"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         description="Date and time when the card was added",
 *         type="string",
 *         format="date-time"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         description="Date and time when the card was last updated",
 *         type="string",
 *         format="date-time"
 *     )
 * )
 */
class Card extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'card_type',
        'last_four',
        'cardholder_name',
        'expiry_month',
        'expiry_year',
        'payment_token',
        'is_default',
    ];

    /**
     * Get the user that owns the credit card.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Hide sensitive attributes from JSON representation
     */
    protected $hidden = [
        'payment_token'
    ];
}