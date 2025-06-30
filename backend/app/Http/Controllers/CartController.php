<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

/**
 * @OA\Tag(
 *     name="Carts",
 *     description="Operations about carts"
 * )
 */
class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * @OA\Get(
     *      path="/carts",
     *      tags={"Carts"},
     *      summary="Get user's cart items",
     *      description="Returns current user's cart items with full product details",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              type="array",
     *              @OA\Items(ref="#/components/schemas/Cart")
     *          )
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function index(): JsonResponse
    {
        $cartItems = Cart::with([
                'product.category',
                'product.state', 
                'product.seller:id,full_name,email'
            ])
            ->where('user_id', Auth::id())
            ->get();

        return response()->json($cartItems);
    }

    /**
     * @OA\Post(
     *      path="/carts/add-product",
     *      tags={"Carts"},
     *      summary="Add product to cart",
     *      description="Add a product to the current user's cart",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"product_id"},
     *              @OA\Property(property="product_id", type="integer", example="1")
     *          )
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Product added to cart successfully",
     *          @OA\JsonContent(ref="#/components/schemas/Cart")
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Product not found"
     *      ),
     *      @OA\Response(
     *          response=400,
     *          description="Product already in cart or validation error"
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

        // Check if product is available for purchase (not sold)
        if ($product->status !== 'selling') {
            return response()->json(['error' => 'Product is not available for purchase'], 400);
        }

        // Check if user is trying to add their own product to cart
        if ($product->seller_id === Auth::id()) {
            return response()->json(['error' => 'You cannot add your own product to cart'], 400);
        }

        // Check if product already exists in user's cart
        $existingCartItem = Cart::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingCartItem) {
            return response()->json(['error' => 'Product is already in your cart'], 400);
        }

        // Create new cart item (quantity always 1 for one-off products)
        $cartItem = Cart::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
            'quantity' => 1
        ]);

        $cartItem->load([
            'product.category',
            'product.state', 
            'product.seller:id,full_name,email'
        ]);

        return response()->json($cartItem, 201);
    }

    /**
     * @OA\Delete(
     *      path="/carts/remove-product/{product_id}",
     *      tags={"Carts"},
     *      summary="Remove product from cart",
     *      description="Remove a product from the current user's cart",
     *      @OA\Parameter(
     *          name="product_id",
     *          in="path",
     *          required=true,
     *          description="ID of the product to remove",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Product removed from cart successfully"
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Product not found in cart"
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function removeProduct($productId): JsonResponse
    {
        $cartItem = Cart::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Product not found in cart'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Product removed from cart successfully']);
    }

    /**
     * @OA\Delete(
     *      path="/carts/clear",
     *      tags={"Carts"},
     *      summary="Clear user's cart",
     *      description="Remove all items from the current user's cart",
     *      @OA\Response(
     *          response=200,
     *          description="Cart cleared successfully"
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function clear(): JsonResponse
    {
        Cart::where('user_id', Auth::id())->delete();

        return response()->json(['message' => 'Cart cleared successfully']);
    }

    /**
     * @OA\Get(
     *      path="/carts/count",
     *      tags={"Carts"},
     *      summary="Get cart items count",
     *      description="Get the total number of items in the current user's cart",
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
        $count = Cart::where('user_id', Auth::id())->count();

        return response()->json(['count' => $count]);
    }

    /**
     * @OA\Get(
     *      path="/carts/{id}",
     *      tags={"Carts"},
     *      summary="Get specified cart item",
     *      description="Returns specified cart item (only if it belongs to current user)",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the cart item",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Cart")
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Cart item not found"
     *      ),
     *      security={{"bearerAuth": {}}}
     * )
     */
    public function show(Cart $cart): JsonResponse
    {
        // Ensure the cart item belongs to the authenticated user
        if ($cart->user_id !== Auth::id()) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        $cart->load([
            'product.category',
            'product.state', 
            'product.seller:id,full_name,email'
        ]);
        
        return response()->json($cart);
    }

    public function destroy(Cart $cart): JsonResponse
    {
        // Ensure the cart item belongs to the authenticated user
        if ($cart->user_id !== Auth::id()) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        $cart->delete();
        return response()->json(['message' => 'Cart item deleted successfully']);
    }
}