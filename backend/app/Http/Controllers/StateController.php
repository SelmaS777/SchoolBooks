<?php

namespace App\Http\Controllers;

use App\Models\State;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="States",
 *     description="API Endpoints for Book States"
 * )
 */
class StateController extends Controller
{
    /**
     * @OA\Get(
     *     path="/states",
     *     summary="Get all book states",
     *     tags={"States"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/State")
     *         )
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        $states = State::all();
        return response()->json($states);
    }

    /**
     * @OA\Post(
     *     path="/states",
     *     summary="Create a new book state",
     *     tags={"States"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/State")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Book state created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/State")
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:states',
            'description' => 'nullable|string',
        ]);

        $state = State::create($validated);
        return response()->json($state, 201);
    }

    /**
     * @OA\Get(
     *     path="/states/{id}",
     *     summary="Get a specific book state",
     *     tags={"States"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="State ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/State")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="State not found"
     *     )
     * )
     */
    public function show(State $state): JsonResponse
    {
        return response()->json($state);
    }

    /**
     * @OA\Put(
     *     path="/states/{id}",
     *     summary="Update a book state",
     *     tags={"States"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="State ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/State")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="State updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/State")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="State not found"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function update(Request $request, State $state): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:states,name,' . $state->id,
            'description' => 'nullable|string',
        ]);

        $state->update($validated);
        return response()->json($state);
    }

    /**
     * @OA\Delete(
     *     path="/states/{id}",
     *     summary="Delete a book state",
     *     tags={"States"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="State ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="State deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="State not found"
     *     )
     * )
     */
    public function destroy(State $state): JsonResponse
    {
        $state->delete();
        return response()->json(null, 204);
    }


/**
 * @OA\Get(
 *     path="/all-states",
 *     summary="Get all book states for dropdowns",
 *     tags={"States"},
 *     @OA\Response(
 *         response=200,
 *         description="All states returned as key-value pairs",
 *         @OA\JsonContent(
 *             type="object",
 *             example={"1": "Good", "2": "Very Good", "3": "Excellent"}
 *         )
 *     )
 * )
 */
public function getAll(): JsonResponse
{
    $states = State::all()->pluck('name', 'id');
    return response()->json($states);
}
}