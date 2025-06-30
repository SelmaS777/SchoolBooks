<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @OA\Schema(
 *     title="Order",
 *     description="Order model",
 *     @OA\Property(property="id", type="integer", example="1"),
 *     @OA\Property(property="buyer_id", type="integer", example="1"),
 *     @OA\Property(property="seller_id", type="integer", example="2"),
 *     @OA\Property(property="product_id", type="integer", example="1"),
 *     @OA\Property(property="total_amount", type="number", format="float", example="25.99"),
 *     @OA\Property(property="order_status", type="string", enum={"pending", "accepted", "rejected", "completed", "cancelled"}, example="pending"),
 *     @OA\Property(property="tracking_status", type="string", enum={"order_placed", "preparing", "shipped", "in_transit", "delivered"}, example="order_placed"),
 *     @OA\Property(property="shipping_address", type="string", example="123 Main St, City, State 12345"),
 *     @OA\Property(property="notes", type="string", nullable=true, example="Please handle with care"),
 *     @OA\Property(property="accepted_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="shipped_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="delivered_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */
class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'seller_id',
        'product_id',
        'total_amount',
        'order_status',
        'tracking_status',
        'shipping_address',
        'notes',
        'accepted_at',
        'shipped_at',
        'delivered_at',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'accepted_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    // Order statuses
    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_REJECTED = 'rejected';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    // Tracking statuses
    const TRACKING_ORDER_PLACED = 'order_placed';
    const TRACKING_PREPARING = 'preparing';
    const TRACKING_SHIPPED = 'shipped';
    const TRACKING_IN_TRANSIT = 'in_transit';
    const TRACKING_DELIVERED = 'delivered';

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    // Helper methods
    public function canBeAccepted(): bool
    {
        return $this->order_status === self::STATUS_PENDING;
    }

    public function canBeShipped(): bool
    {
        return $this->order_status === self::STATUS_ACCEPTED && 
               $this->tracking_status === self::TRACKING_PREPARING;
    }

    public function canBeCompleted(): bool
    {
        return $this->order_status === self::STATUS_ACCEPTED && 
               $this->tracking_status === self::TRACKING_DELIVERED;
    }

    public function accept(): bool
    {
        if (!$this->canBeAccepted()) {
            return false;
        }

        $this->update([
            'order_status' => self::STATUS_ACCEPTED,
            'tracking_status' => self::TRACKING_PREPARING,
            'accepted_at' => now(),
        ]);

        return true;
    }

    public function reject(): bool
    {
        if (!$this->canBeAccepted()) {
            return false;
        }

        $this->update([
            'order_status' => self::STATUS_REJECTED,
        ]);

        // Mark product as available again
        $this->product->update(['status' => 'selling']);

        return true;
    }

    public function ship(): bool
    {
        if (!$this->canBeShipped()) {
            return false;
        }

        $this->update([
            'tracking_status' => self::TRACKING_SHIPPED,
            'shipped_at' => now(),
        ]);

        return true;
    }

    public function markAsDelivered(): bool
    {
        $this->update([
            'tracking_status' => self::TRACKING_DELIVERED,
            'delivered_at' => now(),
        ]);

        return true;
    }

    public function complete(): bool
    {
        if (!$this->canBeCompleted()) {
            return false;
        }

        $this->update([
            'order_status' => self::STATUS_COMPLETED,
        ]);

        // Mark product as sold
        $this->product->update([
            'status' => 'sold',
            'buyer_id' => $this->buyer_id,
        ]);

        return true;
    }
}