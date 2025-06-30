<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Categories",
 *     description="Operations about categories"
 * )
 */
class CategoryController extends Controller
{
    /**
     * @OA\Get(
     *      path="/categories",
     *      tags={"Categories"},
     *      summary="Get list of categories",
     *      description="Returns list of categories",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              type="array",
     *              @OA\Items(ref="#/components/schemas/Category")
     *          )
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function index(): JsonResponse
    {
        return response()->json(Category::all());
    }

    /**
     * @OA\Post(
     *      path="/categories",
     *      tags={"Categories"},
     *      summary="Create a new category",
     *      description="Create a new category",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/Category")
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Category")
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function store(Request $request): JsonResponse
    {
        return response()->json(Category::create($request->all()), 201);
    }

    /**
     * @OA\Get(
     *      path="/categories/{id}",
     *      tags={"Categories"},
     *      summary="Get specified category",
     *      description="Returns specified category",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the category",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Category")
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function show(Category $category): JsonResponse
    {
        return response()->json($category);
    }

    /**
     * @OA\Put(
     *      path="/categories/{id}",
     *      tags={"Categories"},
     *      summary="Update specified category",
     *      description="Update specified category",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the category",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/Category")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Category")
     *      ),
     *    security={{"bearerAuth": {}}}
     * )
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        return response()->json($category->update($request->all()));
    }

    /**
     * @OA\Delete(
     *      path="/categories/{id}",
     *      tags={"Categories"},
     *      summary="Delete specified category",
     *      description="Delete specified category",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the category",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      ),
     *    security={{"bearerAuth": {}}}
     * )
     */
    public function destroy(Category $category): JsonResponse
    {
        return response()->json($category->delete());
    }
}
