<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Events\NotificationEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Users",
 *     description="API Endpoints for managing users"
 * )
 */
class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/users",
     *     summary="Get all users",
     *     tags={"Users"},
     *     @OA\Response(
     *         response=200,
     *         description="List of users",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/User")
     *         )
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function index(): JsonResponse
    {
        return response()->json(User::with('city')->get());
    }

    /**
     * @OA\Post(
     *     path="/users",
     *     summary="Create a new user",
     *     tags={"Users"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function store(Request $request): JsonResponse
{
    $user = User::create($request->all());
    
    // Send welcome notification
    event(new NotificationEvent(
        'Welcome to B-Shop! Your account has been created successfully.',
        $user->id,
        'info'
    ));
    
    return response()->json($user, 201);
}

    /**
     * @OA\Get(
     *     path="/users/{id}",
     *     summary="Get a specific user",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="User ID",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User found",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function show(User $user): JsonResponse
    {
        $user->load('city');
        return response()->json($user);
    }

    /**
     * @OA\Put(
     *     path="/users/{id}",
     *     summary="Update a specific user",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="User ID",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $user->update($request->all());
        return response()->json($user);
    }

    /**
     * @OA\Delete(
     *     path="/users/{id}",
     *     summary="Delete a specific user",
     *     tags={"Users"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="User ID",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="User deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found"
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function destroy(User $user): JsonResponse
    {
        return response()->json($user->delete());
    }


/**
 * @OA\Get(
 *     path="/users/{id}/selling-products",
 *     summary="Get products listed for sale by a specific user",
 *     tags={"Users"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="User ID",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of products for sale by user",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Product")
 *         )
 *     ),
 *     security={{"bearerAuth": {}}}
 * )
 */
public function sellingProducts(User $user): JsonResponse
{
    return response()->json(
        $user->sellingProducts()
            ->where('status', 'selling')
            ->with(['category', 'state'])
            ->get()
    );
}

/**
 * @OA\Get(
 *     path="/users/{id}/bought-products",
 *     summary="Get products bought by a specific user",
 *     tags={"Users"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="User ID",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of products bought by user",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Product")
 *         )
 *     ),
 *     security={{"bearerAuth": {}}}
 * )
 */
public function boughtProducts(User $user): JsonResponse
{
    return response()->json($user->boughtProducts()->with(['category', 'state', 'seller'])->get());
}

/**
 * @OA\Get(
 *     path="/users/{id}/sold-products",
 *     summary="Get products that have been sold by a specific user",
 *     tags={"Users"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="User ID",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of products sold by user",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Product")
 *         )
 *     ),
 *     security={{"bearerAuth": {}}}
 * )
 */
public function soldProducts(User $user): JsonResponse
{
    return response()->json(
        $user->sellingProducts()
            ->where('status', 'sold')
            ->with(['category', 'state', 'buyer'])
            ->get()
    );
}

/**
 * @OA\Put(
 *     path="/profile",
 *     summary="Update authenticated user's profile",
 *     description="Allows users to update their own profile information",
 *     tags={"Profile"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="full_name", type="string", example="John Smith"),
 *             @OA\Property(property="phone_number", type="string", example="+38761234567"),
 *             @OA\Property(property="city_id", type="integer", example=1),
 *             @OA\Property(property="personal_details", type="string", example="Some additional information about me"),
 *             @OA\Property(property="image_url", type="string", example="https://example.com/profile.jpg")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Profile updated successfully",
 *         @OA\JsonContent(ref="#/components/schemas/User")
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     ),
 *     security={{"bearerAuth": {}}}
 * )
 */
public function updateProfile(Request $request): JsonResponse
{
    // Get the authenticated user
    $user = auth('api')->user();
    
    // Validate the request data
    $validated = $request->validate([
        'full_name' => 'sometimes|string|max:255',
        'phone_number' => 'sometimes|string|max:20',
        'city_id' => 'sometimes|exists:cities,id',
        'personal_details' => 'sometimes|nullable|string',
        'image_url' => 'sometimes|nullable|string|url',
    ]);
    
    // Update the user
    $user->update($validated);
    
    // Load related entities
    $user->load(['city', 'tier', 'cards']);
    
    return response()->json($user);
}

/**
 * @OA\Put(
 *     path="/users/{id}/tier",
 *     summary="Update user's subscription tier",
 *     tags={"Users"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="User ID",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="tier_id", type="integer", example=2)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Tier updated successfully",
 *         @OA\JsonContent(ref="#/components/schemas/User")
 *     ),
 *     security={{"bearerAuth": {}}}
 * )
 */
public function updateTier(Request $request, User $user): JsonResponse
{
    $validated = $request->validate([
        'tier_id' => 'required|exists:tiers,id'
    ]);
    
    $user->update(['tier_id' => $validated['tier_id']]);
    $user->load(['tier', 'city']);
    
   
    
    return response()->json($user);
}

/**
 * @OA\Put(
 *     path="/profile/tier",
 *     summary="Update authenticated user's subscription tier",
 *     tags={"Profile"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="tier_id", type="integer", example=2)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Tier updated successfully",
 *         @OA\JsonContent(ref="#/components/schemas/User")
 *     ),
 *     security={{"bearerAuth": {}}}
 * )
 */
public function updateProfileTier(Request $request): JsonResponse
{
    $user = auth('api')->user();
    
    $validated = $request->validate([
        'tier_id' => 'required|exists:tiers,id'
    ]);
    
    $user->update(['tier_id' => $validated['tier_id']]);
    $user->load(['tier', 'city']);
    
   
    
    return response()->json($user);
}

/**
 * @OA\Get(
 *     path="/profile/listing-status",
 *     summary="Get current user's listing status and tier limits",
 *     tags={"Profile"},
 *     @OA\Response(
 *         response=200,
 *         description="Listing status information",
 *         @OA\JsonContent(
 *             @OA\Property(property="tier_name", type="string", example="Premium"),
 *             @OA\Property(property="max_listings", type="integer", example=20),
 *             @OA\Property(property="current_listings", type="integer", example=5),
 *             @OA\Property(property="remaining_listings", type="integer", example=15),
 *             @OA\Property(property="can_post", type="boolean", example=true)
 *         )
 *     ),
 *     security={{"bearerAuth": {}}}
 * )
 */
public function getListingStatus(): JsonResponse
{
    $user = auth('api')->user();
    $user->load('tier');
    
    $currentListings = $user->sellingProducts()
        ->where('status', 'selling')
        ->count();
    
    $maxListings = $user->tier->max_listings;
    $canPost = $maxListings > 0 && $currentListings < $maxListings;
    
    return response()->json([
        'tier_name' => $user->tier->name,
        'max_listings' => $maxListings,
        'current_listings' => $currentListings,
        'remaining_listings' => max(0, $maxListings - $currentListings),
        'can_post' => $canPost,
        'featured_listings_allowed' => $user->tier->featured_listings,
        'priority_support' => $user->tier->priority_support
    ]);
}

}
