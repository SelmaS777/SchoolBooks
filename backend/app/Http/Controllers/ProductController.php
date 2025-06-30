<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Products",
 *     description="Operations related to products"
 * )
 */
class ProductController extends Controller
{

/**
 * @OA\Get(
 *      path="/products",
 *      tags={"Products"},
 *      summary="Get list of products with filtering, sorting options and pagination",
 *      description="Returns paginated list of products. Default shows only products for sale.",
 *      @OA\Parameter(
 *          name="search",
 *          in="query",
 *          description="Search term for product name, description or author",
 *          required=false,
 *          @OA\Schema(type="string")
 *      ),
 *      @OA\Parameter(
 *          name="category_id",
 *          in="query",
 *          description="Filter products by category ID",
 *          required=false,
 *          @OA\Schema(type="integer")
 *      ),
 *      @OA\Parameter(
 *          name="min_price",
 *          in="query",
 *          description="Minimum price filter",
 *          required=false,
 *          @OA\Schema(type="number", format="float")
 *      ),
 *      @OA\Parameter(
 *          name="max_price",
 *          in="query",
 *          description="Maximum price filter",
 *          required=false,
 *          @OA\Schema(type="number", format="float")
 *      ),
 *      @OA\Parameter(
 *          name="status",
 *          in="query",
 *          description="Filter products by status (default: selling)",
 *          required=false,
 *          @OA\Schema(type="string", enum={"selling", "sold", "bought", "all"})
 *      ),
 *      @OA\Parameter(
 *          name="seller_id",
 *          in="query",
 *          description="Filter products by seller ID",
 *          required=false,
 *          @OA\Schema(type="integer")
 *      ),
 *      @OA\Parameter(
 *          name="city_id",
 *          in="query",
 *          description="Filter products by seller's city ID",
 *          required=false,
 *          @OA\Schema(type="integer")
 *      ),
 *      @OA\Parameter(
 *          name="buyer_id",
 *          in="query",
 *          description="Filter products by buyer ID",
 *          required=false,
 *          @OA\Schema(type="integer")
 *      ),
 *      @OA\Parameter(
 *          name="sort_price",
 *          in="query",
 *          description="Sort direction by price (asc or desc)",
 *          required=false,
 *          @OA\Schema(type="string", enum={"asc", "desc"})
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="current_page", type="integer"),
 *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Product")),
 *              @OA\Property(property="total", type="integer")
 *          )
 *      ),
 *     security={{"bearerAuth": {}}}
 * )
 */
public function index(Request $request): JsonResponse
{
    // Eager load necessary relationships
    $query = Product::with(['category', 'state', 'seller', 'seller.city', 'buyer']);

    // Default to showing only products for sale unless specified otherwise
    if (!$request->has('status') || $request->input('status') !== 'all') {
        $status = $request->input('status', 'selling');
        $query->where('status', $status);
    }

    // Search by name, description or author
    if ($request->has('search')) {
        $searchTerm = $request->input('search');
        $query->where(function($q) use ($searchTerm) {
            $q->whereRaw('LOWER(name) LIKE ?', ["%".strtolower($searchTerm)."%"])
              ->orWhereRaw('LOWER(description) LIKE ?', ["%".strtolower($searchTerm)."%"])
              ->orWhereRaw('LOWER(author) LIKE ?', ["%".strtolower($searchTerm)."%"]);
        });
    }

    // Filter by category
    if ($request->has('category_id')) {
        $query->where('category_id', $request->input('category_id'));
    }

    // Filter by price range
    if ($request->has('min_price')) {
        $query->where('price', '>=', $request->input('min_price'));
    }
    
    if ($request->has('max_price')) {
        $query->where('price', '<=', $request->input('max_price'));
    }
    
    // Filter by seller
    if ($request->has('seller_id')) {
        $query->where('seller_id', $request->input('seller_id'));
    }
    
    // Filter by seller's city - Using a join for efficiency
    if ($request->has('city_id')) {
        $cityId = $request->input('city_id');
        $query->whereHas('seller', function($q) use ($cityId) {
            $q->where('city_id', $cityId);
        });
    }
    
    // Filter by buyer
    if ($request->has('buyer_id')) {
        $query->where('buyer_id', $request->input('buyer_id'));
    }

    // Sort by price
    if ($request->has('sort_price')) {
        $direction = strtolower($request->input('sort_price')) === 'desc' ? 'desc' : 'asc';
        $query->orderBy('price', $direction);
    } else {
        // Default sorting - newest first
        $query->orderBy('created_at', 'desc');
    }

    // Get the page size from request or use default
    $perPage = $request->input('per_page', 15);
    
    // Return paginated results
    return response()->json($query->paginate($perPage));
}

    /**
 * @OA\Post(
 *      path="/products",
 *      tags={"Products"},
 *      summary="Create a new product",
 *      description="Create a new product (tier restrictions apply)",
 *      @OA\RequestBody(
 *          required=true,
 *          @OA\JsonContent(ref="#/components/schemas/Product")
 *      ),
 *      @OA\Response(
 *          response=201,
 *          description="Successful operation",
 *          @OA\JsonContent(ref="#/components/schemas/Product")
 *      ),
 *      @OA\Response(
 *          response=403,
 *          description="Tier limit reached or insufficient permissions"
 *      ),
 *     security={{"bearerAuth": {}}}
 * )
 */
public function store(Request $request): JsonResponse
{
    $user = auth('api')->user();
    
    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }
    
    // Load user with tier
    $user->load('tier');
    
    // Check if user's tier allows posting products
    if ($user->tier->max_listings === 0) {
        return response()->json([
            'error' => 'Your current tier (' . $user->tier->name . ') does not allow posting products. Please upgrade your subscription.'
        ], 403);
    }
    
    // Count current active listings
    $currentListings = $user->sellingProducts()
        ->where('status', 'selling')
        ->count();
    
    // Check if user has reached their tier limit
    if ($currentListings >= $user->tier->max_listings) {
        return response()->json([
            'error' => 'You have reached your tier limit of ' . $user->tier->max_listings . ' active listings. Please upgrade your subscription or remove some existing listings.',
            'current_listings' => $currentListings,
            'max_listings' => $user->tier->max_listings
        ], 403);
    }
    
    // Set the seller_id to the authenticated user
    $productData = $request->all();
    $productData['seller_id'] = $user->id;
    
    $product = Product::create($productData);
    
    return response()->json($product->load(['category', 'state', 'seller']), 201);
}

   /**
 * @OA\Get(
 *      path="/products/{id}",
 *      tags={"Products"},
 *      summary="Get specified product",
 *      description="Returns specified product with relationships",
 *      @OA\Parameter(
 *          name="id",
 *          in="path",
 *          required=true,
 *          description="ID of the product",
 *          @OA\Schema(type="integer")
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(ref="#/components/schemas/Product")
 *      ),
 *     security={{"bearerAuth": {}}}
 * )
 */
public function show(Product $product): JsonResponse
{
    return response()->json($product->load(['category', 'state', 'seller', 'buyer']));
}

    /**
     * @OA\Put(
     *      path="/products/{id}",
     *      tags={"Products"},
     *      summary="Update specified product",
     *      description="Update specified product",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the product",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/Product")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Product")
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        return response()->json($product->update($request->all()));
    }

    /**
     * @OA\Delete(
     *      path="/products/{id}",
     *      tags={"Products"},
     *      summary="Delete specified product",
     *      description="Delete specified product",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the product",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function destroy(Product $product): JsonResponse
    {
        return response()->json($product->delete());
    }
}
