<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Payments",
 *     description="Operations related to payments"
 * )
 */
class PaymentController extends Controller
{
    /**
     * @OA\Get(
     *      path="/payments",
     *      tags={"Payments"},
     *      summary="Get list of payments",
     *      description="Returns list of payments",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              type="array",
     *              @OA\Items(ref="#/components/schemas/Payment")
     *          )
     *      ),
     *   security={{"bearerAuth": {}}}
     * )
     */
    public function index(): JsonResponse
    {
        return response()->json(Payment::all());
    }

    /**
     * @OA\Post(
     *      path="/payments",
     *      tags={"Payments"},
     *      summary="Create a new payment",
     *      description="Create a new payment",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/Payment")
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Payment")
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function store(Request $request): JsonResponse
    {
        return response()->json(Payment::create($request->all()), 201);
    }

    /**
     * @OA\Get(
     *      path="/payments/{id}",
     *      tags={"Payments"},
     *      summary="Get specified payment",
     *      description="Returns specified payment",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the payment",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Payment")
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function show(Payment $payment): JsonResponse
    {
        return response()->json($payment);
    }

    /**
     * @OA\Put(
     *      path="/payments/{id}",
     *      tags={"Payments"},
     *      summary="Update specified payment",
     *      description="Update specified payment",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the payment",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/Payment")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Payment")
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function update(Request $request, Payment $payment): JsonResponse
    {
        return response()->json($payment->update($request->all()));
    }

    /**
     * @OA\Delete(
     *      path="/payments/{id}",
     *      tags={"Payments"},
     *      summary="Delete specified payment",
     *      description="Delete specified payment",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the payment",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation"
     *      ),
     *     security={{"bearerAuth": {}}}
     * )
     */
    public function destroy(Payment $payment): JsonResponse
    {
        return response()->json($payment->delete());
    }
}
