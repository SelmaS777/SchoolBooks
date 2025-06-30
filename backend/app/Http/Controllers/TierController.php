<?php

namespace App\Http\Controllers;

use App\Models\Tier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Tiers",
 *     description="API Endpoints for subscription tiers"
 * )
 */
class TierController extends Controller
{
    /**
     * @OA\Get(
     *     path="/tiers",
     *     summary="Get all tiers",
     *     tags={"Tiers"},
     *     @OA\Response(
     *         response=200,
     *         description="List of tiers",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Tier")
     *         )
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        return response()->json(Tier::all());
    }

    /**
     * @OA\Get(
     *     path="/tiers/{id}",
     *     summary="Get a specific tier",
     *     tags={"Tiers"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Tier ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/Tier")
     *     )
     * )
     */
    public function show(Tier $tier): JsonResponse
    {
        return response()->json($tier);
    }

    /**
     * @OA\Get(
     *     path="/all-tiers",
     *     summary="Get all tiers for dropdowns",
     *     tags={"Tiers"},
     *     @OA\Response(
     *         response=200,
     *         description="All tiers returned as key-value pairs",
     *         @OA\JsonContent(
     *             type="object",
     *             example={"1": "Basic", "2": "Standard", "3": "Premium"}
     *         )
     *     )
     * )
     */
    public function getAll(): JsonResponse
    {
        $tiers = Tier::all()->pluck('name', 'id');
        return response()->json($tiers);
    }
}