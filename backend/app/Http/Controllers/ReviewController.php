<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Reviews",
 *     description="Operations related to reviews"
 * )
 */
class ReviewController extends Controller
{
    /**
     * @OA\Get(
     *      path="/reviews",
     *      tags={"Reviews"},
     *      summary="Get list of reviews",
     *      description="Returns list of reviews",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              type="array",
     *              @OA\Items(ref="#/components/schemas/Review")
     *          )
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function index(): JsonResponse
    {
        return response()->json(Review::all());
    }

    /**
     * @OA\Post(
     *      path="/reviews",
     *      tags={"Reviews"},
     *      summary="Create a new review",
     *      description="Create a new review",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/Review")
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Review")
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function store(Request $request): JsonResponse
    {
        return response()->json(Review::create($request->all()), 201);
    }

    /**
     * @OA\Get(
     *      path="/reviews/{id}",
     *      tags={"Reviews"},
     *      summary="Get specified review",
     *      description="Returns specified review",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the review",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Review")
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function show(Review $review): JsonResponse
    {
        return response()->json($review);
    }

    /**
     * @OA\Put(
     *      path="/reviews/{id}",
     *      tags={"Reviews"},
     *      summary="Update specified review",
     *      description="Update specified review",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the review",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/Review")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Review")
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function update(Request $request, Review $review): JsonResponse
    {
        return response()->json($review->update($request->all()));
    }

    /**
     * @OA\Delete(
     *      path="/reviews/{id}",
     *      tags={"Reviews"},
     *      summary="Delete specified review",
     *      description="Delete specified review",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the review",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function destroy(Review $review): JsonResponse
    {
        return response()->json($review->delete());
    }
}
