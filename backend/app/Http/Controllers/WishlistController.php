<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *     name="Wishlist",
 *     description="Operations about wishlist"
 * )
 */
class WishlistController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * @OA\Get(
     *      path="/wishlist",
     *      tags={"Wishlist"},
     *      summary="Get user's wishlist items",
     *      description="Returns current user's wishlist items with full product details",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              type="array",
     *              @OA\Items(ref="#/components/schemas/Wishlist")
     *          )
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function index(): JsonResponse
    {
        $wishlistItems = Wishlist::with([
                'product.category',
                'product.state', 
                'product.seller:id,full_name,email'
            ])
            ->where('user_id', Auth::id())
            ->get();

        return response()->json($wishlistItems);
    }

    /**
     * @OA\Post(
     *      path="/wishlist/add-product",
     *      tags={"Wishlist"},
     *      summary="Add product to wishlist",
     *      description="Add a product to the current user's wishlist",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"product_id"},
     *              @OA\Property(property="product_id", type="integer", example="1")
     *          )
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Product added to wishlist successfully",
     *          @OA\JsonContent(ref="#/components/schemas/Wishlist")
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Product not found"
     *      ),
     *      @OA\Response(
     *          response=400,
     *          description="Product already in wishlist or validation error"
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function addProduct(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id'
        ]);

        $product = Product::find($request->product_id);
        
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        // Check if product is available (not sold)
        if ($product->status !== 'selling') {
            return response()->json(['error' => 'Product is not available'], 400);
        }

        // Check if user is trying to add their own product to wishlist
        if ($product->seller_id === Auth::id()) {
            return response()->json(['error' => 'You cannot add your own product to wishlist'], 400);
        }

        // Check if product already exists in user's wishlist
        $existingWishlistItem = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingWishlistItem) {
            return response()->json(['error' => 'Product is already in your wishlist'], 400);
        }

        // Create new wishlist item
        $wishlistItem = Wishlist::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
        ]);

        $wishlistItem->load([
            'product.category',
            'product.state', 
            'product.seller:id,full_name,email'
        ]);

        return response()->json($wishlistItem, 201);
    }

    /**
     * @OA\Delete(
     *      path="/wishlist/remove-product/{product_id}",
     *      tags={"Wishlist"},
     *      summary="Remove product from wishlist",
     *      description="Remove a product from the current user's wishlist",
     *      @OA\Parameter(
     *          name="product_id",
     *          in="path",
     *          required=true,
     *          description="ID of the product to remove",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Product removed from wishlist successfully"
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Product not found in wishlist"
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function removeProduct($productId): JsonResponse
    {
        $wishlistItem = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->first();

        if (!$wishlistItem) {
            return response()->json(['error' => 'Product not found in wishlist'], 404);
        }

        $wishlistItem->delete();

        return response()->json(['message' => 'Product removed from wishlist successfully']);
    }

    /**
     * @OA\Delete(
     *      path="/wishlist/clear",
     *      tags={"Wishlist"},
     *      summary="Clear user's wishlist",
     *      description="Remove all items from the current user's wishlist",
     *      @OA\Response(
     *          response=200,
     *          description="Wishlist cleared successfully"
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function clear(): JsonResponse
    {
        Wishlist::where('user_id', Auth::id())->delete();

        return response()->json(['message' => 'Wishlist cleared successfully']);
    }

    /**
     * @OA\Get(
     *      path="/wishlist/count",
     *      tags={"Wishlist"},
     *      summary="Get wishlist items count",
     *      description="Get the total number of items in the current user's wishlist",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              @OA\Property(property="count", type="integer", example="5")
     *          )
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function count(): JsonResponse
    {
        $count = Wishlist::where('user_id', Auth::id())->count();

        return response()->json(['count' => $count]);
    }

    /**
     * @OA\Get(
     *      path="/wishlist/{id}",
     *      tags={"Wishlist"},
     *      summary="Get specified wishlist item",
     *      description="Returns specified wishlist item (only if it belongs to current user)",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the wishlist item",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Wishlist")
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Wishlist item not found"
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function show(Wishlist $wishlist): JsonResponse
    {
        // Ensure the wishlist item belongs to the authenticated user
        if ($wishlist->user_id !== Auth::id()) {
            return response()->json(['error' => 'Wishlist item not found'], 404);
        }

        $wishlist->load([
            'product.category',
            'product.state', 
            'product.seller:id,full_name,email'
        ]);
        
        return response()->json($wishlist);
    }

    public function destroy(Wishlist $wishlist): JsonResponse
    {
        // Ensure the wishlist item belongs to the authenticated user
        if ($wishlist->user_id !== Auth::id()) {
            return response()->json(['error' => 'Wishlist item not found'], 404);
        }

        $wishlist->delete();
        return response()->json(['message' => 'Wishlist item deleted successfully']);
    }
}