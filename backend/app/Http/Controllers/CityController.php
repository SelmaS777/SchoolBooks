<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Cities",
 *     description="API Endpoints for managing cities"
 * )
 */
class CityController extends Controller
{
    /**
     * @OA\Get(
     *     path="/cities",
     *     summary="Get all cities",
     *     tags={"Cities"},
     *     @OA\Response(
     *         response=200,
     *         description="List of cities",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/City")
     *         )
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        return response()->json(City::all());
    }

    /**
     * @OA\Post(
     *     path="/cities",
     *     summary="Create a new city",
     *     tags={"Cities"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/City")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="City created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/City")
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:cities',
        ]);

        $city = City::create($validated);
        return response()->json($city, 201);
    }

    /**
     * @OA\Get(
     *     path="/cities/{id}",
     *     summary="Get a specific city",
     *     tags={"Cities"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="City ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/City")
     *     )
     * )
     */
    public function show(City $city): JsonResponse
    {
        return response()->json($city);
    }

    /**
     * @OA\Put(
     *     path="/cities/{id}",
     *     summary="Update a city",
     *     tags={"Cities"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="City ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/City")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="City updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/City")
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function update(Request $request, City $city): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:cities,name,' . $city->id,
        ]);

        $city->update($validated);
        return response()->json($city);
    }

    /**
     * @OA\Delete(
     *     path="/cities/{id}",
     *     summary="Delete a city",
     *     tags={"Cities"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="City ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="City deleted successfully"
     *     ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function destroy(City $city): JsonResponse
    {
        $city->delete();
        return response()->json(null, 204);
    }

    /**
     * @OA\Get(
     *     path="/all-cities",
     *     summary="Get all cities for dropdowns",
     *     tags={"Cities"},
     *     @OA\Response(
     *         response=200,
     *         description="All cities returned as key-value pairs",
     *         @OA\JsonContent(
     *             type="object",
     *             example={"1": "Sarajevo", "2": "Mostar", "3": "Banja Luka"}
     *         )
     *     )
     * )
     */
    public function getAll(): JsonResponse
    {
        $cities = City::all()->pluck('name', 'id');
        return response()->json($cities);
    }
}