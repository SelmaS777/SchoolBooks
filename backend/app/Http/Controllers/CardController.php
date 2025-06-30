<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *     name="Credit Cards",
 *     description="API Endpoints for managing user credit cards"
 * )
 */
class CardController extends Controller
{
    /**
     * @OA\Get(
     *     path="/credit-cards",
     *     summary="Get all credit cards for authenticated user",
     *     tags={"Credit Cards"},
     *     @OA\Response(
     *         response=200,
     *         description="List of user's credit cards",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Card")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function index(): JsonResponse
    {
        $cards = Auth::user()->cards;
        return response()->json($cards);
    }

    /**
     * @OA\Post(
     *     path="/credit-cards",
     *     summary="Add a new credit card",
     *     tags={"Credit Cards"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="card_number", type="string", example="4242424242424242"),
     *             @OA\Property(property="cardholder_name", type="string", example="John Smith"),
     *             @OA\Property(property="expiry_month", type="string", example="12"),
     *             @OA\Property(property="expiry_year", type="string", example="2025"),
     *             @OA\Property(property="cvv", type="string", example="123"),
     *             @OA\Property(property="is_default", type="boolean", example="true")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Credit card added successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Card")
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'card_number' => 'required|string|min:13|max:19',
            'cardholder_name' => 'required|string|max:255',
            'expiry_month' => 'required|string|min:1|max:2',
            'expiry_year' => 'required|string|min:2|max:4',
            'cvv' => 'required|string|min:3|max:4',
            'is_default' => 'boolean',
        ]);

        $user = Auth::user();
        
        // This is where you would normally integrate with a payment processor
        // to validate the card and get a token
        $paymentToken = 'tok_' . uniqid(); // Simulated token
        
        // Determine card type based on first digit
        $cardType = $this->getCardType(substr($validated['card_number'], 0, 1));
        
        // Create new card
        $card = new Card([
            'user_id' => $user->id,
            'card_type' => $cardType,
            'last_four' => substr($validated['card_number'], -4),
            'cardholder_name' => $validated['cardholder_name'],
            'expiry_month' => $validated['expiry_month'],
            'expiry_year' => $validated['expiry_year'],
            'payment_token' => $paymentToken,
            'is_default' => $validated['is_default'] ?? false,
        ]);
        
        // If this is the default card, unset any existing default
        if ($card->is_default) {
            $user->cards()->update(['is_default' => false]);
        }
        
        $card->save();
        
        return response()->json($card, 201);
    }

    /**
     * @OA\Get(
     *     path="/credit-cards/{id}",
     *     summary="Get a specific credit card",
     *     tags={"Credit Cards"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Credit Card ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Credit card details",
     *         @OA\JsonContent(ref="#/components/schemas/Card")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Credit card not found"
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function show(Card $card): JsonResponse
    {
        // Make sure the card belongs to the authenticated user
        if ($card->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        return response()->json($card);
    }

    /**
     * @OA\Put(
     *     path="/credit-cards/{id}",
     *     summary="Update credit card details",
     *     tags={"Credit Cards"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Credit Card ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="cardholder_name", type="string", example="Jane Smith"),
     *             @OA\Property(property="expiry_month", type="string", example="11"),
     *             @OA\Property(property="expiry_year", type="string", example="2026"),
     *             @OA\Property(property="is_default", type="boolean", example="true")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Credit card updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Card")
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function update(Request $request, Card $card): JsonResponse
    {
        // Make sure the card belongs to the authenticated user
        if ($card->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'cardholder_name' => 'sometimes|string|max:255',
            'expiry_month' => 'sometimes|string|min:1|max:2',
            'expiry_year' => 'sometimes|string|min:2|max:4',
            'is_default' => 'sometimes|boolean',
        ]);
        
        // If this is being set as the default card, unset any existing default
        if (isset($validated['is_default']) && $validated['is_default']) {
            Auth::user()->cards()->where('id', '!=', $card->id)
                ->update(['is_default' => false]);
        }
        
        $card->update($validated);
        
        return response()->json($card);
    }

    /**
     * @OA\Delete(
     *     path="/credit-cards/{id}",
     *     summary="Delete a credit card",
     *     tags={"Credit Cards"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Credit Card ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Credit card deleted successfully"
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function destroy(Card $card): JsonResponse
    {
        // Make sure the card belongs to the authenticated user
        if ($card->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // Handle the case where the default card is being deleted
        $wasDefault = $card->is_default;
        
        $card->delete();
        
        // If this was the default card and user has other cards, set a new default
        if ($wasDefault) {
            $newDefault = Auth::user()->cards()->first();
            if ($newDefault) {
                $newDefault->update(['is_default' => true]);
            }
        }
        
        return response()->json(null, 204);
    }

    /**
     * @OA\Post(
     *     path="/credit-cards/{id}/make-default",
     *     summary="Set a credit card as default",
     *     tags={"Credit Cards"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Credit Card ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Card set as default successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Card")
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function makeDefault(Card $card): JsonResponse
    {
        // Make sure the card belongs to the authenticated user
        if ($card->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // Unset any existing default
        Auth::user()->cards()->update(['is_default' => false]);
        
        // Set this card as default
        $card->update(['is_default' => true]);
        
        return response()->json($card);
    }
    
    /**
     * Determine card type based on first digit
     */
    private function getCardType(string $firstDigit): string
    {
        switch ($firstDigit) {
            case '4':
                return 'Visa';
            case '5':
                return 'MasterCard';
            case '3':
                return 'American Express';
            case '6':
                return 'Discover';
            default:
                return 'Unknown';
        }
    }
}