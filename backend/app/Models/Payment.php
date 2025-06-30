<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @OA\Schema(
 *     title="Payment",
 *     description="Payment model",
 *     @OA\Property(property="id", type="integer", example="1"),
 *     @OA\Property(property="order_id", type="integer", example="1"),
 *     @OA\Property(property="card_id", type="integer", nullable=true, example="1"),
 *     @OA\Property(property="payment_method", type="string", enum={"credit_card", "debit_card", "cash_on_delivery"}, example="credit_card"),
 *     @OA\Property(property="payment_status", type="string", enum={"pending", "processing", "completed", "failed", "refunded"}, example="completed"),
 *     @OA\Property(property="payment_amount", type="number", format="float", example="25.99"),
 *     @OA\Property(property="transaction_id", type="string", nullable=true, example="txn_1234567890"),
 *     @OA\Property(property="payment_gateway_response", type="object", nullable=true),
 *     @OA\Property(property="paid_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */
class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'card_id',
        'payment_method',
        'payment_status',
        'payment_amount',
        'transaction_id',
        'payment_gateway_response',
        'paid_at',
    ];

    protected $casts = [
        'payment_amount' => 'decimal:2',
        'payment_gateway_response' => 'json',
        'paid_at' => 'datetime',
    ];

    // Payment methods
    const METHOD_CREDIT_CARD = 'credit_card';
    const METHOD_DEBIT_CARD = 'debit_card';
    const METHOD_CASH_ON_DELIVERY = 'cash_on_delivery';

    // Payment statuses
    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';
    const STATUS_REFUNDED = 'refunded';

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }

    // Helper methods
    public function isPending(): bool
    {
        return $this->payment_status === self::STATUS_PENDING;
    }

    public function isCompleted(): bool
    {
        return $this->payment_status === self::STATUS_COMPLETED;
    }

    public function isFailed(): bool
    {
        return $this->payment_status === self::STATUS_FAILED;
    }

    public function markAsCompleted(string $transactionId = null): bool
    {
        $this->update([
            'payment_status' => self::STATUS_COMPLETED,
            'transaction_id' => $transactionId,
            'paid_at' => now(),
        ]);

        return true;
    }

    public function markAsFailed(array $gatewayResponse = null): bool
    {
        $this->update([
            'payment_status' => self::STATUS_FAILED,
            'payment_gateway_response' => $gatewayResponse,
        ]);

        return true;
    }
}