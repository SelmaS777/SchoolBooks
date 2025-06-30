<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Payment;
use App\Http\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Orders",
 *     description="Operations related to orders/purchases"
 * )
 */
class OrderController extends Controller
{
    /**
     * @OA\Get(
     *      path="/orders",
     *      tags={"Orders"},
     *      summary="Get user's orders (as buyer or seller)",
     *      @OA\Response(response=200, description="Successful operation"),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function index(): JsonResponse
    {
        $userId = Auth::id();
        $orders = Order::with(['product', 'buyer', 'seller', 'payment'])
            ->where('buyer_id', $userId)
            ->orWhere('seller_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }
    
    /**
     * @OA\Post(
     *      path="/orders",
     *      tags={"Orders"},
     *      summary="Create a purchase order",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"product_id", "shipping_address"},
     *              @OA\Property(property="product_id", type="integer", example="1"),
     *              @OA\Property(property="shipping_address", type="string", example="123 Main St"),
     *              @OA\Property(property="payment_method", type="string", enum={"credit_card", "debit_card", "cash_on_delivery"}, example="credit_card"),
     *              @OA\Property(property="card_id", type="integer", nullable=true, example="1", description="ID of saved card (alternative to card details)"),
     *              @OA\Property(property="card_number", type="string", nullable=true, example="4242424242424242", description="Card number for new card"),
     *              @OA\Property(property="expiry_month", type="string", nullable=true, example="12", description="Card expiry month"),
     *              @OA\Property(property="expiry_year", type="string", nullable=true, example="2025", description="Card expiry year"),
     *              @OA\Property(property="cvv", type="string", nullable=true, example="123", description="Card CVV"),
     *              @OA\Property(property="cardholder_name", type="string", nullable=true, example="John Doe", description="Name on card"),
     *              @OA\Property(property="save_card", type="boolean", nullable=true, example=true, description="Save card for future use"),
     *              @OA\Property(property="notes", type="string", nullable=true, example="Handle with care")
     *          )
     *      ),
     *      @OA\Response(response=201, description="Order created successfully"),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function store(Request $request): JsonResponse
    {
        // Base validation
        $rules = [
            'product_id' => 'required|exists:products,id',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|in:credit_card,debit_card,cash_on_delivery',
            'notes' => 'nullable|string'
        ];

        // Payment method specific validation
        if (in_array($request->payment_method, ['credit_card', 'debit_card'])) {
            // Either card_id OR card details must be provided
            $rules = array_merge($rules, [
                'card_id' => 'nullable|exists:cards,id',
                'card_number' => 'nullable|string|size:16',
                'expiry_month' => 'nullable|string|size:2',
                'expiry_year' => 'nullable|string|size:4',
                'cvv' => 'nullable|string|min:3|max:4',
                'cardholder_name' => 'nullable|string|max:255',
                'save_card' => 'nullable|boolean'
            ]);
        }

        $request->validate($rules);

        // Additional validation for card payment
        if (in_array($request->payment_method, ['credit_card', 'debit_card'])) {
            $hasCardId = !empty($request->card_id);
            $hasCardDetails = !empty($request->card_number) && 
                            !empty($request->expiry_month) && 
                            !empty($request->expiry_year) && 
                            !empty($request->cvv) && 
                            !empty($request->cardholder_name);

            if (!$hasCardId && !$hasCardDetails) {
                return response()->json([
                    'error' => 'Either card_id or complete card details (card_number, expiry_month, expiry_year, cvv, cardholder_name) must be provided'
                ], 400);
            }

            if ($hasCardId && $hasCardDetails) {
                return response()->json([
                    'error' => 'Provide either card_id OR card details, not both'
                ], 400);
            }

            // If using saved card, verify it belongs to the user
            if ($hasCardId) {
                $card = Card::where('id', $request->card_id)
                           ->where('user_id', Auth::id())
                           ->first();
                
                if (!$card) {
                    return response()->json(['error' => 'Card not found or unauthorized'], 404);
                }
            }
        }

        $product = Product::findOrFail($request->product_id);
        
        // Check if product is available
        if ($product->status !== 'selling') {
            return response()->json(['error' => 'Product is not available'], 400);
        }

        // Can't buy your own product
        if ($product->seller_id === Auth::id()) {
            return response()->json(['error' => 'Cannot purchase your own product'], 400);
        }

        DB::beginTransaction();
        try {
            $cardId = $request->card_id;

            // If new card details provided, save the card (if requested)
            if (!$cardId && in_array($request->payment_method, ['credit_card', 'debit_card'])) {
                if ($request->save_card) {
                    // Create new card record
                    $card = Card::create([
                        'user_id' => Auth::id(),
                        'card_type' => $this->detectCardType($request->card_number),
                        'last_four' => substr($request->card_number, -4),
                        'cardholder_name' => $request->cardholder_name,
                        'expiry_month' => $request->expiry_month,
                        'expiry_year' => $request->expiry_year,
                        'payment_token' => $this->generatePaymentToken($request->card_number), // Hash or tokenize
                        'is_default' => Card::where('user_id', Auth::id())->count() === 0, // First card is default
                    ]);
                    
                    $cardId = $card->id;
                }
            }

            // Create order
            $order = Order::create([
                'buyer_id' => Auth::id(),
                'seller_id' => $product->seller_id,
                'product_id' => $product->id,
                'total_amount' => $product->price,
                'order_status' => Order::STATUS_PENDING,
                'tracking_status' => Order::TRACKING_ORDER_PLACED,
                'shipping_address' => $request->shipping_address,
                'notes' => $request->notes,
            ]);

            // Create payment record
            $payment = Payment::create([
                'order_id' => $order->id,
                'card_id' => $cardId, // Will be null for COD or if card wasn't saved
                'payment_method' => $request->payment_method,
                'payment_status' => Payment::STATUS_PENDING,
                'payment_amount' => $product->price,
            ]);

            NotificationService::notifyOrderCreated($order->load('product'));

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order->load(['product', 'seller', 'payment'])
            ], 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('Order creation failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to create order'], 500);
        }
    }

    /**
     * Detect card type from card number
     */
    private function detectCardType(string $cardNumber): string
    {
        $cardNumber = preg_replace('/\D/', '', $cardNumber);
        
        if (str_starts_with($cardNumber, '4')) {
            return 'Visa';
        } elseif (str_starts_with($cardNumber, '5') || str_starts_with($cardNumber, '2')) {
            return 'Mastercard';
        } elseif (str_starts_with($cardNumber, '3')) {
            return 'American Express';
        }
        
        return 'Unknown';
    }

