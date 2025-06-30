<?php

namespace App\Http\Services;

use App\Models\Notification;
use App\Models\Order;
use App\Events\NotificationEvent;

/**
 * Service class for handling notifications
 * 
 * This class is not exposed via API endpoints directly,
 * it's used internally by controllers to manage notifications.
 */
class NotificationService
{
    public static function createOrderNotification(Order $order, string $type, int $userId, string $message): void
    {
        // Create notification in database
        $notification = Notification::create([
            'user_id' => $userId,
            'message' => $message,
            'notification_type' => $type,
            'order_id' => $order->id,
            'is_read' => false,
        ]);

        // Broadcast real-time notification
        broadcast(new NotificationEvent($message, $userId, $type));
    }

    public static function notifyOrderCreated(Order $order): void
    {
        $message = "New order received for your product: {$order->product->name}";
        self::createOrderNotification($order, Notification::TYPE_ORDER_CREATED, $order->seller_id, $message);
    }

    public static function notifyOrderAccepted(Order $order): void
    {
        $message = "Your order for {$order->product->name} has been accepted by the seller";
        self::createOrderNotification($order, Notification::TYPE_ORDER_ACCEPTED, $order->buyer_id, $message);
    }

    public static function notifyOrderRejected(Order $order): void
    {
        $message = "Your order for {$order->product->name} has been rejected by the seller";
        self::createOrderNotification($order, Notification::TYPE_ORDER_REJECTED, $order->buyer_id, $message);
    }

    public static function notifyOrderShipped(Order $order): void
    {
        $message = "Your order for {$order->product->name} has been shipped";
        self::createOrderNotification($order, Notification::TYPE_ORDER_SHIPPED, $order->buyer_id, $message);
    }

    public static function notifyOrderDelivered(Order $order): void
    {
        $message = "Your order for {$order->product->name} has been delivered";
        self::createOrderNotification($order, Notification::TYPE_ORDER_DELIVERED, $order->buyer_id, $message);
    }

    public static function notifyOrderCompleted(Order $order): void
    {
        $message = "Order for {$order->product->name} has been completed";
        self::createOrderNotification($order, Notification::TYPE_ORDER_COMPLETED, $order->seller_id, $message);
    }
}