    /**
     * Generate a secure payment token (you'd typically use a real payment processor)
     */
    private function generatePaymentToken(string $cardNumber): string
    {
        // In production, you'd use a real payment processor like Stripe
        // This is just a simple hash for demo purposes
        return hash('sha256', $cardNumber . config('app.key'));
    }

    /**
     * @OA\Post(
     *      path="/orders/{id}/accept",
     *      tags={"Orders"},
     *      summary="Accept an order (seller only)",
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Order accepted"),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function accept(Order $order): JsonResponse
    {
        if ($order->seller_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if (!$order->canBeAccepted()) {
            return response()->json(['error' => 'Order cannot be accepted'], 400);
        }

        $order->accept();

        NotificationService::notifyOrderAccepted($order->load('product'));

        return response()->json([
            'message' => 'Order accepted successfully',
            'order' => $order->fresh()
        ]);
    }

    /**
     * @OA\Post(
     *      path="/orders/{id}/reject",
     *      tags={"Orders"},
     *      summary="Reject an order (seller only)",
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Order rejected"),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function reject(Order $order): JsonResponse
    {
        if ($order->seller_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if (!$order->canBeAccepted()) {
            return response()->json(['error' => 'Order cannot be rejected'], 400);
        }

        $order->reject();

        NotificationService::notifyOrderRejected($order->load('product'));

        return response()->json([
            'message' => 'Order rejected successfully',
            'order' => $order->fresh()
        ]);
    }

    /**
     * @OA\Post(
     *      path="/orders/{id}/ship",
     *      tags={"Orders"},
     *      summary="Mark order as shipped (seller only)",
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Order shipped"),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function ship(Order $order): JsonResponse
    {
        if ($order->seller_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if (!$order->canBeShipped()) {
            return response()->json(['error' => 'Order cannot be shipped'], 400);
        }

        $order->ship();

        NotificationService::notifyOrderShipped($order->load('product'));

        return response()->json([
            'message' => 'Order marked as shipped',
            'order' => $order->fresh()
        ]);
    }

    /**
     * @OA\Post(
     *      path="/orders/{id}/complete",
     *      tags={"Orders"},
     *      summary="Complete an order (buyer confirms receipt)",
     *      @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=200, description="Order completed"),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function complete(Order $order): JsonResponse
    {
        if ($order->buyer_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Auto-mark as delivered first
        $order->markAsDelivered();
        
        if (!$order->canBeCompleted()) {
            return response()->json(['error' => 'Order cannot be completed'], 400);
        }

        $order->complete();

        // Mark payment as completed
        $order->payment->markAsCompleted('txn_' . time());

        NotificationService::notifyOrderCompleted($order->load('product'));

        return response()->json([
            'message' => 'Order completed successfully',
            'order' => $order->fresh()
        ]);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['product', 'buyer', 'seller', 'payment']);
        return response()->json($order);
    }
}